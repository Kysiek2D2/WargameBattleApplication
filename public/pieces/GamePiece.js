import { CONSTANTS } from "../Constants.js";
import GamePieceDetailsScene from "../scenes/GamePieceDetailsScene.js";


class GamePiece {
    // Entity-Component-System (ECS) programmind design pattern
    static instances = [];
    static idCounter = 0;
    static activeGamePiece = null;

    constructor(scene, gamePieceName = 'Game Piece Unnamed') {
        console.log(`GamePiece constructor...`);
        this.scene = scene;

        //Usable properties
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        this.gamePieceName = gamePieceName;

        //Additional configuration
        GamePiece.instances = [...GamePiece.instances, this];
        GamePiece.activeGamePiece = null;
    }

    setActivateListener(mainShape) {
        //Activate listener
        mainShape.setInteractive(); // Make sure the sprite is interactive
        mainShape.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);

            if (GamePiece.activeGamePiece !== null) {
                GamePiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }

            this.activateGamePiece();

            console.log(`Active game piece is: ${GamePiece.activeGamePiece.gamePieceName}`);
        });
    }

    static isMouseClickOnActiveGamePieceCornerNode(pointer) {
        // Convert screen coordinates to world coordinates
        if (GamePiece.activeGamePiece === null) return false;
        var worldX = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnCornerNode = Object.values(GamePiece.activeGamePiece.cornerNodes).some(node => node.getBounds().contains(worldX, worldY));
        console.log(`Is mouse click on corner ion node: ${isMouseOnCornerNode}`);
        return isMouseOnCornerNode;
    }

    activateGamePiece() {
        GamePiece.activeGamePiece = this;
        GamePiece.activeGamePiece.sprite.setTint(185273);
        this.scene.getGamePieceDetailsScene().updateGamePieceDetailsScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getGamePieceDetailsScene().setVisible(true);
    }

    static deactivateGamePiece() {
        if (GamePiece.activeGamePiece === null) return;
        GamePiece.activeGamePiece?.sprite.clearTint();
        GamePiece.activeGamePiece?.scene.getGamePieceDetailsScene().setVisible(false);
        GamePiece.activeGamePiece = null;
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

    static getActiveGamePiece() {
        return GamePiece.activeGamePiece;
    }

}

export default GamePiece;