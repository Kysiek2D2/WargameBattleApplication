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

        this.trayRectangle = this.scene.add.rectangle(this.x, this.y, this.width, this.height, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.trayRectangle);
        this.trayRectangle.setAlpha(transparentParameter);
        this.trayRectangle.setStrokeStyle(1, CONSTANTS.BASIC_COLORS.BLACK);

        this.triangle = this.scene.add.triangle((this.x + this.width / 2) - 1 / this.proportion, this.y, 0, 0, 0, 2, 2, 1, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle.setScale(1, this.proportion * 2);
        this.triangle.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.triangle);

        this.triangle2 = this.scene.add.triangle((this.x - this.width / 2) + 1 / this.proportion, this.y, 2, 1, 0, 2, 0, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle2.setScale(1, this.proportion * 2);
        this.triangle2.setRotation(Math.PI);
        this.triangle2.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.triangle2);

        this.triangle4 = this.scene.add.triangle(this.x, (this.y + this.height / 2) - 1 / this.proportion, 0, 2, 2, 2, 1, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle4.setScale(this.proportion * 2, 1);
        this.triangle4.setRotation(Math.PI);
        this.triangle4.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.triangle4);

        this.triangle3 = this.scene.add.triangle(this.x, (this.y - this.height / 2) + 1 / this.proportion, 0, 2, 2, 2, 1, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle3.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.triangle3.setScale(this.proportion * 2, 1);
        this.triangle3.setStrokeStyle(0.35, CONSTANTS.BASIC_COLORS.BLACK);
        this.container.add(this.triangle3);

        this.frontLine = this.scene.add.rectangle(this.x, ((this.y - this.height / 2) + 1 / this.proportion), 2, this.width, this.color);
        this.frontLine.setRotation(Math.PI / 2);
        this.container.add(this.frontLine);

        this.container.bringToTop(this.triangle3);
        this.container.sendToBack(this.trayRectangle);

        this.setVisibility(this.isVisible);
    }

    setVisibility(isVisible) {
        this.trayRectangle.setVisible(isVisible);
    }
}

export default RegimentTray;