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
        this.sidePanelWidth;
        this.sidePanelHeight;
        this.camera;

        this.headerText;
    }

    init() {
        this.setVisible(this.sidePanelConfig.isVisible);
        this.camera = this.cameras.main;
    }

    create() {
        this.adjustCamera();
        this.camera.setBackgroundColor(0xff0000); // Red background color
        // Set up the side panel UI elements (e.g., header, buttons, etc.)
        // You can use this.add.text, this.add.image, etc. to create elements
        this.headerText = this.addText("GamePiece Name Placeholder", 16);
        // Update the health display
        this.healthText = this.add.text(10, 80, `Health: ${this.sidePanelConfig.health}`, {
            fontSize: '16px',
            fill: '#fff',
        });


        // Add a listener to handle input inside SidePanelScene
        // this.input.on('pointerdown', this.handlePointerInteraction, this);
        // this.input.on('pointermove', this.handlePointerInteraction, this);

    }

    adjustCamera() {
        // Adjust the camera to take only a portion of the screen
        const { width: gameConfigWidth, height: gameConfigHeight } = this.game.config;
        this.sidePanelWidth = (this.sidePanelConfig.widthPercentage / 100) * gameConfigWidth;
        this.sidePanelHeight = gameConfigHeight;
        console.log(`SidePanel size: \n width: ${this.sidePanelWidth}, \n height: ${this.sidePanelHeight}`);
        this.camera.setViewport(gameConfigWidth - this.sidePanelWidth, 0, this.sidePanelWidth, gameConfigHeight);
        // Log x and y coordinates of the SidePanelScene
        console.log(`SidePanelScene camera x: ${this.camera.x}, y: ${this.camera.y}`);
    }

    addText(textString, fontSize) {
        var textNode = this.add.text(10, 10, textString, { fontSize: `${fontSize}px`, fill: '#fff' });
        // Center the header text horizontally
        const headerTextX = (this.sidePanelWidth / 2) - (textNode.width / 2);
        textNode.setX(headerTextX);
        console.log(`headerTextX: ${headerTextX}`);
        return textNode;
    }

    updateSidePanelScene({ headerText }) {
        //TODO: this function is called when GamePiece is set active. 
        //Here we update SidePanelScene properties to be displayed.
        this.headerText.setText(headerText);
        const headerTextX = (this.sidePanelWidth / 2) - (this.headerText.width / 2);
        this.headerText.setX(headerTextX);
    }

    createGamePieceStrengthComponent() {
        //That can be separate component.
        //Set listeners here. After value is changed, it's propagated to related GamePiece.
    }

    updateGamePiece() {
        //Here we can sent request to GamePiece to be updated.
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