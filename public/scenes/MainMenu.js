class MainMenu extends Phaser.Scene {

    init() { }

    preload() { }

    create() {
        console.log(`MainMenu create...`);
        this.scene.start('FireAndSwordScene');
    }

    update() { }
}

export default MainMenu;