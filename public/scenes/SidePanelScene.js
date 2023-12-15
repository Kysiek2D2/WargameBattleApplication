import { CONSTANTS } from "../Constants.js";


class SidePanelScene extends Phaser.Scene {
    constructor() {
        console.log(`SidePanelScene constructor...`);
        super({ key: CONSTANTS.SCENES.SIDE_PANEL_SCENE, active: true });
        this.sidePanelConfig = {
            widthPercentage: 15,
            heightPercentage: 100,
            isVisible: true,
            health: 100, // Initial health value
        };
    }

    init() {
        this.setVisible(this.sidePanelConfig.isVisible);
    }

    create() {
        // Set the background color
        this.cameras.main.setBackgroundColor(0xff0000); // Red color
        // Set up the side panel UI elements (e.g., header, buttons, etc.)
        // You can use this.add.text, this.add.image, etc. to create elements
        // Example: this.add.text(x, y, 'Header', { fontSize: '16px', fill: '#fff' });

        // Update the health display
        this.healthText = this.add.text(10, 10, `Health: ${this.sidePanelConfig.health}`, {
            fontSize: '16px',
            fill: '#fff',
        });
        // Adjust the camera to take only a portion of the screen
        const { width, height } = this.game.config;
        const sidePanelWidth = (this.sidePanelConfig.widthPercentage / 100) * width;
        this.cameras.main.setViewport(width - sidePanelWidth, 0, sidePanelWidth, height);

        // Add a listener to handle input inside SidePanelScene
        // this.input.on('pointerdown', this.handlePointerInteraction, this);
        // this.input.on('pointermove', this.handlePointerInteraction, this);

    }

    isMouseClickOnSidePanel(pointer) {
        // Check if the pointer click is inside the SidePanelScene bounds
        const { width, height } = this.game.config;
        const sidePanelWidth = (this.sidePanelConfig.widthPercentage / 100) * width;
        if (pointer.x >= width - sidePanelWidth) {
            // Handle the interaction within the SidePanelScene
            // For example, you can add logic to handle button clicks, etc.
            console.log('Pointer down INSIDE SidePanelScene');
            return true;
        } else {
            console.log('Pointer down OUTSIDE SidePanelScene');
            return false;
        }
    }

    setHealth(health) {
        this.sidePanelConfig.health = health;
        if (this.healthText) {
            this.healthText.setText(`Health: ${this.sidePanelConfig.health}`);
        }
    }

    setVisible(isVisible) {
        this.sidePanelConfig.isVisible = isVisible;
        this.scene.setVisible(isVisible, this);
    }
}

export default SidePanelScene;