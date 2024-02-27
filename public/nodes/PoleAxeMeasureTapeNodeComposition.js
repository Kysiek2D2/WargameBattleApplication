import BasicMeasureTapeNodeComposition from './BasicMeasureTapeNodeComposition.js';

class PoleAxeMeasureTapePiece extends BasicMeasureTapeNodeComposition {

    constructor(scene, gamePiece, radius, color) {
        super(scene, gamePiece, radius, color);
    }

    calulateNodesPositions() {
        var gamePieceContainer = this.gamePiece.container;
        var gamePieceWidth = this.gamePiece.width;

        //Note: max 2 nodes for BasicMeasureTapePiece!!! We can't have more than start and end point of a measure tape!
        var startCornerPoint = { x: gamePieceContainer.x - (gamePieceWidth / 2), y: gamePieceContainer.y + (this.gamePiece.height / 2) };
        var endCornerPoint = { x: gamePieceContainer.x + (gamePieceWidth / 2), y: gamePieceContainer.y + (this.gamePiece.height / 2) };

        var angle = gamePieceContainer.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        var startCornerPointRotated = {
            x: gamePieceContainer.x + (startCornerPoint.x - gamePieceContainer.x) * cosAngle - (startCornerPoint.y - gamePieceContainer.y) * sinAngle,
            y: gamePieceContainer.y + (startCornerPoint.x - gamePieceContainer.x) * sinAngle + (startCornerPoint.y - gamePieceContainer.y) * cosAngle
        };
        var endCornerPointRotated = {
            x: gamePieceContainer.x + (endCornerPoint.x - gamePieceContainer.x) * cosAngle - (endCornerPoint.y - gamePieceContainer.y) * sinAngle,
            y: gamePieceContainer.y + (endCornerPoint.x - gamePieceContainer.x) * sinAngle + (endCornerPoint.y - gamePieceContainer.y) * cosAngle
        };

        var cornerPoints = [startCornerPointRotated, endCornerPointRotated];
        return cornerPoints;
    }
}

export default PoleAxeMeasureTapePiece;