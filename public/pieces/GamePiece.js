class GamePiece {
    static instances = [];
    static idCounter = 0;

    constructor({ scene, gamePieceName, x, y }) {
        this.scene = scene;
        this.gamePieceName = gamePieceName;

    }

}

export default GamePiece;   