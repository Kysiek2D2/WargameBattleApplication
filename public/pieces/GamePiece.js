class GamePiece {
    static instances = [];
    static idCounter = 0;

    constructor({ scene, gamePieceName }) {
        this.scene = scene;
        this.gamePieceName = gamePieceName;

    }

}

export default GamePiece;   