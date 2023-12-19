import WargameScene from "./WargameScene.js";
import GamePiece from "../pieces/GamePiece.js";
import { CONSTANTS } from "../Constants.js";
import { someFunction } from "../UtilityClasses/UtilityMain.js";

class FireAndSwordScene extends WargameScene {

    constructor() {
        super(CONSTANTS.SCENES.FIRE_AND_SWORD_SCENE);
    }

    preload() {
        super.preload();
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        super.create();
        console.log('FireAndSwordScene create...');

        var testUnit1 = new GamePiece(this, {
            x: 1100,
            y: 110,
            displayWidth: 6.3,
            displayHeight: 2.5,
            spriteKey: 'basicInfantryUnitSizeL',
            gamePieceName: 'Regiment Gwardii',
            gamePieceStrength: 5,
        });
        console.log(`TestUnit1 depth: ${testUnit1.sprite.depth}`)
        var testUnit2 = new GamePiece(this, {
            x: 1120,
            y: 110,
            displayWidth: 6.3,
            displayHeight: 2.5,
            spriteKey: 'basicInfantryUnitSizeL',
            gamePieceName: 'Kozacy Rejestrowi',
            gamePieceStrength: 10,
        });
        console.log(`TestUnit2 depth: ${testUnit2.sprite.depth}`)

    }

    update() {
        super.update();
    }
}

export default FireAndSwordScene;