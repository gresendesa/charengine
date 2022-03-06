
class Cell {
    constructor(grid, line, column){
        this.grid = grid
        this.line = line
        this.column = column
    }

    draw(color){
        let ctx = this.grid.context

        ctx.fillStyle = 'green'
        ctx.strokeStyle = 'yellow'
        if(this.line % 2 ^ this.column % 2){
            ctx.fillStyle = 'gray'
            ctx.strokeStyle = 'red'
        }

        if(color != undefined) {
            ctx.fillStyle = color
            ctx.strokeStyle = color
            ctx.fillRect(this.grid.cellSize * this.column, this.grid.cellSize * this.line, this.grid.cellSize, this.grid.cellSize)
        }

        ctx.fillRect(this.grid.cellSize * this.column, this.grid.cellSize * this.line, this.grid.cellSize, this.grid.cellSize)

        ctx.beginPath();

        ctx.moveTo(this.grid.cellSize * this.column, this.grid.cellSize * this.line + 0.5)
        ctx.lineTo(this.grid.cellSize * this.column + this.grid.cellSize, this.grid.cellSize * this.line + 0.5)

        ctx.moveTo(this.grid.cellSize * this.column + this.grid.cellSize - 0.5, this.grid.cellSize * this.line)
        ctx.lineTo(this.grid.cellSize * this.column + this.grid.cellSize - 0.5, this.grid.cellSize * this.line + this.grid.cellSize)
        
        ctx.moveTo(this.grid.cellSize * this.column + this.grid.cellSize, this.grid.cellSize * this.line + this.grid.cellSize - 0.5)
        ctx.lineTo(this.grid.cellSize * this.column, this.grid.cellSize * this.line + this.grid.cellSize - 0.5)
        
        ctx.moveTo(this.grid.cellSize * this.column + 0.5, this.grid.cellSize * this.line + this.grid.cellSize)
        ctx.lineTo(this.grid.cellSize * this.column + 0.5, this.grid.cellSize * this.line)

        let fontSize = this.grid.cellSize / 1.1
        ctx.textAlign = "center";
        ctx.font = `${fontSize}px Consolas`;

        ctx.strokeText("A", this.grid.cellSize * this.column + (this.grid.cellSize / 2), this.grid.cellSize * this.line + (this.grid.cellSize / 2));

        ctx.lineWidth = 1
        ctx.stroke()
    }

}

class Grid {

    constructor(context){
        this.context = context
        this.cells = []
        this.cellSize = 0 //Size in pixels
        this.linesAmount = 0
        this.columnsAmount = 0
    }

    draw(width, height, cellSize, maxLines, maxColumns){

        this.cellSize = cellSize
        let linesAmount = Math.floor(height / this.cellSize) //depends on cellSize
        let columnsAmount = Math.floor(width / this.cellSize) //depends on cellSize
        this.linesAmount = ((maxLines == undefined)||(linesAmount < maxLines)) ? linesAmount : maxLines
        this.columnsAmount = ((maxColumns == undefined)||(columnsAmount < maxColumns)) ? columnsAmount : maxColumns

        for (let line = 0; line < this.linesAmount; line++) {
            let cellsLine = []
            for (let column = 0; column < this.columnsAmount; column++) {
                let cell = new Cell(this, line, column)
                cellsLine.push(cell)
                cell.draw()
            }
            this.cells.push(cellsLine)
        }
    }
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d');
const grid = new Grid(context)

const render = event => {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let cellSize = Math.floor(canvas.width / 20) //Definir um cellSize para cada tamanho de tela
    grid.draw(canvas.width, canvas.height, cellSize)

    if(event.type == 'load'){
        canvas.addEventListener('click', e => {
            let rect = canvas.getBoundingClientRect()
            let x = e.clientX - rect.left
            let y = e.clientY - rect.top
            let cellLine = Math.floor(y / grid.cellSize)
            let cellColumn = Math.floor(x / grid.cellSize)
            console.log(`x ${x} y ${y} line ${cellLine} column ${cellColumn} size ${grid.cellSize}`)
            let cell = grid.cells[cellLine][cellColumn]
            cell.draw('blue')
        }, false)
    }

}

window.addEventListener('resize', render)
window.addEventListener('load', render)