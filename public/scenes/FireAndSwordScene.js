import WargameScene from "./WargameScene.js";
import GamePiece from "../pieces/GamePiece.js";
import { someFunction } from "../UtilityClasses/UtilityMain.js";

class FireAndSwordScene extends WargameScene {

    constructor() {
        super("FireAndSwordScene");

    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/maps/maps72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        console.log('FireAndSwordScene create...')
        this.sceneDistanceUnitPixels = this.calculatesceneDistanceUnitPixels();
        this.loadMap('universalGrassBattleground');
        this.setListenerForCameraMovement();

        var testUnit = new GamePiece(this, 1100, 110, 6.3, 2.5, 'basicInfantryUnitSizeL');
        var testUnit2 = new GamePiece(this, 1300, 310, 6.3, 2.5, 'basicInfantryUnitSizeL');
    }

    update() {
        this.handleZooming();
    }
}

export default FireAndSwordScene;