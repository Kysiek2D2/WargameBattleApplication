import { CONSTANTS } from '../Constants.js';

class RegimentTray {

    constructor({ scene, container, x, y, width, height, color, isVisible = false, transparentParameter = 1.0 }) {
        this.scene = scene;
        this.container = container;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.rectangleShape = this.scene.add.rectangle(this.x, this.y, this.width, this.height, this.color);
        this.container.add(this.rectangleShape);

        this.isVisible = isVisible;
        this.setVisibility(this.isVisible);
        //this.rectangleShape.setAlpha(transparentParameter);

        //add small circle on the middle of the long side of rectangleShape
        //this.circle = this.scene.add.circle(this.x + this.width / 2, this.y, 5, 0x000000, 0.0);
        //this.container.add(this.circle);
        //add triangle inside the circle
        //this.triangle = this.scene.add.triangle(this.x + this.width / 2, this.y, 0, 0, 0, 6, 6, 3, this.color);
        this.triangle = this.scene.add.triangle(this.x + this.width / 2.1, this.y, 0, 0, 0, 4, 4, 2, CONSTANTS.BASIC_COLORS.SNOW_WHITE);
        this.container.add(this.triangle);
        //move triangle on the top of all container elements, not using setDepth
        this.container.bringToTop(this.triangle);
        this.container.sendToBack(this.rectangleShape);


        //this.circle2 = this.scene.add.circle(this.x - this.width / 2, this.y, 5, 0x000000, 1.0);
        //this.container.add(this.circle2);

        //add triangle2 inside circle2
        this.triangle2 = this.scene.add.triangle(this.x - this.width / 2, this.y, 6, 3, 0, 6, 0, 0, this.color);
        this.triangle2.setRotation(Math.PI);
        this.container.add(this.triangle2);

        //this.circle3 = this.scene.add.circle(this.x, this.y - this.height / 2, 5, 0x000000, 1.0);
        //this.container.add(this.circle3);

        //add triangle3 inside circle3
        //this.triangle3 = this.scene.add.triangle(this.x, this.y - this.height / 2, 0, 12, 12, 12, 6, 0, this.color);
        this.triangle3 = this.scene.add.triangle(this.x, this.y - this.height / 2, 0, 18, 18, 18, 9, 0, this.color);
        //this.triangle3.setRotation(Math.PI / 2);
        this.container.add(this.triangle3);


    }

    setVisibility(isVisible) {
        this.rectangleShape.setVisible(isVisible);
    }
}

export default RegimentTray;