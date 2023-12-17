import { CONSTANTS } from "../Constants.js";


class GamePiece {
    // Entity-Component-System (ECS) programmind design pattern
    static instances = [];
    static idCounter = 0;

    constructor(scene, { x, y, displayWidth, displayHeight, spriteKey, gamePieceName = 'Game Piece Unnamed' }) {
        console.log(`GamePiece constructor...`);
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, spriteKey)
            .setOrigin(0.5, 0.5) //origin in the middle ?
            .setInteractive({ draggable: true });
        this.sprite.displayWidth = displayWidth * scene.sceneDistanceUnitPixels;
        this.sprite.displayHeight = displayHeight * scene.sceneDistanceUnitPixels;
        this.spriteKey = spriteKey;

        //Usable properties
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        this.gamePieceName = gamePieceName;

        //Additional configuration
        this.setOnDragListener();
        this.setGamePieceListener();
        GamePiece.instances = [...GamePiece.instances, this];
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
            this.scene.getSidePanelScene().updateSidePanelScene({ headerText: this.gamePieceName });
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

    changeTexture() {
        this.sprite.setTexture(this.spriteKey);
    }

    select() {
        this.isSelected = true;
    }

    deselect() {
        this.isSelected = false;
    }
}

export default GamePiece;