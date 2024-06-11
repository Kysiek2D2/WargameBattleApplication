import ManipulationNodeComposition from "./ManipulationNodeComposition.js";
import { CONSTANTS } from "../Constants.js";

class BasicMeasureTapeNodeComposition extends ManipulationNodeComposition {

    constructor(scene, gamePiece, radius, color, spriteKey) {
        super(scene, gamePiece, radius, color, spriteKey);
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
            y: gamePieceContainer.y + (startMiddlePoint.x - gamePieceContainer.x) * sinAngle + (startMiddlePoint.y - gamePieceContainer.y) * cosAngle,
            isVisible: true
        };
        var startEndPointRotated = {
            x: gamePieceContainer.x + (endMiddlePoint.x - gamePieceContainer.x) * cosAngle - (endMiddlePoint.y - gamePieceContainer.y) * sinAngle,
            y: gamePieceContainer.y + (endMiddlePoint.x - gamePieceContainer.x) * sinAngle + (endMiddlePoint.y - gamePieceContainer.y) * cosAngle,
            isVisible: true
        };

        var sideMiddlePoints = [startMiddlePointRotated, startEndPointRotated];
        return sideMiddlePoints;
    }

    /**
    * @override
    */
    createSingleNode(x, y, radius, color, isVisible) {
        var node = this.scene.add.image(x, y, this.spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(radius * 2, radius * 2)
        node.isVisible = isVisible;
        node.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.GAME_PIECE_NODES);
        node.setVisible(false);
        this.setNodeListener(node);
        this.nodes.push(node);
        return node;
    }

    setNodeListener(node) {
        super.setNodeListener(node);
        node.on('dragend', (pointer) => {
            console.log("dragend: " + Math.abs(this.nodes[0].x - this.nodes[1].x));
            this.gamePiece.reduceLineShapeToFullDistanceUnits();
            this.gamePiece.renderMeasureTape();
        });
    }

    updateGamePiece() {
        this.gamePiece.dropAndCreateBasicMeasureTape();
    }
}

export default BasicMeasureTapeNodeComposition;