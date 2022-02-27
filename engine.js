/**
 * Character
 * 
 * @description is a description of a character
 */
class Character {
	constructor(char, classes) {
		this.char = char
		this.classes = classes 
	}

	isEqual(character){
		if(this.char != character.char) return false
		if(!this.classes.every(item => character.classes.includes(item))) return false
		if(!character.classes.every(item => this.classes.includes(item))) return false
		return true
	}
}


/**
 * Cell
 * 
 * @description this is a set that links character, DOMElement, and coordinates
 * 	inside a Frame
 */

class Cell {
	constructor(frame, character, frameLine, frameColumn){
		this.frame = frame
		this.character = character
		this.frameLine = frameLine
		this.frameColumn = frameColumn
		let elementNode = document.createElement('b');
		let textNode = document.createTextNode(character.char)
		elementNode.classList.add('cell')
		character.classes.forEach(className => {
			elementNode.classList.add(className) 
		})
		elementNode.appendChild(textNode)
		this.domElement = elementNode
		this.configureListeners()
	}

	getDOMElement(){
		return this.domElement
	}

	configureListeners(){
		this.domElement.addEventListener('mousedown', e => {
			let chunkLine = this.frame.chunkLine + this.frameLine
			let chunkColumn = this.frame.chunkColumn + this.frameColumn
			console.log(`CHUNK[line=${chunkLine}, column=${chunkColumn}] FRAME[line=${this.frameLine},column=${this.frameColumn}]`)
		})

		/*this.domElement.addEventListener('mouseover', e => {
			let chunkLine = this.frame.chunkLine + this.frameLine
			let chunkColumn = this.frame.chunkColumn + this.frameColumn
			//console.log(`CHUNK[line=${chunkLine}, column=${chunkColumn}] FRAME[line=${this.frameLine},column=${this.frameColumn}]`)
		})*/
	}

	purge(){
		this.domElement.remove()
		//this.character.remove()
	}

}

/**
 * Tile
 * 
 * @description is a description of a position on space
 */
class Tile {

	static TYPES = {
		EMPTY: ':empty', //Empty means the tile should be default character
		NULL: ':null' //Null means the tile does not exist on chunk
	}

	constructor(type){
		this.type = type
		this.entities = []
	}
	
	pushEntity(entity, priority){
		this.entities.push(entity)
	}

	removeEntity(entity){

	}

}

/**
 * Entity
 * 
 * @description is a description of a entity that lives it a tile
 */

class Entity {

}

/**
 * Chunk
 * 
 * @description chunk is a list of lines that carries
 * 	all the tiles in memory.
 */
class Chunk {
	constructor(game, height, width) {
		this.game = game
		this.height = height
		this.width = width
		this.grid = []
		for (let h = 0; h < height; h++) {
			var line = []
			for (let w = 0; w < width; w++) {
				line.push(new Tile(Tile.TYPES.EMPTY))
			}
			this.grid.push(line)
		}
	}

	updateTile(line, column, type){
		if(line >= this.height) return false
		if(column >= this.width) return false
		this.grid[line][column] = new Tile(type)
		return true
	}

	getTile(line, column){
		let voidTile = new Tile(Tile.TYPES.NULL)
		let gridLine = this.grid[line]
		if(!Array.isArray(gridLine)) return voidTile
		let tile = gridLine[column]
		if(typeof tile !== 'undefined') return tile
		return voidTile
	}

}

/**
 * Frame
 * @description frame is a 2d set of tiles that represents
 * 	a portion of chunk that must be rendered.
 */
class Frame {
	constructor(chunk, height, width){
		this.chunk = chunk
		this.matrix = []
		this.height = height
		this.width = width
		this.chunkLine = null
		this.chunkColumn = null
		this.area = document.getElementById('area')
		this.tileDict = {}
		this.tileDict[Tile.TYPES.EMPTY] = new Character(' ',['white'])
		this.tileDict[Tile.TYPES.NULL] = new Character('?',['null'])
		this.tileDict['b'] = new Character('☻',['blue'])
		this.tileDict['c'] = new Character('-',['white'])
		this.tileDict['g'] = new Character('*',['white'])
		this.tileDict['x'] = new Character('♥',['red'])
		this.drawed = false
	}

