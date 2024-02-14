import { CONSTANTS } from "../Constants.js";
import RegimentPiece from "../pieces/RegimentPiece.js";
import BasicMeasureTapePiece from "../pieces/BasicMeasureTapePiece.js";

class GameController {
    constructor(scene) {
        if (GameController.instance) {
            return GameController.instance;
        }
        GameController.instance = this;
        this.mode = null;
        this.scene = scene;
    }

    setMode() {
        if (RegimentPiece.getActiveGamePiece() !== null)
            this.mode = CONSTANTS.CONTROL_MODE.GAME_PIECE_MODE;
        else
            this.mode = CONSTANTS.CONTROL_MODE.CAMERA_MODE;
    }

    setMapPointerMoveListener(map) {
        map.setInteractive();
        map.on("pointermove", (pointer) => {
            this.setMode();
            switch (this.mode) {
                case CONSTANTS.CONTROL_MODE.GAME_PIECE_MODE:
                    break;
                case CONSTANTS.CONTROL_MODE.CAMERA_MODE:
                    if (pointer.isDown) {
                        this.scene.camera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.scene.camera.zoom;
                        this.scene.camera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.scene.camera.zoom;
                    }
                    break;
                default:
                    console.log(`pointer move default case hit`);
            }
        })
    }

    setMapPointerDownListener(map) {
        this.setMode();
        map.on('pointerdown', (pointer) => {
            switch (this.mode) {
                case CONSTANTS.CONTROL_MODE.GAME_PIECE_MODE:
                    console.log('Deactivating game piece...');
                    RegimentPiece.deactivateGamePiece();
                    break;
                case CONSTANTS.CONTROL_MODE.CAMERA_MODE:
                    break;
                default:
                    console.log(`pointer move default case hit`);
            }
        }, this.scene);
    }
}

export default GameController;