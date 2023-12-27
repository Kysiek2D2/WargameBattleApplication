import { CONSTANTS } from "../Constants.js";
class BasicMeasureTape {

    static measureRequestOn = false;
    static instances = [];

    constructor(scene, tapeWidth = scene.sceneDistanceUnitPixels) {
        this.scene = scene;
        this.tapeWidth = tapeWidth;
        this.tapeColor = 0xfcf403;
        this.distanceMarkerColor = 0x000000;
        this.distanceUnitPixels = scene.sceneDistanceUnitPixels;

        this.startPoint = null;
        this.endPoint = null;
        this.line = null;
        this.lineShape = null;
        this.lineAngle = null;

        this.distanceMarkerPoints = [];
        this.distanceMarkerWidth = 2;
        this.distance = null;
        this.numDistanceMarkers = null;

        this.isCompleted = false;
        BasicMeasureTape.instances = [...BasicMeasureTape.instances, this];
    }

    static popInstance() {
        if (BasicMeasureTape.instances.length === 0) {
            return null;
        } else
            return BasicMeasureTape.instances[BasicMeasureTape.instances.length - 1];
    }

    updateMeasureTape() {
        this.destroyPreviousShape();
        this.createLineShape();
        this.addDistanceMarkers();
    }

    destroyPreviousShape() {
        if (this.lineShape !== null) {
            this.lineShape.destroy();
            this.distanceMarkerPoints.forEach((point) => {
                point.distanceMarker.destroy();
                point.distanceText.destroy();
                point.distanceCircle.destroy();
            });
        }
    }

    createLineShape() {
        this.line = new Phaser.Geom.Line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        this.lineAngle = Phaser.Geom.Line.Angle(this.line);
        this.lineShape = this.scene.add.graphics({ lineStyle: { width: this.tapeWidth, color: this.tapeColor } });
        this.lineShape.strokeLineShape(this.line);
        this.distance = Phaser.Geom.Line.Length(this.line);
        this.numDistanceMarkers = Math.floor(this.distance / this.distanceUnitPixels);
    }

    addDistanceMarkers() {
        for (var i = 1; i < this.numDistanceMarkers; i++) {
            var point = Phaser.Geom.Line.GetPoint(this.line, i * this.distanceUnitPixels / this.distance);
            var distanceMarker = this.scene.add.rectangle(point.x, point.y, this.distanceMarkerWidth, this.tapeWidth, this.distanceMarkerColor);
            distanceMarker.setOrigin(0.5);
            distanceMarker.setAngle(this.lineAngle * 180 / Math.PI);
            var circle = this.scene.add.circle(point.x, point.y, this.tapeWidth / 3, this.tapeColor); // Added code to draw the circle
            var distanceText = this.scene.add.text(point.x, point.y, (i).toString(), { fontSize: '6px', resolution: 10, fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' });
            distanceText.setOrigin(0.5, 0.5);
            distanceText.setAngle((this.lineAngle * 180 / Math.PI) + 90);
            this.distanceMarkerPoints = [...this.distanceMarkerPoints, { distanceMarker: distanceMarker, distanceCircle: circle, distanceText: distanceText }]; // Updated code to include the circle
        }
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

    setStartPoint(x, y) {
        var worldPoint = this.scene.camera.getWorldPoint(x, y);
        this.startPoint = { x: worldPoint.x, y: worldPoint.y };
    }

    getStartPoint() {
        return this.startPoint;
    }

    setEndPoint(x, y) {
        var worldPoint = this.scene.camera.getWorldPoint(x, y);
        this.endPoint = { x: worldPoint.x, y: worldPoint.y };
    }

    getEndPoint() {
        return this.endPoint;
    }
}

export default BasicMeasureTape;