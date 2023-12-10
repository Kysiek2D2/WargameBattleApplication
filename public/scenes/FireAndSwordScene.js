
class FireAndSwordScene extends Phaser.Scene {

    constructor() {
        super("FireAndSwordScene");
    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/battlegrounds72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        const BATTLEGROUND_SCREEN_WIDTH_PRC = 0.8;
        const BATTLEGROUND_SCREEN_HEIGHT_PRC = 0.53;

        var battleground = this.add.image(config.width / 2, config.height / 2, 'universalGrassBattleground');
        battleground.setOrigin(0.5, 0.5);
        battleground.setPosition(config.width / 2, config.height / 2);
        battleground.width = config.width * BATTLEGROUND_SCREEN_WIDTH_PRC;
        battleground.height = config.height * BATTLEGROUND_SCREEN_HEIGHT_PRC;

        var unit = this.add.image(1100, 110, 'basicInfantryUnitSizeL')
            .setOrigin(0.5, 0.5)
            .setScale(0.1, 0.1)
            .setInteractive({ draggable: true });
        this.input.setDraggable(unit);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

    }
}



