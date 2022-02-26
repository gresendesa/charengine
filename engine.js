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
 * Chunk
 * 
 * @description chunk is a list of lines that carries
 * 	all the tiles in memory.
 */
class Chunk {
	constructor(height, width) {
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

	buildMatrixElement(domElement, character){
		return { domElement, character }
	}

	createDOMElementFromCharacter(character){
		let elementNode = document.createElement('b');
		let textNode = document.createTextNode(character.char)
		elementNode.classList.add('cell')
		character.classes.forEach(className => {
			elementNode.classList.add(className) 
		})
		elementNode.appendChild(textNode)
		return elementNode
	}

	update(chunkLine, chunkColumn){

		if(!this.drawed){
			console.log('Frame should be drawed first to use update()!')
			return;
		}

		for (let line = chunkLine; line < chunkLine + this.height; line++) {
			for (let column = chunkColumn; column < chunkColumn + this.width; column++) {
				let gridLine = line - chunkLine;
				let gridColumn = column - chunkColumn;
				let chunkCharacter = this.tileDict[this.chunk.getTile(line,column).type]
				const matrixElement = this.matrix[gridLine][gridColumn]
				if(!matrixElement.character.isEqual(chunkCharacter)){
					let newElementNode = this.createDOMElementFromCharacter(chunkCharacter)
					let lastElementNode = matrixElement.domElement
					lastElementNode.parentNode.replaceChild(newElementNode, lastElementNode)
					lastElementNode.remove()
					this.matrix[gridLine][gridColumn] = this.buildMatrixElement(newElementNode, chunkCharacter)
				}
			}	
		}
	}

	draw(chunkLine, chunkColumn){

		if(this.drawed){
			console.log('Frame should be drawed once. Use update instead!')
			return;
		}

		for (let line = chunkLine; line < chunkLine + this.height; line++) {
			const matrixLine = []
			for (let column = chunkColumn; column < chunkColumn + this.width; column++) {

				let chunkCharacter = this.tileDict[this.chunk.getTile(line,column).type]

				let elementNode = this.createDOMElementFromCharacter(chunkCharacter)
				this.area.appendChild(elementNode)
				matrixLine.push(this.buildMatrixElement(elementNode, chunkCharacter))

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

		this.chunkHeight = 7
		this.chunkWidth = 17
		this.frameHeight = 33
		this.frameWidth = 130
		this.frameLinePosition = -10  
		this.frameColumnPosition = -50

		this.chunk = new Chunk(this.chunkHeight, this.chunkWidth)
		this.chunk.updateTile(0, 0, 'b')
		this.chunk.updateTile(7, 4, 'x')
		this.chunk.updateTile(5, 2, 'b')
		this.chunk.updateTile(10, 7, 'x')
		this.chunk.updateTile(5, 25, 'x')

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
		this.frame.draw(this.frameLinePosition, this.frameColumnPosition)
		var contador0 = this.frameLinePosition
		var contador1 = this.frameColumnPosition
		setInterval(() => {
			let lineOffset = Math.floor(Math.random() * 3)
			let columnOffset = Math.floor(Math.random() * 3)
			switch (lineOffset) {
				case 1:
					contador0 += 1
					break;
				case 2:
					contador0 -= 1
					break;
				default:
					break;
			}
			switch (columnOffset) {
				case 1:
					contador1 += 1
					break;
				case 2:
					contador1 -= 1
					break;
				default:
					break;
			}
			this.frame.update(contador0, contador1)
		},100)
	}
}

let game = new Game()
game.start()
