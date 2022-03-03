class MapGenerator {
    
    constructor(gameEngine, tileTypes){
        this.gameEngine = gameEngine
        this.tileTypes = tileTypes
    }

    isPositionValid(line, column){
        if (line < 0) return false
        if (line > this.gameEngine.chunkHeight) return false
        if (column < 0) return false
        if (column > this.gameEngine.chunkWidth) return false
        return true
    }

    generateLakes(quantity, dimension) {
        var quantLakes = Math.floor(Math.random() * (quantity + 1))
        var lakesGenerated = 0
        do {
            var lakeDimension = Math.floor(Math.random() * (dimension + 1))
            var lakeCellLine = Math.floor(Math.random() * (this.gameEngine.chunkHeight + 1))
            var lakeCellColumn = Math.floor(Math.random() * (this.gameEngine.chunkWidth + 1))
            var lakeCells = 0
            var antiLoopCounter = 0
            do {
                if(antiLoopCounter > 10) break
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        lakeCellLine += 1
                        break;
                    case 1:
                        lakeCellLine -= 1
                        break;
                    case 2:
                        break;
                }
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        lakeCellColumn += 1
                        break;
                    case 1:
                        lakeCellColumn -= 1
                        break;
                    case 2:
                        break;
                }
                if(!this.isPositionValid(lakeCellLine, lakeCellColumn)){
                    antiLoopCounter += 1
                    continue
                }
                this.gameEngine.updateTile(lakeCellLine, lakeCellColumn, 'lake', Tile.CATEGORIES.LIQUID)
                lakeCells += 1
            } while(lakeCells < lakeDimension)

            lakesGenerated += 1 
        } while (lakesGenerated < quantLakes);
    }

    generateLakeBorders(){
        for (let line = 0; line < this.gameEngine.chunkHeight; line++) {
            for (let column = 0; column < this.gameEngine.chunkWidth; column++) {
                let tile = this.gameEngine.chunk.getTile(line, column)
                if(tile.type != 'lake') continue
                
                let leftTile = this.gameEngine.chunk.getTile(line, column - 1)
                let rightTile = this.gameEngine.chunk.getTile(line, column + 1)
                let topTile = this.gameEngine.chunk.getTile(line - 1, column)
                let bottomTile = this.gameEngine.chunk.getTile(line + 1, column)
                    
                if((column > 0) && (leftTile.type == Tile.TYPES.EMPTY))
                    this.gameEngine.updateTile(line, column - 1, 'lakeborder', Tile.CATEGORIES.DEFAULT)
                if((column < this.gameEngine.chunkWidth) && (rightTile.type == Tile.TYPES.EMPTY))
                    this.gameEngine.updateTile(line, column + 1, 'lakeborder', Tile.CATEGORIES.DEFAULT)

                if((line > 0) && (topTile.type == Tile.TYPES.EMPTY))
                    this.gameEngine.updateTile(line - 1, column, 'lakeborder', Tile.CATEGORIES.DEFAULT)
                if((line < this.gameEngine.chunkHeight) && (bottomTile.type == Tile.TYPES.EMPTY))
                    this.gameEngine.updateTile(line + 1, column, 'lakeborder', Tile.CATEGORIES.DEFAULT)
            }     
        }
    }
    
    generateRocks(quantity){
        for (let i = 0; i < quantity; i++) {
            var type = 'rock0'
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    type = 'rock1'
                    break;
                case 1:
                    break;
            }
            var line = Math.floor(Math.random() * (this.gameEngine.chunkHeight + 1))
            var column = Math.floor(Math.random() * (this.gameEngine.chunkWidth + 1))
            let tile = this.gameEngine.chunk.getTile(line, column)
            if(tile.category == Tile.CATEGORIES.DEFAULT){
                this.gameEngine.updateTile(line, column, type, Tile.CATEGORIES.DEFAULT)
            }
        }
        
    }

    generateTree(line, column){
        if (line == 0) return false
        let tileCrown = this.gameEngine.chunk.getTile(line - 1, column)
        if(tileCrown.category != Tile.CATEGORIES.DEFAULT) return false
        let tileTrunk = this.gameEngine.chunk.getTile(line, column)
        if(tileTrunk.category != Tile.CATEGORIES.DEFAULT) return false
        if((line < 0) || (line > this.gameEngine.chunkHeight)) return false
        if((column < 0) || (column > this.gameEngine.chunkWidth)) return false
        this.gameEngine.updateTile(line - 1, column, 'treeCrown', Tile.CATEGORIES.OVERLAID)
        this.gameEngine.updateTile(line, column, 'treeTrunk', Tile.CATEGORIES.OVERLAID)
        return true
    }

    generateTrees(quantity){
        for (let i = 0; i < quantity; i++) {
            if(line == 0) continue
            var antiLoopCounter = 0;
            while (true) {
                if(antiLoopCounter > 10) break
                var line = Math.floor(Math.random() * (this.gameEngine.chunkHeight + 1))
                var column = Math.floor(Math.random() * (this.gameEngine.chunkWidth + 1))
                if (!this.generateTree(line, column)){
                    antiLoopCounter += 1
                    continue
                }
                break
            }
            
        }
        
    }

    generateForests(quantity, dimension) {
        var quantTrees = Math.floor(Math.random() * (quantity + 1))
        var treesGenerated = 0
        do {
            var treeDimension = Math.floor(Math.random() * (dimension + 1))
            var treeCellLine = Math.floor(Math.random() * (this.gameEngine.chunkHeight + 1))
            var treeCellColumn = Math.floor(Math.random() * (this.gameEngine.chunkWidth + 1))
            var treeCells = 0
            do {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        treeCellLine += 1
                        break;
                    case 1:
                        treeCellLine -= 1
                        break;
                    case 2:
                        break;
                }
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        treeCellColumn += 1
                        break;
                    case 1:
                        treeCellColumn -= 1
                        break;
                    case 2:
                        break;
                }
                
                this.generateTree(treeCellLine, treeCellColumn)
                treeCells += 1
            } while(treeCells < treeDimension)

            treesGenerated += 1 
        } while (treesGenerated < quantTrees);
    }


    generateMountains(quantity, dimension) {
        var quantMountains = Math.floor(Math.random() * (quantity + 1))
        var mountainsGenerated = 0
        do {
            var mountainsDimension = Math.floor(Math.random() * (dimension + 1))
            var mountainCellLine = Math.floor(Math.random() * (this.gameEngine.chunkHeight + 1))
            var mountainCellColumn = Math.floor(Math.random() * (this.gameEngine.chunkWidth + 1))
            var mountainCells = 0
            var antiLoopCounter = 0
            do {
                if(antiLoopCounter > 10) break
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        mountainCellLine += 1
                        break;
                    case 1:
                        mountainCellLine -= 1
                        break;
                    case 2:
                        break;
                }
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        mountainCellColumn += 1
                        break;
                    case 1:
                        mountainCellColumn -= 1
                        break;
                    case 2:
                        break;
                }
                
                if(!this.isPositionValid(mountainCellLine, mountainCellColumn)) {
                    antiLoopCounter += 1
                    continue
                }
                this.gameEngine.updateTile(mountainCellLine, mountainCellColumn, 'solidMountain', Tile.CATEGORIES.SOLID)
                
                mountainCells += 1
            } while(mountainCells < mountainsDimension)

            mountainsGenerated += 1 
        } while (mountainsGenerated < quantMountains);
    }

    generateMountainBorders(){
        for (let line = 0; line < this.gameEngine.chunkHeight; line++) {
            for (let column = 0; column < this.gameEngine.chunkWidth; column++) {
                let tile = this.gameEngine.chunk.getTile(line, column)
                if(tile.type != 'solidMountain') continue
                let bottomTile = this.gameEngine.chunk.getTile(line + 1, column)
                let veryBottomTile = this.gameEngine.chunk.getTile(line + 2, column)
                if(bottomTile.type == Tile.TYPES.EMPTY) this.gameEngine.updateTile(line + 1, column, 'mountainBorder', Tile.CATEGORIES.SOLID)
                if(veryBottomTile.type == Tile.TYPES.EMPTY) this.gameEngine.updateTile(line + 2, column, 'mountainShadow', Tile.CATEGORIES.OVERLAID) 
            }     
        }
    }

    generateSnow(quantity, dimension) {
        var quantSnow = Math.floor(Math.random() * (quantity + 1))
        var snowsGenerated = 0
        do {
            var snowDimension = Math.floor(Math.random() * (dimension + 1))
            var snowCellLine = Math.floor(Math.random() * (this.gameEngine.chunkHeight + 1))
            var snowCellColumn = Math.floor(Math.random() * (this.gameEngine.chunkWidth + 1))
            var snowCells = 0
            var antiLoopCounter = 0
            do {
                if(antiLoopCounter > 10) break
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        snowCellLine += 1
                        break;
                    case 1:
                        snowCellLine -= 1
                        break;
                    case 2:
                        break;
                }
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        snowCellColumn += 1
                        break;
                    case 1:
                        snowCellColumn -= 1
                        break;
                    case 2:
                        break;
                }
            
                if(!this.isPositionValid(snowCellLine, snowCellColumn)){
                    antiLoopCounter += 1
                    continue
                }
                let tile = this.gameEngine.chunk.getTile(snowCellLine, snowCellColumn)
                if(tile.type == 'solidMountain') this.gameEngine.updateTile(snowCellLine, snowCellColumn, 'solidSnow', Tile.CATEGORIES.SOLID)
                
                snowCells += 1
            } while(snowCells < snowDimension)

            snowsGenerated += 1 
        } while (snowsGenerated < quantSnow);
    }

}