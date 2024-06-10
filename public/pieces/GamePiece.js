import { CONSTANTS } from "../Constants.js";
class GamePiece {
    static instances = [];
    static idCounter = 0;

    constructor({ scene, gamePieceName, x, y, rotationAngle, heightInDistanceUnits, widthInDistanceUnits, color = null }) {
        this.scene = scene;
        this.gamePieceName = gamePieceName;
        this.height = heightInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.width = widthInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.container = this.scene.add.container(x, y);
        this.container.setRotation(rotationAngle);
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        GamePiece.activeGamePiece = null;
        this.color = color;
        this.nodesComposition = {};

        this.setActivateListener();

        GamePiece.instances = [...GamePiece.instances, this];
    }

    configureGamePiece() {
        throw new Error('You must implement the configureGamePiece method');
    }

    setNodes() {
        throw new Error('You must implement the setNodes method');
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
        //GamePiece.activeGamePiece.sprite.setTint(185273);
        GamePiece.showActiveGamePieceNodes();
        this.scene.getGamePieceDetailsScene().updateGamePieceDetailsScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getGamePieceDetailsScene().setVisible(true);
    }

    static deactivateGamePiece() {
        if (GamePiece.getActiveGamePiece() === null) return;
        GamePiece.getActiveGamePiece().nodesComposition.updateNodesPosition();
        GamePiece.hideActiveGamePieceNodes();
        //GamePiece.activeGamePiece?.sprite.clearTint();
        GamePiece.getActiveGamePiece()?.scene.getGamePieceDetailsScene().setVisible(false);
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
        GamePiece.activeGamePiece.nodesComposition.getNodes().forEach(node => node.setVisible(false));
    }

    static showActiveGamePieceNodes() {
        GamePiece.activeGamePiece.nodesComposition.getNodes()
            .filter(node => node.isVisible)
            .forEach(node => node.setVisible(true));
    }

    showContainerHelpBounds(show = false) {
        if (!show) return;
        //Shows only half of the container's bounds, to show full bounds remove the division by 2
        //Should be called after all other elements render
        var containerBoundsColor = CONSTANTS.BASIC_COLORS.CLASSIC_RED;
        var boundsRectangle = this.scene.add.rectangle(0, 0, this.width, this.height, containerBoundsColor);
        this.container.add(boundsRectangle);
    }
}

export default GamePiece;   