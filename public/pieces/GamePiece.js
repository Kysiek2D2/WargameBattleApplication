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
            nodeTopLeft: this.createSingleRotationNode(corners.topLeft.x, corners.topLeft.y, 15, 0x0000ff),
            nodeTopRight: this.createSingleRotationNode(corners.topRight.x, corners.topRight.y, 15, 0x0000ff),
            nodeBottomLeft: this.createSingleRotationNode(corners.bottomLeft.x, corners.bottomLeft.y, 15, 0x0000ff),
            nodeBottomRight: this.createSingleRotationNode(corners.bottomRight.x, corners.bottomRight.y, 15, 0x0000ff),
        }
    }

    isMouseClickOnRotationNode(pointer) {
        // Convert screen coordinates to world coordinates
        var worldX = this.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = this.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnRotationNode = Object.values(this.rotationNodes).some(node => node.getBounds().contains(worldX, worldY));
        //var isMouseOnRotationNode = Object.values(this.rotationNodes).filter(node => node.contains(pointer.x, pointer.y)).length > 0;
        // console.log(`rotationNodes bounds: ${Object.values(this.rotationNodes).map(node => node.getBounds())}`)
        // var bounds = Object.values(this.rotationNodes).map(node => node.getBounds());
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
                this.deactivateGamePiece(); //deactivate previous activeGamePiece
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
                this.deactivateGamePiece(); //deactivate previous activeGamePiece
            }

            this.activateGamePiece();

            console.log(`Active unit is: ${GamePiece.activeGamePiece.gamePieceName}`);
        });

        //Deactivate listener
        this.scene.input.on('pointerdown', (pointer) => {
            console.log(`***** setActivateAndDeactivateListener`);

            console.log(`Deactivate? \n isMouseClickOnRotationNode: ${this.isMouseClickOnRotationNode(pointer)} 
            \n isMouseClickOnGamePiece: ${GamePiece.isMouseClickOnGamePiece(pointer, this.scene)} 
            \n isMouseClickOnSidePanel: ${this.scene.getSidePanelScene().isMouseClickOnSidePanel(pointer)} \n
            outcome: ${!GamePiece.isMouseClickOnGamePiece(pointer, this.scene) && !this.scene.getSidePanelScene().isMouseClickOnSidePanel(pointer) && !this.isMouseClickOnRotationNode(pointer)}`)
            if (!GamePiece.isMouseClickOnGamePiece(pointer, this.scene)
                && !this.scene.getSidePanelScene().isMouseClickOnSidePanel(pointer)
                && !this.isMouseClickOnRotationNode(pointer)) {
                console.log('Deactivating game piece...');
                this.deactivateGamePiece();
            }
        }, this);
    }

    activateGamePiece() {
        GamePiece.activeGamePiece = this;
        GamePiece.activeGamePiece.sprite.setTint(185273);
        Object.values(GamePiece.activeGamePiece.rotationNodes).forEach(node => node.setVisible(true));
        this.scene.getSidePanelScene().updateSidePanelScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getSidePanelScene().setVisible(true);
    }

    deactivateGamePiece() {
        Object.values(GamePiece.activeGamePiece.rotationNodes).forEach(node => node.setVisible(false));
        GamePiece.activeGamePiece?.sprite.clearTint();
        this.scene.getSidePanelScene().setVisible(false);
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