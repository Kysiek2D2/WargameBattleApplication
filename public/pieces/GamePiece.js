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

        //Additional configuration
        this.setOnDragListener();
        this.setGamePieceListener();
        GamePiece.instances = [...GamePiece.instances, this];
        GamePiece.activeGamePiece = null;
    }

    setOnDragListener() {
        this.scene.input.setDraggable(this.sprite);
        this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })
    }

    setGamePieceListener() {
        this.sprite.setInteractive(); // Make sure the sprite is interactive
        this.sprite.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);
            console.log(`GamePieceStrength: ${this.gamePieceStrength}`);
            GamePiece.activeGamePiece?.sprite.clearTint();
            GamePiece.activeGamePiece = this;
            GamePiece.activeGamePiece.sprite.setTint(185273);
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