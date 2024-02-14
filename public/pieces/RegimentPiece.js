import { CONSTANTS } from "../Constants.js";
import GamePiece from "./GamePiece.js";

class RegimentPiece extends GamePiece {
    // Entity-Component-System (ECS) programming design pattern

    constructor({ scene, gamePieceName = 'Game Piece Unnamed', x, y, rotationAngle, widthInDistanceUnits, heightInDistanceUnits, spriteKey, gamePieceStrength = 15, color = null }) {
        super({
            scene: scene,
            gamePieceName: gamePieceName,
            x: x,
            y: y,
            rotationAngle: rotationAngle,
            color: color,
            heightInDistanceUnits: heightInDistanceUnits,
            widthInDistanceUnits: widthInDistanceUnits
        });

        this.spriteKey = spriteKey;
        this.gamePieceStrength = gamePieceStrength;

        this.configureGamePiece();
    }

    configureGamePiece() {
        this.setNodes();
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.REGIMENT_PIECE_CONTAINER);
        this.container.setSize(this.width, this.height);
        this.setOnDragListener();
        this.sprite = this.scene.add.image(0, 0, this.spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.width, this.height)
        this.container.add(this.sprite);
        this.showContainerHelpBounds(false);
    }

    setNodes() {
        //note: corner nodes are not part of container, they are outside of it
        var nodeColor = CONSTANTS.BASIC_COLORS.ACID_GREEN;
        var nodeRadius = 7;
        var manipulationNodesPositions = this.getManipulationNodesPositionsForRegimentPiece();
        manipulationNodesPositions.forEach(position => {
            var node = this.createSingleNode(position.x, position.y, nodeRadius, nodeColor);
            this.nodes.push(node);
        });
    }

    createSingleNode(x, y, radius, color) {

        var node = this.scene.add.circle(x, y, radius, color);
        node.setInteractive();
        this.scene.input.setDraggable(node);
        node.setVisible(false);
        node.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.GAME_PIECE_NODES);

        node.on('drag', (pointer) => {
            var worldPoint = this.scene.camera.getWorldPoint(pointer.x, pointer.y);
            this.updateGamePiece(node, { x: worldPoint.x, y: worldPoint.y });
        });

        return node;
    }

    updateNodes() {
        //max 2 for Regiment PIECE!!! Otherwise we won't know which is the opposite ode
        var manipulationNodesPositions = this.getManipulationNodesPositionsForRegimentPiece();
        this.nodes.forEach((node, index) => {
            node.setPosition(
                manipulationNodesPositions[index].x,
                manipulationNodesPositions[index].y
            );
        });
    }

    getManipulationNodesPositionsForRegimentPiece() {
        var containerCorners = [
            { x: this.container.x - this.width / 2, y: this.container.y - this.height / 2 }, //topLeft
            { x: this.container.x + this.width / 2, y: this.container.y - this.height / 2 }, //topRight
        ]

        var angle = this.container.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        containerCorners.forEach(corner => {
            var rotatedX = (corner.x - this.container.x) * cosAngle - (corner.y - this.container.y) * sinAngle + this.container.x;
            var rotatedY = (corner.x - this.container.x) * sinAngle + (corner.y - this.container.y) * cosAngle + this.container.y;
            corner.x = rotatedX;
            corner.y = rotatedY;
        });

        //console.log(`containerCorners: ${JSON.stringify(containerCorners)}`)
        return containerCorners;
    }

    getOppositeNode(cornerNode) {
        if (cornerNode === this.nodes[0]) {
            return this.nodes[1];
        } else if (cornerNode === this[1]) {
            return this.nodes[0];
        } else {
            return null;
        }
    }

    getRotationAngleFromNode(cornerNode, pointerWorldPoint) {
        var angle = null;
        var opposideCornerNode = this.getOppositeNode(cornerNode);
        if (cornerNode == this.nodes[1]) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint);
        }
        else if (cornerNode == this.nodes[0]) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint) - Math.PI;
        }
        return angle;
    }

    showRotationHelpLine(node, pointerWorldPoint, show = false) {
        if (!show) return;
        var line = new Phaser.Geom.Line(this.getOppositeNode(node).x, this.getOppositeNode(node).y, pointerWorldPoint.x, pointerWorldPoint.y);
        var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
        graphics.strokeLineShape(line);
    }

    updateGamePiece(node, pointerWorldPoint) {
        this.updateNodes();
        var angle = this.getRotationAngleFromNode(node, pointerWorldPoint);
        this.container.setRotation(angle);
        this.showRotationHelpLine(node, pointerWorldPoint, false);
    }

    static isMouseClickOnActiveGamePieceCornerNode(pointer) {
        if (GamePiece.activeGamePiece === null) return false;
        var worldX = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnCornerNode = Object.values(RegimentPiece.activeGamePiece.nodes).some(node => node.getBounds().contains(worldX, worldY));
        console.log(`Is mouse click on corner ion node: ${isMouseOnCornerNode}`);
        return isMouseOnCornerNode;
    }

    setOnDragListener() {
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
        this.container.on('drag', (pointer, dragX, dragY) => {
            const dx = dragX - this.container.x;
            const dy = dragY - this.container.y;
            this.container.x += dx;
            this.container.y += dy;
            this.updateNodes();

            console.log(`RegimentPiece ${this.gamePieceName} position:
            \n    X: ${this.container.x} 
            \n    Y: ${this.container.y}
            \n    rotation angle: ${this.container.rotation}`);
        })
    }
}

export default RegimentPiece;