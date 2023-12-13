import WargameScene from "./WargameScene.js";
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
        this.gameDistanceUnitPixels = this.calculateGameDistanceUnitPixels();
        this.loadMap('universalGrassBattleground');
        this.setListenerForCameraMovement();

        this.unit = this.add.sprite(1100, 110, 'basicInfantryUnitSizeL')
            .setOrigin(0.5, 0.5)
            .setInteractive({ draggable: true });
        this.unit.displayWidth = 6.3 * this.gameDistanceUnitPixels;
        this.unit.displayHeight = 2.5 * this.gameDistanceUnitPixels;
        this.input.setDraggable(this.unit);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })
    }

    update() {
        this.handleZooming();
    }
}

export default FireAndSwordScene;