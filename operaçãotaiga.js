//import { Engine, Character } from "./engine";

const tileDict = {
    b: new Character('\u263C',['blue', 'bg-green']),
    c: new Character('-',['white', 'bg-green']),
    g: new Character('*',['white', 'bg-green']),
    x: new Character('♥',['red', 'bg-green']),
    e: new Character('\u263B',['entity']),
    lake: new Character('█',['blue', 'bg-blue']),
    lakeborder: new Character('▒',['blue', 'bg-green']),
    rock0: new Character('·',['red', 'bg-green']),
    rock1: new Character('·',['black', 'bg-green']),
    treeCrown: new Character('▲',['crown', 'bg-green']),
    treeTrunk: new Character('│',['brown', 'bg-green']),
    solidMountain: new Character('█',['gray', 'bg-gray']),
    mountainBorder: new Character('█',['black', 'bg-black']),
    mountainShadow: new Character('█',['black', 'bg-black']),
    solidSnow: new Character('█',['white', 'bg-gray']),
    solidSnowBorder: new Character('▒',['white', 'bg-gray'])
}
tileDict[Tile.TYPES.EMPTY] = new Character(' ',['white', 'bg-green'])
tileDict[Tile.TYPES.NULL] = new Character('·',['null'])


const pushMessage = message => {
    document.getElementById('messages').innerHTML += message + ' * '
}

class MousePosition {
    constructor(line, column){
        this.line = line
        this.column = column
    }

    update(line, column){
        this.line = line
        this.column = column
        //console.log(`Updated to ${line} ${column}`)
    }

    isEqual(mousePosition){
        if(mousePosition.line != this.line) return false
        if(mousePosition.column != this.column) return false
        return true
    }
} 

const mousePosition = new MousePosition(0, 0)
var lastMousePosition = null
var isHoldingCursor = false;

const cellHandler = cell => {
    cell.domElement.addEventListener('click', e => {
        e.preventDefault()
        let chunkLine = cell.frame.chunkLine + cell.frameLine
        let chunkColumn = cell.frame.chunkColumn + cell.frameColumn
        cell.frame.chunk.game.entities[0].setTarget(chunkLine, chunkColumn)
        //cell.frame.chunk.game.entities.forEach(e => {
        //    e.setTarget(chunkLine, chunkColumn, 1000, 0)
        //})
    })

    cell.domElement.addEventListener('contextmenu', e => {
        e.preventDefault()
    })

    const cursorOver = e => {
        if(isHoldingCursor)  {
            if(lastMousePosition == null){
                lastMousePosition = new MousePosition(cell.frameLine, cell.frameColumn)
            }
            mousePosition.update(cell.frameLine, cell.frameColumn)
            if(!mousePosition.isEqual(lastMousePosition)){
                let lineDiff = lastMousePosition.line - mousePosition.line
                let columnDiff = lastMousePosition.column - mousePosition.column
                //console.log(`moving here! ${lineDiff} ${columnDiff}`)
                engine.frameLineAnchor += lineDiff
                engine.frameColumnAnchor += columnDiff
            }
        }
        if(lastMousePosition != null) lastMousePosition.update(cell.frameLine, cell.frameColumn)
        return true
    }

    cell.domElement.addEventListener('mouseover', cursorOver, {passive: true})
}

var shouldIAdjustFrame = false
const loopHandler = gameEngine => {
    const entity = gameEngine.entities[0]
    entity.updatePosition()
    if((entity.targetLine != null) && (entity.targetColumn != null)){
        const frameLineAnchorDiffToEntity = entity.tile.line - gameEngine.frameLineAnchor
        const frameColumnAnchorDiffToEntity = entity.tile.column - gameEngine.frameColumnAnchor
        if(!shouldIAdjustFrame){
            if(frameLineAnchorDiffToEntity > Math.floor((gameEngine.frameHeight / 4) * 3)){
                //console.log('preciso descer')
                shouldIAdjustFrame = true
            } else if(frameLineAnchorDiffToEntity < Math.floor(gameEngine.frameHeight / 4)){
                //console.log('preciso subir')
                shouldIAdjustFrame = true
            }
            if(frameColumnAnchorDiffToEntity > Math.floor((gameEngine.frameWidth / 4) * 3)){
                //console.log('preciso ir pra a direita')
                shouldIAdjustFrame = true
            } else if(frameColumnAnchorDiffToEntity < Math.floor(gameEngine.frameWidth / 4)){
                //console.log('preciso ir pra a esquerda')
                shouldIAdjustFrame = true
            }
        } else {
            if((frameLineAnchorDiffToEntity == Math.floor(gameEngine.frameHeight / 2)) && (frameColumnAnchorDiffToEntity == Math.floor(gameEngine.frameWidth / 2))){
                shouldIAdjustFrame = false
                //console.log('cancelei')
            } else {
                if(frameLineAnchorDiffToEntity > Math.floor(gameEngine.frameHeight / 2)) {
                    gameEngine.frameLineAnchor += 1
                } else if(frameLineAnchorDiffToEntity < Math.floor(gameEngine.frameHeight / 2)) {
                    gameEngine.frameLineAnchor -= 1
                }
                if(frameColumnAnchorDiffToEntity > Math.floor(gameEngine.frameWidth / 2)) {
                    gameEngine.frameColumnAnchor += 1
                } else if(frameColumnAnchorDiffToEntity < Math.floor(gameEngine.frameWidth / 2)) {
                    gameEngine.frameColumnAnchor -= 1
                }
            }
        }
    }
    gameEngine.frame.update(gameEngine.frameLineAnchor, gameEngine.frameColumnAnchor)
}

