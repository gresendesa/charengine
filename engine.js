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
}

/**
 * Tile
 * 
 * @description is a description of a position on space
 */
class Tile {

	static TYPES = {
		EMPTY: 'empty'
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
		this.grid[line][column] = new Tile(type)
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
		this.grid = []
		this.height = height
		this.width = width
		this.area = document.getElementById('area')
		this.tileDict = {}
		this.tileDict[Tile.TYPES.EMPTY] = new Character('•',['cb'])
		this.tileDict['b'] = new Character('☻',['cb'])
		this.tileDict['c'] = new Character('-',['cb'])
	}

	update(chunkLine, chunkColumn){

	}

	draw(chunkLine, chunkColumn){

		for (let line = chunkLine; line < chunkLine + this.height; line++) {
			for (let column = chunkColumn; column < chunkColumn + this.width; column++) {

				let elementNode = document.createElement('b');
				let character = this.tileDict[this.chunk.grid[line][column].type]
				let textNode = document.createTextNode(character.char)
				character.classes.forEach(className => {
					elementNode.classList.add(className) 
				})
				elementNode.appendChild(textNode)
				this.area.appendChild(elementNode)

			}
			let breakLine = document.createTextNode('\n')
			this.area.appendChild(breakLine)
		}

	}
}

/**
 * Game
 * @description game is where everything is linked.
 */
class Game {
	constructor(){
		this.chunk = new Chunk(100, 100)
		this.chunk.updateTile(2, 5, 'b')
		this.frame = new Frame(this.chunk, 3, 10)
	}

	start(){
		this.frame.draw(0,0)
	}
}

let game = new Game()
game.start()
