//import { Engine, Character } from "./engine";

const tileDict = {
    b: new Character('\u263C',['blue', 'bg-green']),
    c: new Character('-',['white', 'bg-green']),
    g: new Character('*',['white', 'bg-green']),
    x: new Character('♥',['red', 'bg-green']),
    e: new Character('\u263B',['entity'])
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
        cell.frame.chunk.game.entities.forEach(e => {
            e.setTarget(chunkLine, chunkColumn, 1000, 0)
        })
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
                console.log(`moving here! ${lineDiff} ${columnDiff}`)
                engine.frameLineAnchor += lineDiff
                engine.frameColumnAnchor += columnDiff
            }
        }
        lastMousePosition.update(cell.frameLine, cell.frameColumn)
        return true
    }

    cell.domElement.addEventListener('mouseover', cursorOver, {passive: true})
}

const domContainer = document.getElementById('area')
const engine = new Engine(domContainer, tileDict, 15, 50, cellHandler)

/*for (let i = 0; i < engine.chunkHeight; i++) {
    for (let j = 0; j < engine.chunkWidth; j++) {
        //this.chunk.updateTile(i, j, 'x')
        switch (Math.floor(Math.random() * 5)) {
            case 1:
                engine.updateTile(i, j, 'b')
                break;
            case 2:
                //this.updateTile(i, j, 'c')
                break;
            case 3:
                engine.updateTile(i, j, 'g')
                break;
            case 4:
                //this.updateTile(i, j, 'x')
                break;
            default:
                engine.updateTile(i, j, Tile.TYPES.EMPTY)
                break;
        }
    }
}*/

let e0 = engine.createEntity('animate', 'e', 0, 0)

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
    if(isHoldingCursor){
        interactStop(e) //Chama a função que desregistra o touch para consertar o bug do navegador
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

window.addEventListener('mousedown', interactStart, {passive: true})
window.addEventListener('mouseup', interactStop, {passive: true})

window.addEventListener("touchstart", interactStart, {passive: true});
window.addEventListener("touchend", interactStop, {passive: true});
window.addEventListener("touchcancel", interactStop, {passive: true});
window.addEventListener("touchmove", e => {
    let touch = getFirstTouchedElement(e)
    if(touch != null) {
        e.preventDefault()
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
    }
})
