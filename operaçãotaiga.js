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

const cellHandler = cell => {
    cell.domElement.addEventListener('click', e => {
        let chunkLine = cell.frame.chunkLine + cell.frameLine
        let chunkColumn = cell.frame.chunkColumn + cell.frameColumn
        cell.frame.chunk.game.entities.forEach(e => {
            e.setTarget(chunkLine, chunkColumn, 1000, 0)
        })
        //console.log(`CHUNK[line=${chunkLine}, column=${chunkColumn}] FRAME[line=${this.frameLine},column=${this.frameColumn}]`)
    })

    /*this.domElement.addEventListener('mouseover', e => {
        let chunkLine = this.frame.chunkLine + this.frameLine
        let chunkColumn = this.frame.chunkColumn + this.frameColumn
        //console.log(`CHUNK[line=${chunkLine}, column=${chunkColumn}] FRAME[line=${this.frameLine},column=${this.frameColumn}]`)
    })*/
}

const domContainer = document.getElementById('area')
const engine = new Engine(domContainer, tileDict, 15, 50, cellHandler)

for (let i = 0; i < engine.chunkHeight; i++) {
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
}

let e0 = engine.createEntity('animate', 'e', 0, 0)
//e0.setTarget(10, 10, 1000, 0)

window.addEventListener('load', e => {
	engine.adjustToScreen()
}) 
window.addEventListener('resize', e => {
	engine.adjustToScreen()
})

engine.start(-1, -7)