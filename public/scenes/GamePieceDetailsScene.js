import SidePanelScene from "./SidePanelScene.js";

class GamePieceDetailsScene extends SidePanelScene {
    constructor() {
        console.log(`GamePieceDetailsScene constructor...`);
        super({ widthPercentage: 20, heightPercentage: 100, isVisible: false });
        this.gamePiece = null;
        this.headerText;
        this.gamePieceStrengthValue = 0;
    }

    preload() {
        super.preload({ backgroundUrl: 'assets/scenery/oldScroll2.png' });
        this.load.image({ key: 'plusButton', url: 'assets/icons/plusButtonGrey_ver1.png' })
        this.load.image({ key: 'minusButton', url: 'assets/icons/minusButtonGrey_ver1.png' })
    }

    init() {
        super.init();
    }

    create() {
        super.create();
        this.adjustCamera();
        this.loadSceneBackground(this.sceneBackground);

        this.setTransparentSpaceholder(this.sceneHeight * 0.1);
    }

    adjustCamera() {
        const { width: gameConfigWidth, height: gameConfigHeight } = this.game.config;
        this.sceneWidth = (this.sceneConfig.widthPercentage / 100) * gameConfigWidth;
        this.sceneHeight = (this.sceneConfig.heightPercentage / 100) * gameConfigHeight;
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

    updateGamePiece({ newGamePieceStrengthValue }) {
        this.gamePiece.gamePieceStrength = newGamePieceStrengthValue;
    }
}

export default GamePieceDetailsScene;