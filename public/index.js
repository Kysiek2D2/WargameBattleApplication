BATTLEGROUND_SCREEN_WIDTH_PRC = 0.8;
BATTLEGROUND_SCREEN_HEIGHT_PRC = 0.53;

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth*BATTLEGROUND_SCREEN_WIDTH_PRC,
    height: window.innerHeight*BATTLEGROUND_SCREEN_HEIGHT_PRC,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
};

var game = new Phaser.Game(config);
var battleground;
var sidePanel;

function preload() {
    //Example of loading asset with managing cache. Cache is bypassed by adding query parameter to it.
    this.load.image({key: 'sky', url: 'assets/sky.png', cache: { crossOrigin: 'anonymous', responseType: 'blob', noCache: true }});
    //
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    
    this.load.image({key: 'universalGrassBattleground', url: 'assets/battlegrounds72x48/universalGrass.jpg', cache: { crossOrigin: 'anonymous', responseType: 'blob', noCache: true }});

}

function create() {
    
    // this.add.image(BATTLEGROUND_WIDTH/2, BATTLEGROUND_HEIGHT*2, 'universalGrass');
    // this.add.image(400, 300, 'star')
    battleground = this.add.image(config.width/2, config.height, 'universalGrassBattleground');
    battleground.width = window.innerWidth*BATTLEGROUND_SCREEN_WIDTH_PRC;
    battleground.height = window.innerHeight*BATTLEGROUND_SCREEN_HEIGHT_PRC;

    sidePanel = this.add.image(config.width/2, config.height, 'white');
    sidePanel.width = window.innerWidth * 0.1;
    sidePanel.height = battleground.height;
}

function update() {
}