class SidePanelScene extends Phaser.Scene {

    constructor({ widthPercentage, heightPercentage, isVisible }) {
        super();
        this.sceneConfig = {
            widthPercentage: widthPercentage,
            heightPercentage: heightPercentage,
            isVisible: isVisible,
        };
        this.panelLastOccupiedPixelOnYAxis = 0;
        this.sceneWidth;
        this.sceneHeight;
        this.camera;
        this.sceneBackground;
    }

    preload({ backgroundUrl }) {
        this.sceneBackground = backgroundUrl;
        this.load.image({ key: backgroundUrl, url: backgroundUrl })
    }

    init() {
        this.setVisible(this.sceneConfig.isVisible);
        this.camera = this.cameras.main;
    }

    create() {
    }

    loadSceneBackground(spriteKey) {
        console.log(`SidePanelScene loadSceneBackground: ${spriteKey}`)
        const background = this.add.image(0, 0, spriteKey);
        background.setOrigin(0);
        background.setScale(this.sceneWidth / background.width, this.sceneHeight / background.height);
        background.setDepth(-1);
    }

    setTransparentSpaceholder(height) {
        // Add a transparent sprite to take up space
        const transparentSprite = this.add.sprite(0, 0, null);
        transparentSprite.isVerticalSpaceholder = true;
        transparentSprite.setAlpha(0); // Set the alpha value to 0 for transparency
        transparentSprite.setSize(this.sceneWidth, height); // Adjust the size as needed
        this.panelLastOccupiedPixelOnYAxis += transparentSprite.height; //Lifting down GamePieceDetailsScene elements
    }

    isMouseClickOnSidePanelScene(pointer) {
        return pointer.x >= this.camera.x && pointer.y >= this.camera.y;
    }

    setVisible(isVisible) {
        this.sceneConfig.isVisible = isVisible;
        this.scene.setVisible(isVisible, this);
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

}

export default SidePanelScene;