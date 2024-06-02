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
        this.rectangleShape.setAlpha(transparentParameter);
    }

    setVisibility(isVisible) {
        this.rectangleShape.setVisible(isVisible);
    }
}

export default RegimentTray;