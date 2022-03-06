
class Cell {
    constructor(grid, line, column){
        this.grid = grid
        this.line = line
        this.column = column
    }

    draw(){
        let ctx = this.grid.context
        ctx.beginPath();
        ctx.rect(this.grid.cellSize * this.column, this.grid.cellSize * this.line , this.grid.cellSize, this.grid.cellSize);
        ctx.stroke();
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


const render = () => {

    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let grid = new Grid(context)

    let cellSize = canvas.width / 40 //Definir um cellSize para cada tamanho de tela
    grid.draw(canvas.width, canvas.height, cellSize)

}

window.addEventListener('resize', render)
window.addEventListener('load', render)