class GamePiece {
    static instances = [];
    static idCounter = 0;

    constructor({ scene, gamePieceName, x, y, heightInDistanceUnits, widthInDistanceUnits }) {
        this.scene = scene;
        this.gamePieceName = gamePieceName;
        this.height = heightInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.width = widthInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.container = this.scene.add.container(x, y);
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        GamePiece.activeGamePiece = null;

        GamePiece.instances = [...GamePiece.instances, this];
    }
}

export default GamePiece;   