const domContainer = document.getElementById('area')
const engine = new Engine(domContainer, tileDict, 300, 500, cellHandler, loopHandler)
const velocityHandler = entity => {
    let velocity = 700;
    if(entity.tile.category == Tile.CATEGORIES.LIQUID) velocity = 50;
    if(entity.tile.category == Tile.CATEGORIES.OVERLAID) velocity = 300;
    return velocity;
}
let e0 = engine.createEntity('animate', 'e', 0, 0, velocityHandler)


//engine.updateTile(10, 10, 'lake')
//engine.updateTile(10, 11, 'lake')

let mapGenerator = new MapGenerator(engine, tileDict)
mapGenerator.generateLakes(150, 500)
mapGenerator.generateLakeBorders()
mapGenerator.generateMountains(100, 1000)
mapGenerator.generateMountainBorders()
mapGenerator.generateSnow(10000, 10)
mapGenerator.generateRocks(12000)
mapGenerator.generateTrees(1000)
mapGenerator.generateForests(10, 1000)


const getElementFromPoint = (tagName, x, y) => {
    let elementsFromPoint = document.elementsFromPoint(x, y)
    for (let j = 0; j < elementsFromPoint.length; j++) {
        let element = elementsFromPoint[j]
        if(element.tagName == tagName) return element
    }
}

const getFirstTouchedElement = passedEvent => {
    var touches = passedEvent.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        return touches.item(i)
    }
    return null
}

const interactStop = e => {
    if(e.type.startsWith('touch')){
        let touch = getFirstTouchedElement(e)
        if(touch != null) {
            let element = getElementFromPoint('B', touch.clientX, touch.clientY)
            element.dispatchEvent(new Event("mouseover"))
            //pushMessage('eventStop')
        }
    }
    isHoldingCursor = false
    delete lastMousePosition
    lastMousePosition = null
    return true
}

const interactStart = e => {
    e.preventDefault()
    if(isHoldingCursor){
        interactStop(e) //Chama a função que desregistra o touch para consertar o bug do navegador
        return
    }
    if(e.type.startsWith('touch')){
        let touch = getFirstTouchedElement(e)
        if(touch != null) {
            let element = getElementFromPoint('B', touch.clientX, touch.clientY)
            element.dispatchEvent(new Event("mouseover"))
            //pushMessage('eventStart')
        }
    }
    isHoldingCursor = true
    return true
}

window.addEventListener('load', e => {
	engine.adjustToScreen()
}, {passive: true}) 
window.addEventListener('resize', e => {
	engine.adjustToScreen()
}, {passive: true})

window.addEventListener('mousedown', interactStart)
window.addEventListener('mouseup', interactStop, {passive: true})

window.addEventListener("touchstart", interactStart);
window.addEventListener("touchend", interactStop, {passive: true});
window.addEventListener("touchcancel", interactStop, {passive: true});
window.addEventListener("touchmove", e => {
    e.preventDefault()
    let touch = getFirstTouchedElement(e)
    if(touch != null) {
        let element = getElementFromPoint('B', touch.clientX, touch.clientY)
        element.dispatchEvent(new Event("mouseover"))
    }
})


engine.start(-1, -7)

document.addEventListener('keydown', e => {
    e.preventDefault()
    switch (e.key) {
        case "ArrowLeft":
            engine.frameColumnAnchor -= 1
            break;
        case "ArrowRight":
            engine.frameColumnAnchor += 1
            break;
        case "ArrowUp":
            engine.frameLineAnchor -= 1
            break;
        case "ArrowDown":
            engine.frameLineAnchor += 1
            break;
        case " ":
            
            break;
    }
})
