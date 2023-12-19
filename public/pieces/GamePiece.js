import { CONSTANTS } from "../Constants.js";


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
        this.setActivateListener();
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
            nodeTopLeft: this.createSingleRotationNode(corners.topLeft.x, corners.topLeft.y, 5, 0x0000ff),
            nodeTopRight: this.createSingleRotationNode(corners.topRight.x, corners.topRight.y, 5, 0x0000ff),
            nodeBottomLeft: this.createSingleRotationNode(corners.bottomLeft.x, corners.bottomLeft.y, 5, 0x0000ff),
            nodeBottomRight: this.createSingleRotationNode(corners.bottomRight.x, corners.bottomRight.y, 5, 0x0000ff),
        }
    }

    createSingleRotationNode(x, y, radius, color) {
        var cornerRotationNode = this.scene.add.circle(x, y, 5, 0x0000ff);
        cornerRotationNode.setOrigin(0.5, 0.5);
        cornerRotationNode.setInteractive();
        cornerRotationNode.setVisible(false);
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

    setActivateListener() {
        this.sprite.setInteractive(); // Make sure the sprite is interactive
        this.sprite.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);
            console.log(`GamePieceStrength: ${this.gamePieceStrength}`);

            //Clear previous activeGamePiece IF not null
            if (GamePiece.activeGamePiece !== null) {
                Object.values(GamePiece.activeGamePiece.rotationNodes).forEach(node => node.setVisible(false));
                GamePiece.activeGamePiece?.sprite.clearTint();
            }

            GamePiece.activeGamePiece = this;

            GamePiece.activeGamePiece.sprite.setTint(185273);
            Object.values(GamePiece.activeGamePiece.rotationNodes).forEach(node => node.setVisible(true));

            this.scene.getSidePanelScene().updateSidePanelScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
            //Hey ChatGPT: I want to set activeGamePiece border to red and 2px
            console.log(`Active unit is: ${GamePiece.activeGamePiece.gamePieceName}`);
            //this.scene.getSidePanelScene().headerText.setText(this.gamePieceName);
            // You can perform additional actions or callbacks here if needed
        });
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