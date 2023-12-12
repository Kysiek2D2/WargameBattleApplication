class MainMenu extends Phaser.Scene {

    init() { }

    preload() { }

    create() {
        console.log(`MainMenu create...`);
        this.scene.start('FireAndSwordScene', { mapWidthInGameDistanceUnits: 72, mapHeightInGameDistanceUnits: 48 });
    }

    update() { }
}

export default MainMenu;