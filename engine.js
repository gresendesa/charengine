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
	constructor(frame, character, line, column){
		this.frame = frame
		this.character = character
		this.frameLine = line
		this.frameColumn = column
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
			this.frame.chunk.game.entities.forEach(e => {
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

	constructor(type, chunk, line, column){
		this.type = type
		this.line = line
		this.chunk = chunk
		this.column = column
		this.entities = []
	}
	
	//High priority means last item from array
	getHighPriorityEntity(){
		if(this.entities.length > 0) return this.entities[this.entities.length - 1]
		return null
	}

	pushEntity(entity){
		this.entities.push(entity)
	}

	removeEntity(entity){
		this.entities = this.entities.filter(e => {
			return e !== entity
		})
	}

}

/**
 * Entity
 * 
 * @description is a description of a entity that lives it a tile
 */

class Entity {
	constructor(chunk, name, type, line, column){
		this.name = name
		this.type = type
		//this.tile = null
		this.chunk = chunk
		this.velocity = 0 //it may be something between 0 and 1000
		this.acceleration = 0 //it may be something between 0 and 1000
		this.assignToTile(line, column)
		this.clearTarget()
		this.counter = 0
	}

	updateType(type){
		this.type = type
	}

	shouldItMove(){
		if(!this.counter) {
			this.counter += 1
			return true
		} 
		if((this.velocity > 0) && (this.counter >= 1000/this.velocity)){
			this.counter = 0
			return false
		}
		this.counter += 1
		return false
	}

	updatePosition(){
		let { line, column, velocity, acceleration } = this.getTarget()
		if((line != null) && (column != null) && (velocity > 0)){
			let canMove = this.shouldItMove()
			if(canMove) {
				let diffTargetLine = this.targetLine - this.tile.line
				let diffTargetColumn = this.targetColumn - this.tile.column
				let moved = false
				if((diffTargetLine != 0) || (diffTargetColumn != 0)){
					let lineChange = 0;
					let columnChange = 0;
					if(diffTargetLine > 0) lineChange = 1;
					if(diffTargetLine < 0) lineChange = -1;
					if(diffTargetColumn > 0) columnChange = 1;
					if(diffTargetColumn < 0) columnChange = -1;
					moved = this.assignToTile(this.tile.line + lineChange, this.tile.column + columnChange)
				}
				if(!moved) this.clearTarget()
			}
		}
	}

	setTarget(line, column, velocity, acceleration){
		this.targetLine = line
		this.targetColumn = column
		this.velocity = velocity
		this.acceleration = acceleration
	}

	getTarget(){
		return {
			line: this.targetLine,
			column: this.targetColumn,
			velocity: this.velocity,
			acceleration: this.acceleration
		}
	}

	clearTarget(){
		this.targetLine = null
		this.targetColumn = null
		console.log('target clear')
	}

	assignToTile(line, column){
		if(this.tile != null){
			if(!this.tile.chunk.isPositionValid(line, column)) return false
			this.tile.removeEntity(this)
		}
		let tile = this.chunk.getTile(line, column)
		this.tile = tile
		tile.pushEntity(this)
		return true
	}

	destroy(){
		this.tile.removeEntity(this)
		delete this
	}
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
				line.push(new Tile(Tile.TYPES.EMPTY, this, h, w))
			}
			this.grid.push(line)
		}
	}

	isPositionValid(line, column){
		if(line < 0) return false
		if(column < 0) return false
		if(line > this.height - 1) return false
		if(column > this.width - 1) return false
		return true
	}

	updateTile(line, column, type){
		if(line >= this.height) return false
		if(column >= this.width) return false
		delete this.grid[line][column]
		this.grid[line][column] = new Tile(type, this, line, column)
		return true
	}

	getTile(line, column){
		let voidTile = new Tile(Tile.TYPES.NULL, this, line, column)
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
	constructor(domContainer, chunk, height, width){
		this.chunk = chunk
		this.matrix = []
		this.height = height
		this.width = width
		this.chunkLine = null
		this.chunkColumn = null
		this.domContainer = domContainer
		this.tileDict = {}
		this.tileDict[Tile.TYPES.EMPTY] = new Character(' ',['white', 'bg-green'])
		this.tileDict[Tile.TYPES.NULL] = new Character('·',['null'])
		this.tileDict['b'] = new Character('\u263C',['blue', 'bg-green'])
		this.tileDict['c'] = new Character('-',['white', 'bg-green'])
		this.tileDict['g'] = new Character('*',['white', 'bg-green'])
		this.tileDict['x'] = new Character('♥',['red', 'bg-green'])
		this.tileDict['e'] = new Character('\u263B',['entity'])
		this.drawed = false
	}

	getTileCharacter(tile){
		let highPriorityEntity = tile.getHighPriorityEntity()
		let tileCharacter = this.tileDict[tile.type]
		if(highPriorityEntity != null) {
			let entityCharacter = this.tileDict[highPriorityEntity.type]
			let customCharacter = Object.assign(new Character(), tileCharacter);
			customCharacter.char = entityCharacter.char
			customCharacter.classes = customCharacter.classes.concat(entityCharacter.classes)
			return customCharacter
		}
		return tileCharacter
	}

	getMatrixCell(line, column){
		return this.matrix[line][column]
	}

	setMatrixCell(cell, line, column){
		this.matrix[line][column] = cell
	}

	resize(height, width){
		this.height = height
		this.width = width
		this.drawed = false
		this.matrix.forEach(line => {
			line.forEach(cell => {
				cell.purge()
				//delete cell
			})
		})
		this.domContainer.innerHTML = ''
		this.matrix = []
		this.draw(this.chunkLine, this.chunkColumn)
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
				let chunkCharacter = this.getTileCharacter(this.chunk.getTile(line,column))
				let currentCell = this.getMatrixCell(gridLine, gridColumn)
				if(!currentCell.character.isEqual(chunkCharacter)){
					let cell = new Cell(this, chunkCharacter, gridLine, gridColumn)
					let newElementNode = cell.getDOMElement()
					let lastElementNode = currentCell.getDOMElement()
					lastElementNode.parentNode.replaceChild(newElementNode, lastElementNode)
					currentCell.purge()
					this.setMatrixCell(cell, gridLine, gridColumn)
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
				let chunkCharacter = this.getTileCharacter(this.chunk.getTile(line,column))
				let cell = new Cell(this, chunkCharacter, line - chunkLine, column - chunkColumn)
				let elementNode = cell.getDOMElement()
				this.domContainer.appendChild(elementNode)
				matrixLine.push(cell)
			}
			let breakLine = document.createTextNode('\n')
			this.domContainer.appendChild(breakLine)
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

	constructor(domContainer){

		this.domContainer = domContainer

		this.chunkHeight = 15
		this.chunkWidth = 50

		this.frameHeight = 1
		this.frameWidth = 1

		//console.log(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
		//Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) 
		//Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) 

		//getComputedStyle(document.querySelector('#area'))['font-size']

		this.frameLineAnchor = -1
		this.frameColumnAnchor = -2
		this.entities = []

		this.chunk = new Chunk(this, this.chunkHeight, this.chunkWidth)
		for (let i = 0; i < this.chunkHeight; i++) {
			for (let j = 0; j < this.chunkWidth; j++) {
				//this.chunk.updateTile(i, j, 'x')
				switch (Math.floor(Math.random() * 5)) {
					case 1:
						this.chunk.updateTile(i, j, 'b')
						break;
					case 2:
						//this.chunk.updateTile(i, j, 'c')
						break;
					case 3:
						this.chunk.updateTile(i, j, 'g')
						break;
					case 4:
						//this.chunk.updateTile(i, j, 'x')
						break;
					default:
						this.chunk.updateTile(i, j, Tile.TYPES.EMPTY)
						break;
				}
			}
		}
		this.frame = new Frame(this.domContainer, this.chunk, this.frameHeight, this.frameWidth)
	}

	resize(height, width){
		this.frameHeight = height
		this.frameWidth = width
		this.frame.resize(this.frameHeight, this.frameWidth)
	}

	adjustToScreen(){
		let containerHeight = this.domContainer.offsetHeight
		let containerWidth = this.domContainer.offsetWidth
		let someCell = this.domContainer.getElementsByTagName('b')[0]
		let maxLines = Math.floor(containerHeight / someCell.offsetHeight) - 1
		let maxColumns = Math.floor(containerWidth / someCell.offsetWidth)
		this.resize(maxLines, maxColumns)
		console.log(`Adjusted to ${maxLines} lines and ${maxColumns} columns`)
	}

	createEntity(name, type, line, column){
		let entity = new Entity(this.chunk, name, type, line, column)
		this.entities.push(entity)
		return entity
	}

	removeEntity(entity){
		this.entities = this.entities.filter(e => {
			return e !== entity
		})
		entity.destroy()
	}

	start(){

		let e0 = this.createEntity('animate', 'e', 0, 0)
		//e0.setTarget(10, 10, 1000, 0)

		this.frame.draw(this.frameLineAnchor, this.frameColumnAnchor)

		setInterval(() => {
			this.mainLoop()
		},50)

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
		this.entities.forEach(e => {
			e.updatePosition()
		})
		this.frame.update(this.frameLineAnchor, this.frameColumnAnchor)
	}
	
}

const domContainer = document.getElementById('area')
const game = new Game(domContainer)


window.addEventListener('load', e => {
	game.adjustToScreen()
}) 
window.addEventListener('resize', e => {
	game.adjustToScreen()
})

game.start()
