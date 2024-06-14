import WargameScene from "./WargameScene.js";
import RegimentPiece from "../pieces/RegimentPiece.js";
import BasicMeasureTapePiece from "../pieces/BasicMeasureTapePiece.js";
import { CONSTANTS } from "../Constants.js";

class FireAndSwordScene extends WargameScene {

    constructor() {
        super(CONSTANTS.SCENES.FIRE_AND_SWORD_SCENE);
    }

    preload() {
        super.preload();
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
            spriteKey: 'basic-infantry-size-L.png',
            color: CONSTANTS.BASIC_COLORS.YELLOW,
            isTrayVisible: true,
            regimentType: CONSTANTS.REGIMENT_TYPES.INFANTRY,
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
            spriteKey: 'basic-cavalery-size-M.jpg',
            color: CONSTANTS.BASIC_COLORS.GREEN,
            isTrayVisible: true,
            regimentType: CONSTANTS.REGIMENT_TYPES.CAVALRY,
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
            spriteKey: 'basic-infantry-size-L.png',
            color: CONSTANTS.BASIC_COLORS.BLUE,
            isTrayVisible: true,
            regimentType: CONSTANTS.REGIMENT_TYPES.INFANTRY,
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
            spriteKey: 'basic-cavalery-size-S.jpg',
            color: CONSTANTS.BASIC_COLORS.CLASSIC_RED,
            isTrayVisible: true,
            regimentType: CONSTANTS.REGIMENT_TYPES.CAVALRY
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
            spriteKey: 'denseForestShadowed.png',
        });
        var measureTape = new BasicMeasureTapePiece({
            scene: this,
            x: 100,
            y: 100,
            rotationAngle: 0,
            widthInDistanceUnits: 12,
            heightInDistanceUnits: 1,
            gamePieceName: 'tape',
        });

        testTerrain1.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.TERRAIN_PIECE);
        RegimentPiece.showRegimentSymbolics(true);

    }

    update() {
        super.update();
    }
}

export default FireAndSwordScene;