import WargameScene from "./WargameScene.js";
import GamePiece from "../pieces/GamePiece.js";
import { CONSTANTS } from "../Constants.js";

class FireAndSwordScene extends WargameScene {

    constructor() {
        super(CONSTANTS.SCENES.FIRE_AND_SWORD_SCENE);
    }

    preload() {
        super.preload();
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
        this.load.image({ key: 'basicCavalerySizeM', url: 'assets/units/basic-cavalery-size-M.jpg' });
        this.load.image({ key: 'basicCavalerySizeS', url: 'assets/units/basic-cavalery-size-S.jpg' });
    }

    create() {
        super.create();
        console.log('FireAndSwordScene create...');

        var testUnit1 = new GamePiece(this, {
            x: 1100,
            y: 110,
            displayWidth: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.width,
            displayHeight: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.height,
            spriteKey: 'basicInfantryUnitSizeL',
            gamePieceName: 'Szwedzka \nPiechota \nKrajowa',
            gamePieceStrength: 16,
        });
        console.log(`TestUnit1 depth: ${testUnit1.sprite.depth}`)
        var testUnit2 = new GamePiece(this, {
            x: 1120,
            y: 110,
            displayWidth: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_M.width,
            displayHeight: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_M.height,
            spriteKey: 'basicCavalerySizeM',
            gamePieceName: 'Kirasjerzy',
            gamePieceStrength: 13,
        });
        console.log(`TestUnit2 depth: ${testUnit2.sprite.depth}`)
        var testUnit3 = new GamePiece(this, {
            x: 1200,
            y: 110,
            displayWidth: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.width,
            displayHeight: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.height,
            spriteKey: 'basicInfantryUnitSizeL',
            gamePieceName: 'Strzelcy \nGrodowi',
            gamePieceStrength: 10,
        });
        var testUnit4 = new GamePiece(this, {
            x: 1250,
            y: 310,
            displayWidth: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_S.width,
            displayHeight: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_S.height,
            spriteKey: 'basicCavalerySizeS',
            gamePieceName: 'Jazda \nChorwacka',
            gamePieceStrength: 10,
        });
    }

    update() {
        super.update();
    }
}

export default FireAndSwordScene;