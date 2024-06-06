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

        this.trayRectangle = this.scene.add.rectangle(this.x, this.y, this.width, this.height, this.color);
        this.container.add(this.trayRectangle);

        this.isVisible = isVisible;
        this.setVisibility(this.isVisible);
        this.trayRectangle.setAlpha(transparentParameter);

        //add small circle on the middle of the long side of rectangleShape
        //this.circle = this.scene.add.circle(this.x + this.width / 2, this.y, 5, 0x000000, 0.0);
        //this.container.add(this.circle);
        //add triangle inside the circle
        //this.triangle = this.scene.add.triangle(this.x + this.width / 2, this.y, 0, 0, 0, 6, 6, 3, this.color);
        this.triangle = this.scene.add.triangle((this.x + this.width / 2) - 1 / this.proportion, this.y, 0, 0, 0, 2, 2, 1, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle.setScale(1, this.proportion * 2);
        this.container.add(this.triangle);
        //move triangle on the top of all container elements, not using setDepth
        //this.container.bringToTop(this.triangle);
        this.container.sendToBack(this.trayRectangle);


        //this.circle2 = this.scene.add.circle(this.x - this.width / 2, this.y, 5, 0x000000, 1.0);
        //this.container.add(this.circle2);

        //add triangle2 inside circle2
        this.triangle2 = this.scene.add.triangle((this.x - this.width / 2) + 1 / this.proportion, this.y, 2, 1, 0, 2, 0, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle2.setRotation(Math.PI);
        this.triangle2.setScale(1, this.proportion * 2);
        this.container.add(this.triangle2);

        //this.circle3 = this.scene.add.circle(this.x, this.y - this.height / 2, 5, 0x000000, 1.0);
        //this.container.add(this.circle3);

        //add triangle3 inside circle3
        //this.triangle3 = this.scene.add.triangle(this.x, this.y - this.height / 2, 0, 12, 12, 12, 6, 0, this.color);
        this.triangle3 = this.scene.add.triangle(this.x, (this.y - this.height / 2) + 1 / this.proportion, 0, 2, 2, 2, 1, 0, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.triangle3.setScale(this.proportion * 10, 1);
        //this.triangle3.setRotation(Math.PI / 2);
        this.container.add(this.triangle3);
        //this.container.bringToTop(this.triangle3);


    }

    setVisibility(isVisible) {
        this.trayRectangle.setVisible(isVisible);
    }
}

export default RegimentTray;