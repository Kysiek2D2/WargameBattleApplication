import ManipulationNodeComposition from "./ManipulationNodeComposition.js";

class BasicMeasureTapeNodeComposition extends ManipulationNodeComposition {

    constructor(scene, gamePiece, radius, color) {
        super(scene, gamePiece, radius, color);
    }

    calulateNodesPositions() {
        var gamePieceContainer = this.gamePiece.container;
        var gamePieceWidth = this.gamePiece.width;

        //Note: max 2 nodes for BasicMeasureTapePiece!!! We can't have more than start and end point of a measure tape!
        var startMiddlePoint = { x: gamePieceContainer.x - (gamePieceWidth / 2), y: gamePieceContainer.y };
        var endMiddlePoint = { x: gamePieceContainer.x + (gamePieceWidth / 2), y: gamePieceContainer.y };

        var angle = gamePieceContainer.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        var startMiddlePointRotated = {
            x: gamePieceContainer.x + (startMiddlePoint.x - gamePieceContainer.x) * cosAngle - (startMiddlePoint.y - gamePieceContainer.y) * sinAngle,
            y: gamePieceContainer.y + (startMiddlePoint.x - gamePieceContainer.x) * sinAngle + (startMiddlePoint.y - gamePieceContainer.y) * cosAngle
        };
        var startEndPointRotated = {
            x: gamePieceContainer.x + (endMiddlePoint.x - gamePieceContainer.x) * cosAngle - (endMiddlePoint.y - gamePieceContainer.y) * sinAngle,
            y: gamePieceContainer.y + (endMiddlePoint.x - gamePieceContainer.x) * sinAngle + (endMiddlePoint.y - gamePieceContainer.y) * cosAngle
        };

        var sideMiddlePoints = [startMiddlePointRotated, startEndPointRotated];
        return sideMiddlePoints;
    }

    setNodeListener(node) {
        super.setNodeListener(node);
        node.on('dragend', (pointer) => {
            console.log("dragend: " + Math.abs(this.nodes[0].x - this.nodes[1].x));
            //this.gamePiece.nodesComposition.updateNodesPosition();
            this.gamePiece.reduceLineShapeToFullDistanceUnits();
            this.gamePiece.renderBasicMeasureTape();
        });
    }

    updateGamePiece() {
        this.gamePiece.dropAndCreateBasicMeasureTape();
    }
}

export default BasicMeasureTapeNodeComposition;