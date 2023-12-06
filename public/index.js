var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

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

}

function create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');

}

function update() {
}