import WargameScene from "./WargameScene.js";
import RegimentPiece from "../pieces/RegimentPiece.js";
import BasicMeasureTape from "../pieces/BasicMeasureTape.js";
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
        this.load.image({ key: 'denseForestShadowed', url: 'assets/terrains/denseForestShadowed.png' });
    }

    create() {
        super.create();
        console.log('FireAndSwordScene create...');

        var testUnit1 = new RegimentPiece({
            scene: this,
            x: 956,
            y: 566,
            rotationAngle: 0,
            widthInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.width,
            heightInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.height,
            gamePieceName: 'Szwedzka \nPiechota \nKrajowa',
            gamePieceStrength: 16,
            spriteKey: 'basicInfantryUnitSizeL',
        });
        console.log(`TestUnit1 depth: ${testUnit1.sprite.depth}`)
        var testUnit2 = new RegimentPiece({
            scene: this,
            x: 1208,
            y: 439,
            rotationAngle: -0.46,
            widthInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_M.width,
            heightInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_M.height,
            gamePieceName: 'Kirasjerzy',
            gamePieceStrength: 13,
            spriteKey: 'basicCavalerySizeM',
        });
        console.log(`TestUnit2 depth: ${testUnit2.sprite.depth}`)
        var testUnit3 = new RegimentPiece({
            scene: this,
            x: 960,
            y: 254,
            rotationAngle: 3.14,
            widthInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.width,
            heightInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_L.height,
            gamePieceName: 'Strzelcy \nGrodowi',
            gamePieceStrength: 10,
            spriteKey: 'basicInfantryUnitSizeL',
        });
        var testUnit4 = new RegimentPiece({
            scene: this,
            x: 665,
            y: 372,
            rotationAngle: 2.63,
            widthInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_S.width,
            heightInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES.SIZE_S.height,
            gamePieceName: 'Jazda \nChorwacka',
            gamePieceStrength: 10,
            spriteKey: 'basicCavalerySizeS',
        });
        var testTerrain1 = new RegimentPiece({
            scene: this,
            x: 830,
            y: 389,
            rotationAngle: -0.58,
            widthInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_TERRAIN_SIZES_IN_INCHES.SIZE_M.width,
            heightInDistanceUnits: CONSTANTS.FIRE_AND_SWORD_TERRAIN_SIZES_IN_INCHES.SIZE_M.height,
            gamePieceName: 'Dense \nForest',
            gamePieceStrength: 10,
            spriteKey: 'denseForestShadowed',
        });
        var measureTape = new BasicMeasureTape({
            scene: this,
            x: 100,
            y: 100,
            rotationAngle: 0,
            widthInDistanceUnits: 12,
            heightInDistanceUnits: 1,
            gamePieceName: 'tape',
        });

        testTerrain1.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.TERRAIN_PIECE);
    }

    update() {
        super.update();
    }
}

export default FireAndSwordScene;