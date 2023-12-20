import { CONSTANTS } from "../Constants.js";
import SidePanelScene from "../scenes/SidePanelScene.js";


class GamePiece {
    // Entity-Component-System (ECS) programmind design pattern
    static instances = [];
    static idCounter = 0;

    constructor(scene, { x, y, displayWidth, displayHeight, spriteKey, gamePieceName = 'Game Piece Unnamed', gamePieceStrength = 15 }) {
        console.log(`GamePiece constructor...`);
        this.scene = scene;

        this.sprite = scene.add.image(x, y, spriteKey)
            .setOrigin(0.5, 0.5) //origin in the middle?
            .setInteractive({ draggable: true })
            .setDisplaySize(displayWidth * scene.sceneDistanceUnitPixels, displayHeight * scene.sceneDistanceUnitPixels)

        this.spriteKey = spriteKey;

        //Usable properties
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        this.gamePieceName = gamePieceName;
        this.gamePieceStrength = gamePieceStrength;

        this.rotationNodes = {
            cornerTopLeft: null,
            cornerTopRight: null,
            cornerBottomLeft: null,
            cornerBottomRight: null,
        }

        //Additional configuration
        this.setRotationNodes();
        this.setOnDragListener();
        this.setActivateAndDeactivateListener();
        GamePiece.instances = [...GamePiece.instances, this];
        GamePiece.activeGamePiece = null;
    }

    getCorners() {
        var corners = {
            topLeft: this.sprite.getTopLeft(),
            topRight: this.sprite.getTopRight(),
            bottomLeft: this.sprite.getBottomLeft(),
            bottomRight: this.sprite.getBottomRight(),
        }
        return corners;
    }

    setRotationNodes() {
        var corners = this.getCorners();

        this.rotationNodes = {
            nodeTopLeft: this.createSingleRotationNode(corners.topLeft.x, corners.topLeft.y, 7, 0x914148),
            nodeTopRight: this.createSingleRotationNode(corners.topRight.x, corners.topRight.y, 7, 0x914148),
            nodeBottomLeft: this.createSingleRotationNode(corners.bottomLeft.x, corners.bottomLeft.y, 7, 0x914148),
            nodeBottomRight: this.createSingleRotationNode(corners.bottomRight.x, corners.bottomRight.y, 7, 0x914148),
        }
    }

    static isMouseClickOnActiveGamePieceRotationNode(pointer) {
        // Convert screen coordinates to world coordinates
        if (GamePiece.activeGamePiece === null) return false;
        var worldX = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnRotationNode = Object.values(GamePiece.activeGamePiece.rotationNodes).some(node => node.getBounds().contains(worldX, worldY));

        console.log(`Is mouse click on rotation node: ${isMouseOnRotationNode}`);
        return isMouseOnRotationNode;
    }

    createSingleRotationNode(x, y, radius, color) {
        var cornerRotationNode = this.scene.add.circle(x, y, radius, color);
        cornerRotationNode.setOrigin(0.5, 0.5);
        cornerRotationNode.setInteractive();
        cornerRotationNode.setVisible(false);
        cornerRotationNode.setSize(radius * 2, radius * 2);
        //Add event listener for dragging cornerRotationNode
        this.scene.input.setDraggable(cornerRotationNode);
        cornerRotationNode.on('drag', (pointer, gameObject, dragX, dragY) => {
            //Rotate this gamePiece to the direction of pointer as long as pointer is down
            var angle = Phaser.Math.Angle.BetweenPoints(this.sprite, pointer);
            this.sprite.rotation = angle;
        });

        cornerRotationNode.on('pointerdown', () => {
            if (GamePiece.activeGamePiece !== null) {
                GamePiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }
            this.activateGamePiece();
        });
        return cornerRotationNode;
    }

    updateRotationNodes() {
        var corners = this.getCorners();

        this.rotationNodes.nodeTopLeft.setPosition(corners.topLeft.x, corners.topLeft.y);
        this.rotationNodes.nodeTopRight.setPosition(corners.topRight.x, corners.topRight.y);
        this.rotationNodes.nodeBottomLeft.setPosition(corners.bottomLeft.x, corners.bottomLeft.y);
        this.rotationNodes.nodeBottomRight.setPosition(corners.bottomRight.x, corners.bottomRight.y);
    }

    setOnDragListener() {
        this.scene.input.setDraggable(this.sprite);
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.updateRotationNodes();
        })
    }

    setActivateAndDeactivateListener() {
        //Activate listener
        this.sprite.setInteractive(); // Make sure the sprite is interactive
        this.sprite.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);
            console.log(`GamePieceStrength: ${this.gamePieceStrength}`);

            if (GamePiece.activeGamePiece !== null) {
                GamePiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }

            this.activateGamePiece();

            console.log(`Active unit is: ${GamePiece.activeGamePiece.gamePieceName}`);
        });
    }

    activateGamePiece() {
        GamePiece.activeGamePiece = this;
        GamePiece.activeGamePiece.sprite.setTint(185273);
        Object.values(GamePiece.activeGamePiece.rotationNodes).forEach(node => node.setVisible(true));
        this.scene.getSidePanelScene().updateSidePanelScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getSidePanelScene().setVisible(true);
    }

    static deactivateGamePiece() {
        Object.values(GamePiece.activeGamePiece.rotationNodes).forEach(node => node.setVisible(false));
        GamePiece.activeGamePiece?.sprite.clearTint();
        GamePiece.activeGamePiece?.scene.getSidePanelScene().setVisible(false);
    }

    static isMouseClickOnGamePiece(pointer, scene) {
        // Convert screen coordinates to world coordinates
        var worldX = scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        // Check if the converted coordinates are within the bounds of the 'unit'
        var gamePiecesUnderClick = GamePiece.instances.filter(i => i.sprite.getBounds().contains(worldX, worldY));
        var isMouseOnGamePiece = gamePiecesUnderClick.length > 0;
        console.log(`Is mouse click on unit: ${isMouseOnGamePiece}`);
        return isMouseOnGamePiece;
    }

    getById(id) {
        GamePiece.instances.get(id);
    }

    rotate() {
        this.sprite.angle += angle;
    }

    move(x, y) {
        this.sprite.setPosition(x, y);
    }


    select() {
        this.isSelected = true;
    }

    deselect() {
        this.isSelected = false;
    }
}

export default GamePiece;