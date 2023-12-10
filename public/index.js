var BATTLEGROUND_SCREEN_WIDTH_PRC = 0.8;
var BATTLEGROUND_SCREEN_HEIGHT_PRC = 0.53;

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.8,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        mouse: true,
        touch: true
    }
};

var game = new Phaser.Game(config);
var battleground;
var sidePanel;
var unit;

function preload() {

    this.load.image({ key: 'universalGrassBattleground', url: 'assets/battlegrounds72x48/universalGrass.jpg' });
    this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
}

function create() {
    battleground = this.add.image(config.width / 2, config.height / 2, 'universalGrassBattleground');
    battleground.setOrigin(0.5, 0.5);
    battleground.setPosition(config.width / 2, config.height / 2);
    battleground.width = config.width * BATTLEGROUND_SCREEN_WIDTH_PRC;
    battleground.height = config.height * BATTLEGROUND_SCREEN_HEIGHT_PRC;

    unit = this.add.image(1100, 110, 'basicInfantryUnitSizeL')
        .setOrigin(0.5, 0.5)
        .setScale(0.1, 0.1)
        .setInteractive({ draggable: true });
    this.input.setDraggable(unit);
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    })
}

function update() {
}