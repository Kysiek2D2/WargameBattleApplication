import { CONSTANTS } from "../Constants.js";

//class extending Phaser Sprite
class BasicMeasureTape {

    static measureRequestOn = false;
    static instances = [];

    constructor() {
        this.shape = null;
        this.shapeDistancePoints = [];
        this.startPoint = null;
        this.endPoint = null;
        this.width = null;
        this.isCompleted = false;
        BasicMeasureTape.instances = [...BasicMeasureTape.instances, this];
    }

    static popInstance() {
        if (BasicMeasureTape.instances.length === 0) {
            return null;
        } else
            return BasicMeasureTape.instances[BasicMeasureTape.instances.length - 1];
    }

    updateMeasureTape(scene, tapeWidth) {
        //clear previous this.shape
        var distanceUnitPixels = scene.sceneDistanceUnitPixels;
        if (this.shape !== null) {
            this.shape.destroy();
            //destroy all rectangles and texts from this.shapeDistancePoints
            this.shapeDistancePoints.forEach((point) => {
                point.rectangle.destroy();
                point.text.destroy();
                point.circle.destroy(); // Added code to destroy the circle
            });
        }

        var lineColor = 0xfcf403;

        var line = new Phaser.Geom.Line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        this.shape = scene.add.graphics({ lineStyle: { width: tapeWidth, color: lineColor } });
        this.shape.strokeLineShape(line);
        //get this.shape rotation
        var lineAngle = Phaser.Geom.Line.Angle(line);

        // Add rectangles along the line every 60 pixels
        var distance = Phaser.Geom.Line.Length(line);
        var numRectangles = Math.floor(distance / distanceUnitPixels);
        var rectangleColor = 0x000000;

        var rectangleWidth = 2;

        var rectangleHeight = tapeWidth;

        for (var i = 1; i < numRectangles; i++) {
            var point = Phaser.Geom.Line.GetPoint(line, i * distanceUnitPixels / distance);
            var rectangle = scene.add.rectangle(point.x, point.y, rectangleWidth, rectangleHeight, rectangleColor);
            rectangle.setOrigin(0.5);
            rectangle.setAngle(lineAngle * 180 / Math.PI);
            var circle = null;
            var text = null;


            var circle = scene.add.circle(point.x, point.y, tapeWidth / 4, lineColor); // Added code to draw the circle
            //rotate rectangle to be perpendicular to the line
            var text = scene.add.text(point.x, point.y, (i).toString(), { fontSize: '8px', resolution: 6, fill: '#000000' });
            text.setOrigin(0.5, 0.5);
            text.setAngle((lineAngle * 180 / Math.PI) + 90);
            this.shapeDistancePoints = [...this.shapeDistancePoints, { rectangle, circle, text }]; // Updated code to include the circle
            //this.shapeDistancePoints = [...this.shapeDistancePoints, { rectangle, text }]; // Updated code to include the circle

        }

        this.shape.setInteractive();
        this.shape.on('pointerdown', () => {
            setMeasureModeOff();
        });
    }


    setStartPoint(x, y) {
        this.startPoint = { x: x, y: y };;
    }

    getStartPoint() {
        return this.startPoint;
    }

    setEndPoint(x, y) {
        this.endPoint = { x: x, y: y };
    }

    getEndPoint() {
        return this.endPoint;
    }

    static isMeasurePending() {
        var lastInstance = BasicMeasureTape.popInstance();
        if (lastInstance === null) return false;
        return lastInstance.getStartPoint() === null && lastInstance.getEndPoint() === null;
    }

    static isMeasureCompleted() {
        var lastInstance = BasicMeasureTape.popInstance();
        if (lastInstance === null) return true;
        return lastInstance.getStartPoint() !== null
            && lastInstance.getEndPoint() !== null
            && lastInstance.isCompleted;
    }
}

export default BasicMeasureTape;