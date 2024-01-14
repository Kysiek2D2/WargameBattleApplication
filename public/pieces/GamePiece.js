class GamePiece {
    static instances = [];
    static idCounter = 0;

    constructor({ scene, gamePieceName, x, y, heightInDistanceUnits, widthInDistanceUnits, color = null }) {
        this.scene = scene;
        this.gamePieceName = gamePieceName;
        this.height = heightInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.width = widthInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.container = this.scene.add.container(x, y);
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        GamePiece.activeGamePiece = null;
        this.color = color;
        this.nodes = {};

        this.setActivateListener();

        GamePiece.instances = [...GamePiece.instances, this];
    }

    setActivateListener() {
        this.container.setInteractive();
        this.container.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);

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
        GamePiece.showActiveGamePieceNodes();
        this.scene.getGamePieceDetailsScene().updateGamePieceDetailsScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getGamePieceDetailsScene().setVisible(true);
    }

    static deactivateGamePiece() {
        if (GamePiece.activeGamePiece === null) return;
        GamePiece.activeGamePiece.updateNodes()
        GamePiece.hideActiveGamePieceNodes();
        GamePiece.activeGamePiece?.sprite.clearTint();
        GamePiece.activeGamePiece?.scene.getGamePieceDetailsScene().setVisible(false);
        GamePiece.activeGamePiece = null;
    }

    static getActiveGamePiece() {
        return GamePiece.activeGamePiece;
    }

    // static isMouseClickOnGamePiece(pointer, scene) {
    //     var worldX = scene.camera.getWorldPoint(pointer.x, pointer.y).x;
    //     var worldY = scene.camera.getWorldPoint(pointer.x, pointer.y).y;
    //     var gamePiecesUnderClick = GamePiece.instances.filter(i => i.sprite.getBounds().contains(worldX, worldY));
    //     var isMouseOnGamePiece = gamePiecesUnderClick.length > 0;
    //     return isMouseOnGamePiece;
    // }

    static hideActiveGamePieceNodes() {
        Object.values(GamePiece.activeGamePiece.nodes).forEach(node => node.setVisible(false));
    }

    static showActiveGamePieceNodes() {
        Object.values(GamePiece.activeGamePiece.nodes).forEach(node => node.setVisible(true));
    }
}

export default GamePiece;   