import { CONSTANTS } from "../Constants.js";


class GamePieceDetailsScene extends Phaser.Scene {
    constructor() {
        console.log(`GamePieceDetailsScene constructor...`);
        super({ key: CONSTANTS.SCENES.GAME_PIECE_DETAILS_SCENE, active: true });
        this.sceneConfig = {
            widthPercentage: 20,
            heightPercentage: 100,
            isVisible: true,
        };
        this.sceneWidth;
        this.sceneHeight;
        this.camera;
        this.sceneBackground;

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
        this.sceneBackground = 'backgroundImage';
        this.setVisible(this.sceneConfig.isVisible);
        this.camera = this.cameras.main;
    }

    create() {
        this.adjustCamera();
        this.setTransparentSpaceholder(this.sceneHeight * 0.1);
    }

    loadSceneBackground(spriteKey) {
        const background = this.add.image(0, 0, spriteKey);
        background.setOrigin(0);
        background.setScale(this.sceneWidth / background.width, this.sceneHeight / background.height);
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
        transparentSprite.setSize(this.sceneWidth, height); // Adjust the size as needed
        this.panelLastOccupiedPixelOnYAxis += transparentSprite.height; //Lifting down GamePieceDetailsScene elements
    }

    adjustCamera() {
        // Adjust the camera to take only a portion of the screen
        const { width: gameConfigWidth, height: gameConfigHeight } = this.game.config;
        this.sceneWidth = (this.sceneConfig.widthPercentage / 100) * gameConfigWidth;
        this.sceneHeight = gameConfigHeight;
        console.log(`GamePieceDetailsScene size: \n width: ${this.sceneWidth}, \n height: ${this.sceneHeight}`);
        this.camera.setViewport(gameConfigWidth - this.sceneWidth, 0, this.sceneWidth, gameConfigHeight);
        console.log(`GamePieceDetailsScene camera x: ${this.camera.x}, y: ${this.camera.y}`);
    }

    setText(textString, fontSize) {
        var textNode = this.add.text(this.sceneWidth / 2, this.panelLastOccupiedPixelOnYAxis, textString, { fontSize: `${fontSize}px`, fill: '#000', fontFamily: 'Algerian' });
        const textX = (this.sceneWidth / 2) - (textNode.width / 2);
        textNode.setX(textX);
        console.log(`Added text: ${textX}`);
        this.panelLastOccupiedPixelOnYAxis += textNode.height; //Lifting down GamePieceDetailsScene elements
    }

    setGamePieceStrengthComponent({ fontSize, gamePieceStrengthValue }) {
        const container = this.add.container(this.sceneWidth / 2, this.panelLastOccupiedPixelOnYAxis);
        container.setSize(this.sceneWidth, 50); //need to declare size to give it some space to take
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
        this.panelLastOccupiedPixelOnYAxis += container.height; //Lifting down GamePieceDetailsScene elements
    }

    updateGamePieceDetailsScene({ gamePiece, headerText, gamePieceStrengthValue }) {
        //TODO: this function is called when GamePiece is set active. 
        //Here we update GamePieceDetailsScene properties to be displayed.
        this.gamePiece = gamePiece;
        this.headerText = headerText;
        this.gamePieceStrengthValue = gamePieceStrengthValue;
        this.clearGamePieceDetailsScene(); //clearing previous GamePieceDetailsScene elements so it's rendered again
        this.loadSceneBackground(this.sceneBackground);

        this.setTransparentSpaceholder(this.sceneHeight * 0.2);
        this.setText(this.headerText, 20);
        this.setTransparentSpaceholder(50);
        this.setGamePieceStrengthComponent({ fontSize: 36, gamePieceStrengthValue: this.gamePieceStrengthValue });
    }

    clearGamePieceDetailsScene() {
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

    isMouseClickOnGamePieceDetailsScene(pointer) {
        // Check if the pointer click is inside the GamePieceDetailsScene bounds
        const { width, height } = this.game.config;
        const GamePieceDetailsSceneWidth = (this.sceneConfig.widthPercentage / 100) * width;
        if (pointer.x >= width - GamePieceDetailsSceneWidth) {
            // Handle the interaction within the GamePieceDetailsScene
            // For example, you can add logic to handle button clicks, etc.
            console.log('Pointer down INSIDE GamePieceDetailsScene');
            return true;
        } else {
            console.log('Pointer down OUTSIDE GamePieceDetailsScene');
            return false;
        }
    }

    setVisible(isVisible) {
        this.sceneConfig.isVisible = isVisible;
        this.scene.setVisible(isVisible, this);
    }
}

export default GamePieceDetailsScene;