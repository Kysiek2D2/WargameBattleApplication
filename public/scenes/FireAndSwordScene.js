import WargameScene from "./WargameScene.js";
import GamePiece from "../pieces/GamePiece.js";
import { CONSTANTS } from "../Constants.js";
import { someFunction } from "../UtilityClasses/UtilityMain.js";

class FireAndSwordScene extends WargameScene {

    constructor() {
        super(CONSTANTS.SCENES.FIRE_AND_SWORD_SCENE);
    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/maps/maps72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        super.create();
        console.log('FireAndSwordScene create...')
        this.loadMap('universalGrassBattleground');

        var testUnit = new GamePiece(this, 1100, 110, 6.3, 2.5, 'basicInfantryUnitSizeL');
        var testUnit2 = new GamePiece(this, 1300, 310, 6.3, 2.5, 'basicInfantryUnitSizeL');
    }

    update() {
        super.update();
    }
}

export default FireAndSwordScene;