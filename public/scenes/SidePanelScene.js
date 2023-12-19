import { CONSTANTS } from "../Constants.js";


class SidePanelScene extends Phaser.Scene {
    constructor() {
        console.log(`SidePanelScene constructor...`);
        super({ key: CONSTANTS.SCENES.SIDE_PANEL_SCENE, active: true });
        this.sidePanelConfig = {
            widthPercentage: 20,
            heightPercentage: 100,
            isVisible: true,
        };
        this.sidePanelWidth;
        this.sidePanelHeight;
        this.camera;

        this.sidePanelSceneAllComponentsContainer;
        this.panelLastOccupiedPixelOnYAxis = 0;
        this.headerText;
        this.gamePieceStrengthComponent;
    }

    preload() {
        this.load.image({ key: 'oldPaperBackground', url: 'assets/scenery/oldScroll2.png' })
    }

    init() {
        this.sidePanelSceneAllComponentsContainer = this.add.container(0, 0);
        this.setVisible(this.sidePanelConfig.isVisible);
        this.camera = this.cameras.main;
    }


    create() {
        this.adjustCamera();
        this.setTransparentSpaceholder(this.sidePanelHeight * 0.1);

        this.loadSidePanelSceneBackground('oldPaperBackground');
        this.setTransparentSpaceholder(50);
        this.headerText = this.setText("GamePiece Name Placeholder", 20);
        this.setTransparentSpaceholder(50);
        this.gamePieceStrengthComponent = this.setGamePieceStrengthComponent(36);
    }

    loadSidePanelSceneBackground(spriteKey) {
        const background = this.add.image(0, 0, spriteKey);
        background.setOrigin(0);
        background.setScale(this.sidePanelWidth / background.width, this.sidePanelHeight / background.height);
        background.setDepth(-1);
    }

    distributeElementsEqually_On_Y_Axis(container) {
        let totalHeight = 0;
        container.list.forEach((element) => {
            totalHeight += element.height;
        });
        const spacing = totalHeight / (container.list.length - 1);
        container.list.forEach((element, index) => {
            element.y = (index + 1) * spacing;
        });
    }

    distributeElementsEquallyOn_X_Axis(container) {
        let totalWidth = 0;
        container.list.forEach((element) => {
            totalWidth += element.width;
        });
        const spacing = totalWidth / (container.list.length - 1);
        container.list.forEach((element, index) => {
            element.x = (index - 1) * spacing;
        });
    }

    setTransparentSpaceholder(height) {
        // Add a transparent sprite to take up space
        const transparentSprite = this.add.sprite(0, 0, null);
        transparentSprite.isVerticalSpaceholder = true;
        transparentSprite.setAlpha(0); // Set the alpha value to 0 for transparency
        transparentSprite.setSize(this.sidePanelWidth, height); // Adjust the size as needed
        this.panelLastOccupiedPixelOnYAxis += transparentSprite.height; //Lifting down SidePanelScene elements
    }

    adjustCamera() {
        // Adjust the camera to take only a portion of the screen
        const { width: gameConfigWidth, height: gameConfigHeight } = this.game.config;
        this.sidePanelWidth = (this.sidePanelConfig.widthPercentage / 100) * gameConfigWidth;
        this.sidePanelHeight = gameConfigHeight;
        console.log(`SidePanel size: \n width: ${this.sidePanelWidth}, \n height: ${this.sidePanelHeight}`);
        this.camera.setViewport(gameConfigWidth - this.sidePanelWidth, 0, this.sidePanelWidth, gameConfigHeight);
        console.log(`SidePanelScene camera x: ${this.camera.x}, y: ${this.camera.y}`);
    }

    setText(textString, fontSize) {
        var textNode = this.add.text(this.sidePanelWidth / 2, this.panelLastOccupiedPixelOnYAxis, textString, { fontSize: `${fontSize}px`, fill: '#000', fontFamily: 'Algerian' });
        textNode.setSize(this.sidePanelWidth, 50); //need to declare size to give it some space to take
        const headerTextX = (this.sidePanelWidth / 2) - (textNode.width / 2);
        textNode.setX(headerTextX);
        console.log(`Added text: ${headerTextX}`);
        this.panelLastOccupiedPixelOnYAxis += textNode.height; //Lifting down SidePanelScene elements
        return textNode;
    }

    setGamePieceStrengthComponent(fontSize) {
        const container = this.add.container(this.sidePanelWidth / 2, this.panelLastOccupiedPixelOnYAxis);
        container.setSize(this.sidePanelWidth, 50); //need to declare size to give it some space to take
        const minusButton = this.add.image(0, 0, 'minusButton')
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('Minus button clicked');
                this.updateGamePiece();
            });
        container.add(minusButton);

        const gamePieceStrengthText = this.add.text(0, 0, '0', { fontSize: `${fontSize}px`, fill: '#000', fontFamily: 'Algerian' })
            .setOrigin(0.5, 0);
        container.add(gamePieceStrengthText);

        const plusButton = this.add.image(0, 0, 'plusButton')
            .setOrigin(1, 0)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('Plus button clicked');
                this.updateGamePiece();
            });
        container.add(plusButton);

        this.distributeElementsEquallyOn_X_Axis(container);
        this.panelLastOccupiedPixelOnYAxis += container.height; //Lifting down SidePanelScene elements
        return container;
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

    setVisible(isVisible) {
        this.sidePanelConfig.isVisible = isVisible;
        this.scene.setVisible(isVisible, this);
    }
}

export default SidePanelScene;