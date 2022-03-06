class Message {
    
    static TYPES = {
        PATHFINDREQUEST: ':pathfindrequest',
        PATHFINDRESPONSE: ':pathfindresponse'
    }

    constructor(type, payload){
        this.type = type
        this.payload = payload
    }
}

class Grid {

}

class PathFindRequest extends Message {
    constructor(tileOrigin, tileTarget){
        const payload = {
            tileOrigin,
            tileTarget
        }
        super(Message.TYPES.PATHFINDREQUEST, payload)
    }
    
    get tileOrigin(){
        return this.payload.tileOrigin
    }

    get tileTarget(){
        return this.payload.tileTarget
    }

    calculateManhatanDistance(tile0, tile1){
        let lineDiff = Math.abs(tile0.line - tile1.line)
        let columnDiff = Math.abs(tile0.column - tile1.column)
        return lineDiff + columnDiff
    }

    getAdjacentTiles(tile){
        let adjacentTiles = []
        for (let line = -1; line < 2; line++) {
            for (let column = -1; column < 2; column++) {
                if((line != 0) || (column != 0)){
                    let adjacentTile = tile.chunk.getTile(tile.line + line, tile.column + column)
                    if(adjacentTile.type != Tile.TYPES.NULL) adjacentTiles.push(adjacentTile)
                }
            }
        }
        return adjacentTiles
    }

    calculatePath(){
        var tileRoot = this.tileOrigin
        return this.getAdjacentTiles(tileRoot)
    }
}

class PathFindResponse extends Message {
    constructor(routeArray){
        const payload = {
            routeArray
        }
        super(Tile.TYPES.PATHFINDRESPONSE, payload)
    }
}

self.addEventListener('message', function(e) {
    const message = e.data
    switch (message.type) {
        case Message.TYPES.PATHFINDREQUEST:
            self.postMessage(message.calculatePath())
            break;
        default:
            self.postMessage('bey');
            break;
    }
}, false);