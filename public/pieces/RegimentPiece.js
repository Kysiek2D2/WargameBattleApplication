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

        this.setActivateListener();

        this.gamePieceStrength = gamePieceStrength;
        this.nodes = { nodeTopLeft: null, nodeTopRight: null, }
        this.setNodes();

        this.updateContainer();
        this.sprite = scene.add.image(0, 0, spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(widthInDistanceUnits * this.scene.sceneDistanceUnitPixels, heightInDistanceUnits * this.scene.sceneDistanceUnitPixels)
        this.container.add(this.sprite);

        //!!! Red rectangle for testing to mark container boundaries
        // this.container.add(this.scene.add.rectangle(0, 0, displayWidth * scene.sceneDistanceUnitPixels * 0.9, displayHeight * scene.sceneDistanceUnitPixels * 0.9, 0xff0000));
        //this.showContainerBounds();
    }

    updateContainer() {
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.REGIMENT_PIECE);
        this.container.setSize(this.width, this.height);
        this.setOnDragListener();
    }

    showContainerBounds() {
        var containerBoundsColor = CONSTANTS.BASIC_COLORS.CLASSIC_RED;
        var containerWidth = this.container.width;
        var containerHeight = this.container.height;
        this.container.add(this.scene.add.rectangle(0, 0, containerWidth * this.scene.sceneDistanceUnitPixels, containerHeight * this.scene.sceneDistanceUnitPixels, 0xff0000));
    }

    setNodes() {
        //note: corner nodes are not part of container, they are outside of it
        var nodeColor = CONSTANTS.BASIC_COLORS.ACID_GREEN;
        var corners = this.getCornersPositions();
        this.nodes = {
            nodeTopLeft: this.createSingleNode(corners.topLeft.x, corners.topLeft.y, 7, nodeColor),
            nodeTopRight: this.createSingleNode(corners.topRight.x, corners.topRight.y, 7, nodeColor),
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
            RegimentPiece.hideActiveGamePieceNodes();
            var pointerWorldPoint = {
                x: this.scene.camera.getWorldPoint(pointer.x, pointer.y).x,
                y: this.scene.camera.getWorldPoint(pointer.x, pointer.y).y
            };

            console.log(`pointerWorldPoint: ${JSON.stringify(pointerWorldPoint)}`)
            var angle = this.getRotationAngleFromNode(node, pointerWorldPoint);
            this.container.setRotation(angle);
            this.updateNodes();

            /* //Comment-out to show rotation line
            // var oppositeCornerNode = this.getOppositeCornerNode(cornerNode);
            // var thisNode = cornerNode;
            var line = new Phaser.Geom.Line(this.getOppositeCornerNode(cornerNode).x, this.getOppositeCornerNode(cornerNode).y, pointerWorldPoint.x, pointerWorldPoint.y);
            var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
            graphics.strokeLineShape(line); */

            //Comment-out to show rotation line
            // var oppositeCornerNode = this.getOppositeCornerNode(cornerNode);
            // var thisNode = cornerNode;
            var line = new Phaser.Geom.Line(this.getOppositeNode(node).x, this.getOppositeNode(node).y, pointerWorldPoint.x, pointerWorldPoint.y);
            var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
            graphics.strokeLineShape(line);
        });
        node.on('dragend', (pointer) => {
            console.log('Drag ended');
            RegimentPiece.showActiveGamePieceNodes();
        });

        node.on('pointerdown', () => {
            if (RegimentPiece.activeGamePiece !== null) {
                RegimentPiece.deactivateGamePiece();
            }
            this.activateGamePiece();
        });
        return node;
    }

    static hideActiveGamePieceNodes() {
        Object.values(RegimentPiece.activeGamePiece.nodes).forEach(node => node.setVisible(false));
    }

    static showActiveGamePieceNodes() {
        Object.values(RegimentPiece.activeGamePiece.nodes).forEach(node => node.setVisible(true));
    }

    getOppositeNode(cornerNode) {
        if (cornerNode === this.nodes.nodeTopLeft) {
            return this.nodes.nodeTopRight;
        } else if (cornerNode === this.nodes.nodeTopRight) {
            return this.nodes.nodeTopLeft;
        } else {
            return null;
        }
    }

    updateNodes() {
        var corners = this.getCornersPositions();
        this.nodes.nodeTopLeft.setPosition(corners.topLeft.x, corners.topLeft.y);
        this.nodes.nodeTopRight.setPosition(corners.topRight.x, corners.topRight.y);
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
        if (cornerNode == this.nodes.nodeTopRight) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint);
        }
        else if (cornerNode == this.nodes.nodeTopLeft) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint) - Math.PI;
        }
        return angle;
    }

    static isMouseClickOnActiveGamePieceCornerNode(pointer) {
        if (RegimentPiece.activeGamePiece === null) return false;
        var worldX = RegimentPiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = RegimentPiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnCornerNode = Object.values(RegimentPiece.activeGamePiece.cornerNodes).some(node => node.getBounds().contains(worldX, worldY));
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

    setActivateListener() { //++
        this.container.setInteractive();
        this.container.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);
            console.log(`GamePieceStrength: ${this.gamePieceStrength}`);

            if (RegimentPiece.activeGamePiece !== null) {
                RegimentPiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }

            this.activateGamePiece();

            console.log(`Active unit is: ${RegimentPiece.activeGamePiece.gamePieceName}`);
        });
    }

    activateGamePiece() { //++
        RegimentPiece.activeGamePiece = this;
        RegimentPiece.activeGamePiece.sprite.setTint(185273);
        RegimentPiece.showActiveGamePieceNodes();
        this.scene.getGamePieceDetailsScene().updateGamePieceDetailsScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getGamePieceDetailsScene().setVisible(true);
    }

    static deactivateGamePiece() { //++
        if (RegimentPiece.activeGamePiece === null) return;
        RegimentPiece.activeGamePiece.updateNodes()
        RegimentPiece.hideActiveGamePieceNodes();
        RegimentPiece.activeGamePiece?.sprite.clearTint();
        RegimentPiece.activeGamePiece?.scene.getGamePieceDetailsScene().setVisible(false);
        RegimentPiece.activeGamePiece = null;
    }

    static isMouseClickOnGamePiece(pointer, scene) { //++
        var worldX = scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var gamePiecesUnderClick = RegimentPiece.instances.filter(i => i.sprite.getBounds().contains(worldX, worldY));
        var isMouseOnGamePiece = gamePiecesUnderClick.length > 0;
        return isMouseOnGamePiece;
    }

    static getActiveGamePiece() { //++
        return RegimentPiece.activeGamePiece;
    }
}


export default RegimentPiece;