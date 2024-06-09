import { CONSTANTS } from '../Constants.js';

class RegimentTray {

    constructor({ regiment, proportion, x, y, isVisible = false, transparentParameter = 1.0 }) {
        this.regiment = regiment;
        this.scene = regiment.scene;
        this.container = regiment.container;
        this.proportion = proportion;
        this.x = x;
        this.y = y;
        this.width = regiment.width * this.proportion;
        this.height = regiment.height * this.proportion;
        this.color = regiment.color;
        this.isVisible = isVisible;
        this.transparentParameter = transparentParameter;

        this.createTrayRectangle();

        this.createTriangleRight();

        this.createTriangleLeft();

        this.createTriangleBack();

        this.createTriangleFront();

        this.createTriangleFacing(transparentParameter);

        this.container.bringToTop(this.triangleFront);

        this.setVisibility(this.isVisible);
    }

    createTriangleFacing(transparentParameter) {
        this.triangleFacing = this.scene.add.triangle(this.x, (this.y - this.height / 2), 0, 0, 1, Math.sqrt(50), 2, 0, this.color);
        this.triangleFacing.setOrigin(0.5, 0);
        this.triangleFacing.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.triangleFacing.setRotation(Math.PI);
        this.triangleFacing.setScale(this.proportion * 2, 1);
        this.triangleFacing.setAlpha(transparentParameter);
        this.container.add(this.triangleFacing);
    }

    createTriangleFront() {
        this.triangleFront = this.scene.add.triangle(this.x, (this.y - this.height / 2) + 1 / this.proportion, 0, 2, 2, 2, 1, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangleFront.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.triangleFront.setScale(this.proportion * 2, 1);
        this.container.add(this.triangleFront);
    }

    createTriangleBack() {
        this.triangleBack = this.scene.add.triangle(this.x, (this.y + this.height / 2) - 1 / this.proportion, 0, 2, 2, 2, 1, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangleBack.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.triangleBack.setScale(this.proportion * 2, 1);
        this.triangleBack.setRotation(Math.PI);
        this.container.add(this.triangleBack);
    }

    createTriangleLeft() {
        this.triangleLeft = this.scene.add.triangle((this.x - this.width / 2) + 1 / this.proportion, this.y, 2, 1, 0, 2, 0, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangleLeft.setScale(1, this.proportion * 2);
        this.triangleLeft.setRotation(Math.PI);
        this.triangleLeft.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.triangleLeft);
    }

    createTriangleRight() {
        this.triangleRight = this.scene.add.triangle((this.x + this.width / 2) - 1 / this.proportion, this.y, 0, 0, 0, 2, 2, 1, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangleRight.setScale(1, this.proportion * 2);
        this.triangleRight.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.triangleRight);
    }

    createTrayRectangle() {
        this.trayRectangle = this.scene.add.rectangle(this.x, this.y, this.width, this.height, this.color);
        this.container.add(this.trayRectangle);
        this.trayRectangle.setAlpha(this.transparentParameter);
        this.trayRectangle.setStrokeStyle(1, CONSTANTS.BASIC_COLORS.BLACK);
    }

    setVisibility(isVisible) {
        this.trayRectangle.setVisible(isVisible);
    }
}

export default RegimentTray;