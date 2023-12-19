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
        this.sidePanelBackground;

        this.gamePiece = null;
        this.panelLastOccupiedPixelOnYAxis = 0;
        this.headerText;
        this.gamePieceStrengthValue = 0;
    }

    preload() {
        this.load.image({ key: 'backgroundImage', url: 'assets/scenery/oldScroll2.png' })
        this.load.image({ key: 'plusButton', url: 'assets/icons/plusButtonGrey_ver1.png' })
        this.load.image({ key: 'minusButton', url: 'assets/icons/minusButtonGrey_ver1.png' })

    }

    init() {
        this.sidePanelBackground = 'backgroundImage';
        this.setVisible(this.sidePanelConfig.isVisible);
        this.camera = this.cameras.main;
    }

    create() {
        this.adjustCamera();
        this.setTransparentSpaceholder(this.sidePanelHeight * 0.1);
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
            console.log(`element.width: ${element.width}`)
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
        const headerTextX = (this.sidePanelWidth / 2) - (textNode.width / 2);
        textNode.setX(headerTextX);
        console.log(`Added text: ${headerTextX}`);
        this.panelLastOccupiedPixelOnYAxis += textNode.height; //Lifting down SidePanelScene elements
    }

    setGamePieceStrengthComponent({ fontSize, gamePieceStrengthValue }) {
        const container = this.add.container(this.sidePanelWidth / 2, this.panelLastOccupiedPixelOnYAxis);
        container.setSize(this.sidePanelWidth, 50); //need to declare size to give it some space to take
        const elementWidth = 50;
        const elementHeight = 50;

        const minusButton = this.add.image(0, 0, 'minusButton')
            .setOrigin(0, 0)
            .setDisplaySize(elementWidth, elementHeight)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('Minus button clicked');
                this.gamePieceStrengthValue -= 1;
                gamePieceStrengthText.setText(this.gamePieceStrengthValue);
                this.updateGamePiece({ newGamePieceStrengthValue: this.gamePieceStrengthValue });
            });
        minusButton.width = elementWidth;
        minusButton.height = elementHeight;
        container.add(minusButton);

        const gamePieceStrengthText = this.add.text(0, 0, gamePieceStrengthValue, { fontSize: `${fontSize}px`, fill: '#000', fontFamily: 'Algerian' })
            .setOrigin(0.5, 0.5)
            .setY(elementHeight / 2)
        gamePieceStrengthText.width = elementWidth;
        gamePieceStrengthText.height = elementHeight;
        container.add(gamePieceStrengthText);

        const plusButton = this.add.image(0, 0, 'plusButton')
            .setOrigin(1, 0)
            .setDisplaySize(elementWidth, elementHeight)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('Plus button clicked');
                this.gamePieceStrengthValue += 1;
                gamePieceStrengthText.setText(this.gamePieceStrengthValue);
                this.updateGamePiece({ newGamePieceStrengthValue: this.gamePieceStrengthValue });
            });
        plusButton.width = elementWidth;
        plusButton.height = elementHeight;
        container.add(plusButton);

        this.distributeElementsEquallyOn_X_Axis(container);
        this.panelLastOccupiedPixelOnYAxis += container.height; //Lifting down SidePanelScene elements
    }

    updateSidePanelScene({ gamePiece, headerText, gamePieceStrengthValue }) {
        //TODO: this function is called when GamePiece is set active. 
        //Here we update SidePanelScene properties to be displayed.
        this.gamePiece = gamePiece;
        this.headerText = headerText;
        this.gamePieceStrengthValue = gamePieceStrengthValue;
        this.clearSidePanelScene(); //clearing previous SidePanelScene elements so it's rendered again
        this.loadSidePanelSceneBackground(this.sidePanelBackground);

        this.setTransparentSpaceholder(this.sidePanelHeight * 0.2);
        this.setText(this.headerText, 20);
        this.setTransparentSpaceholder(50);
        this.setGamePieceStrengthComponent({ fontSize: 36, gamePieceStrengthValue: this.gamePieceStrengthValue });
    }

    clearSidePanelScene() {
        this.children.removeAll();
        this.panelLastOccupiedPixelOnYAxis = 0;
    }

    createGamePieceStrengthComponent() {
        //That can be separate component.
        //Set listeners here. After value is changed, it's propagated to related GamePiece.
    }

    updateGamePiece({ newGamePieceStrengthValue }) {
        this.gamePiece.gamePieceStrength = newGamePieceStrengthValue;
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