	getCharacterTile(tile){
		return this.tileDict[tile.type]
	}

	update(chunkLine, chunkColumn){

		if(!this.drawed){
			console.log('Frame should be drawed first to use update()!')
			return;
		}

		this.chunkLine = chunkLine
		this.chunkColumn = chunkColumn

		for (let line = chunkLine; line < chunkLine + this.height; line++) {
			for (let column = chunkColumn; column < chunkColumn + this.width; column++) {
				let gridLine = line - chunkLine;
				let gridColumn = column - chunkColumn;
				let chunkCharacter = this.getCharacterTile(this.chunk.getTile(line,column))
				let currentCell = this.matrix[gridLine][gridColumn]
				if(!currentCell.character.isEqual(chunkCharacter)){
					let cell = new Cell(this, chunkCharacter, gridLine, gridColumn)
					let newElementNode = cell.getDOMElement()
					let lastElementNode = currentCell.getDOMElement()
					lastElementNode.parentNode.replaceChild(newElementNode, lastElementNode)
					currentCell.purge()
					this.matrix[gridLine][gridColumn] = cell
				}
			}	
		}
	}

	draw(chunkLine, chunkColumn){

		if(this.drawed){
			console.log('Frame should be drawed once. Use update instead!')
			return;
		}

		this.chunkLine = chunkLine
		this.chunkColumn = chunkColumn

		for (let line = chunkLine; line < chunkLine + this.height; line++) {
			let matrixLine = []
			for (let column = chunkColumn; column < chunkColumn + this.width; column++) {
				let chunkCharacter = this.getCharacterTile(this.chunk.getTile(line,column))
				let cell = new Cell(this, chunkCharacter, line - chunkLine, column - chunkColumn)
				let elementNode = cell.getDOMElement()
				this.area.appendChild(elementNode)
				matrixLine.push(cell)
			}
			let breakLine = document.createTextNode('\n')
			this.area.appendChild(breakLine)
			this.matrix.push(matrixLine)
		}
		
		this.drawed = true

	}
}

/**
 * Game
 * @description game is where everything is linked.
 */
class Game {

	constructor(){

		this.chunkHeight = 500
		this.chunkWidth = 500
		this.frameHeight = 10
		this.frameWidth = 40
		this.frameLineAnchor = 0  
		this.frameColumnAnchor = 0

		this.chunk = new Chunk(this, this.chunkHeight, this.chunkWidth)
		for (let i = 0; i < this.chunkHeight; i++) {
			for (let j = 0; j < this.chunkWidth; j++) {
				//this.chunk.updateTile(i, j, 'x')
				switch (Math.floor(Math.random() * 5)) {
					case 1:
						this.chunk.updateTile(i, j, 'b')
						break;
					case 2:
						this.chunk.updateTile(i, j, 'c')
						break;
					case 3:
						this.chunk.updateTile(i, j, 'g')
						break;
					case 4:
						this.chunk.updateTile(i, j, 'x')
						break;
					default:
						this.chunk.updateTile(i, j, Tile.TYPES.EMPTY)
						break;
				}
			}
		}
		this.frame = new Frame(this.chunk, this.frameHeight, this.frameWidth)
	}

	start(){
		this.frame.draw(this.frameLineAnchor, this.frameColumnAnchor)
		setInterval(() => {
			this.mainLoop()
		},100)

		document.addEventListener('keydown', e => {
			e.preventDefault()
			switch (e.key) {
				case "ArrowLeft":
					this.frameColumnAnchor -= 1
					break;
				case "ArrowRight":
					this.frameColumnAnchor += 1
					break;
				case "ArrowUp":
					this.frameLineAnchor -= 1
					break;
				case "ArrowDown":
					this.frameLineAnchor += 1
					break;
			}
		})

	}

	mainLoop(){
		this.frame.update(this.frameLineAnchor, this.frameColumnAnchor)
	}
}

let game = new Game()
game.start()
