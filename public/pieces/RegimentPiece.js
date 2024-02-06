import { CONSTANTS } from "../Constants.js";
import GamePiece from "./GamePiece.js";

class RegimentPiece extends GamePiece {
    // Entity-Component-System (ECS) programming design pattern

    constructor({ scene, gamePieceName = 'Game Piece Unnamed', x, y, widthInDistanceUnits, heightInDistanceUnits, spriteKey, gamePieceStrength = 15, color = null }) {
        super({
            scene: scene,
            gamePieceName: gamePieceName,
            x: x,
            y: y,
            color: color,
            heightInDistanceUnits: heightInDistanceUnits,
            widthInDistanceUnits: widthInDistanceUnits
        });

        this.spriteKey = spriteKey;
        this.gamePieceStrength = gamePieceStrength;

        this.setNodes();
        this.configureGamePiece();

        //!!! Red rectangle for testing to mark container boundaries
        // this.container.add(this.scene.add.rectangle(0, 0, displayWidth * scene.sceneDistanceUnitPixels * 0.9, displayHeight * scene.sceneDistanceUnitPixels * 0.9, 0xff0000));
        //this.showContainerBounds();
    }

    configureGamePiece() {
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.REGIMENT_PIECE_CONTAINER);
        this.container.setSize(this.width, this.height);
        this.setOnDragListener();
        this.sprite = this.scene.add.image(0, 0, this.spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.width, this.height)
        this.container.add(this.sprite);
        this.showContainerBounds(false);
    }

    updateGamePiece() {
        //empty for now, placeholder
    }

    setNodes() {
        //note: corner nodes are not part of container, they are outside of it
        var nodeColor = CONSTANTS.BASIC_COLORS.ACID_GREEN;
        var corners = this.getCornersPositions();
        this.nodes = {
            startNode: this.createSingleNode(corners.topLeft.x, corners.topLeft.y, 7, nodeColor),
            endNode: this.createSingleNode(corners.topRight.x, corners.topRight.y, 7, nodeColor),
        }
    }

    createSingleNode(x, y, radius, color) {
        var node = this.scene.add.circle(x, y, radius, color);

        node.setOrigin(0.5, 0.5);
        node.setInteractive();
        node.setVisible(false);
        node.setSize(radius * 2, radius * 2);
        node.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.GAME_PIECE_NODES);
        this.scene.input.setDraggable(node);
        node.on('dragstart', (pointer) => {
            console.log('Drag started');
        });
        node.on('drag', (pointer) => {
            console.log(`createSingleCornerNode pointer:`)
            GamePiece.hideActiveGamePieceNodes();
            var pointerWorldPoint = {
                x: this.scene.camera.getWorldPoint(pointer.x, pointer.y).x,
                y: this.scene.camera.getWorldPoint(pointer.x, pointer.y).y
            };

            console.log(`pointerWorldPoint: ${JSON.stringify(pointerWorldPoint)}`)
            var angle = this.getRotationAngleFromNode(node, pointerWorldPoint);
            this.container.setRotation(angle);
            this.updateNodes();

            this.showRotationLine(node, pointerWorldPoint, false);
        });
        node.on('dragend', (pointer) => {
            console.log('Drag ended');
            GamePiece.showActiveGamePieceNodes();
        });

        node.on('pointerdown', () => {
            if (GamePiece.activeGamePiece !== null) {
                GamePiece.deactivateGamePiece();
            }
            this.activateGamePiece();
        });
        return node;
    }

    showRotationLine(node, pointerWorldPoint, show = false) {
        if (!show) return;
        var line = new Phaser.Geom.Line(this.getOppositeNode(node).x, this.getOppositeNode(node).y, pointerWorldPoint.x, pointerWorldPoint.y);
        var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
        graphics.strokeLineShape(line);
    }

    getOppositeNode(cornerNode) {
        if (cornerNode === this.nodes.startNode) {
            return this.nodes.endNode;
        } else if (cornerNode === this.nodes.endNode) {
            return this.nodes.startNode;
        } else {
            return null;
        }
    }

    updateNodes() {
        var corners = this.getCornersPositions();
        this.nodes.startNode.setPosition(corners.topLeft.x, corners.topLeft.y);
        this.nodes.endNode.setPosition(corners.topRight.x, corners.topRight.y);
    }

    getCornersPositions() {
        var containerCorners = {
            topLeft: { x: this.container.x - this.width / 2, y: this.container.y - this.height / 2 },
            topRight: { x: this.container.x + this.width / 2, y: this.container.y - this.height / 2 },
            bottomLeft: { x: this.container.x - this.width / 2, y: this.container.y + this.height / 2 },
            bottomRight: { x: this.container.x + this.width / 2, y: this.container.y + this.height / 2 },
        }

        var angle = this.container.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        Object.values(containerCorners).forEach(corner => {
            var rotatedX = (corner.x - this.container.x) * cosAngle - (corner.y - this.container.y) * sinAngle + this.container.x;
            var rotatedY = (corner.x - this.container.x) * sinAngle + (corner.y - this.container.y) * cosAngle + this.container.y;
            corner.x = rotatedX;
            corner.y = rotatedY;
        });

        console.log(`containerCorners: ${JSON.stringify(containerCorners)}`)
        return containerCorners;
    }

    getRotationAngleFromNode(cornerNode, pointerWorldPoint) {
        var angle = null;
        var opposideCornerNode = this.getOppositeNode(cornerNode);
        if (cornerNode == this.nodes.endNode) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint);
        }
        else if (cornerNode == this.nodes.startNode) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint) - Math.PI;
        }
        return angle;
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
        })
    }
}

export default RegimentPiece;