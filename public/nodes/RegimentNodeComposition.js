import ManipulationNodeComposition from './ManipulationNodeComposition.js';
import { CONSTANTS } from '../Constants.js';

class RegimentNodeComposition extends ManipulationNodeComposition {

    constructor(scene, gamePiece, radius, color, spriteKey) {
        super(scene, gamePiece, radius, color, spriteKey);
    }


    calulateNodesPositions() {
        var gamePieceContainer = this.gamePiece.container;
        var gamePieceWidth = this.gamePiece.width;

        //Note: max 2 nodes for RegimentPiece!!! Otherwise we won't know which is the opposite node!
        var containerCorners = [
            { x: gamePieceContainer.x - gamePieceWidth / 2, y: gamePieceContainer.y, isVisible: false }, //topLeft
            { x: gamePieceContainer.x + gamePieceWidth / 2, y: gamePieceContainer.y, isVisible: true }, //topRight
        ]

        var angle = gamePieceContainer.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        containerCorners.forEach(corner => {
            var rotatedX = (corner.x - gamePieceContainer.x) * cosAngle - (corner.y - gamePieceContainer.y) * sinAngle + gamePieceContainer.x;
            var rotatedY = (corner.x - gamePieceContainer.x) * sinAngle + (corner.y - gamePieceContainer.y) * cosAngle + gamePieceContainer.y;
            corner.x = rotatedX;
            corner.y = rotatedY;
        });

        //console.log(`containerCorners: ${JSON.stringify(containerCorners)}`)
        return containerCorners;
    }

    updateGamePiece(node, worldPoint) {
        this.updateNodesPosition();
        var angle = this.getRotationAngleFromNode(node, worldPoint);
        this.gamePiece.container.setRotation(angle);
        this.showRotationHelpLine(node, worldPoint, false);
    }

    getRotationAngleFromNode(cornerNode, pointerWorldPoint) {
        if (this.getNodes().length != 2) {
            throw new Error('RegimentNodeComposition must have exactly 2 nodes');
        }

        var angle = null;
        var oppositeCornerNode = this.getOppositeNode(cornerNode);
        if (cornerNode == this.nodes[1]) {
            var angle = Phaser.Math.Angle.BetweenPoints(oppositeCornerNode, pointerWorldPoint);
        }
        else if (cornerNode == this.nodes[0]) {
            var angle = Phaser.Math.Angle.BetweenPoints(oppositeCornerNode, pointerWorldPoint) - Math.PI;
        }
        return angle;
    }

    getOppositeNode(node) {
        if (this.getNodes().length != 2) {
            throw new Error('RegimentNodeComposition must have exactly 2 nodes');
        }

        if (node === this.nodes[0]) {
            return this.nodes[1];
        } else if (node === this.nodes[1]) {
            return this.nodes[0];
        } else {
            return null;
        }
    }

    showRotationHelpLine(node, pointerWorldPoint, show = false) {
        if (!show) return;
        var line = new Phaser.Geom.Line(this.getOppositeNode(this.node).x, this.getOppositeNode(this.node).y, pointerWorldPoint.x, pointerWorldPoint.y);
        var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
        graphics.strokeLineShape(line);
    }

    /**
    * @override
    */
    createSingleNode(x, y, radius, color, isVisible) {
        var node = this.scene.add.image(x, y, this.spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(radius * 3, radius * 3);
        node.isVisible = isVisible;
        node.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.GAME_PIECE_NODES);
        node.setVisible(false);
        this.setNodeListener(node);
        this.nodes.push(node);
        return node;
    }

    // static isMouseClickOnActiveGamePieceCornerNode(pointer) {
    //     if (GamePiece.activeGamePiece === null) return false;
    //     var worldX = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
    //     var worldY = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
    //     var isMouseOnCornerNode = Object.values(RegimentPiece.activeGamePiece.nodes).some(node => node.getBounds().contains(worldX, worldY));
    //     console.log(`Is mouse click on corner ion node: ${isMouseOnCornerNode}`);
    //     return isMouseOnCornerNode;
    // }
}

export default RegimentNodeComposition;