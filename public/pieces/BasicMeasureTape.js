import { CONSTANTS } from "../Constants.js";
import GamePiece from "./GamePiece.js";

class BasicMeasureTape extends GamePiece {

    static measureRequestOn = false;
    static instances = [];

    constructor(scene, gamePieceName = "Game Piece Unnamed", tapeWidth = scene.sceneDistanceUnitPixels) {
        super(scene, gamePieceName);
        this.tapeWidth = tapeWidth;
        this.tapeColor = 0xfcf403;
        this.distanceMarkerColor = 0x000000;
        this.distanceUnitPixels = scene.sceneDistanceUnitPixels;

        this.startPoint = null;
        this.endPoint = null;
        this.line = null;
        this.lineShape = null; //needed???
        this.lineAngle = null;

        this.distanceMarkerPoints = [];
        this.distanceMarkerWidth = 2;
        this.distance = null;
        this.numDistanceMarkers = null;
        this.container = null; //++

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

        this.container = this.scene.add.container((this.startPoint.x + this.endPoint.x) / 2, (this.startPoint.y + this.endPoint.y) / 2);

        this.createLineShape();

        this.addDistanceMarkers();

        //create small red rectangle with rounded corners at start point and another at end point
        var rectangleColor = 0x914148;
        var startRectangle = this.scene.add.rectangle(0 - this.distance / 2, 0, this.tapeWidth / 4, this.tapeWidth / 3, rectangleColor);
        //var endRectangle = this.scene.add.rectangle(this.endPoint.x, this.endPoint.y, this.tapeWidth, this.tapeWidth, 1, rectangleColor);
        this.container.add(startRectangle);
        //this.container.add(endRectangle);


        this.addContainerListeners();
        //Uncomment below if you want to see container's bounds
        //this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.tapeWidth / 2, 0xff0000));
    }

    addContainerListeners() {
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
        this.container.on('drag', (pointer, dragX, dragY) => {
            if (this.isCompleted === false) return;
            console.log('dragging container')
            const dx = dragX - this.container.x;
            const dy = dragY - this.container.y;
            this.container.x += dx;
            this.container.y += dy;
        });
        this.container.on('pointerdown', (pointer) => {
            this.isCompleted = true;
        });
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
        this.container?.destroy();
    }

    createLineShape() {
        this.line = new Phaser.Geom.Line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        this.lineAngle = Phaser.Geom.Line.Angle(this.line);
        //this.lineShape = this.scene.add.rectangle(0 - this.distance / 2, 0, this.distance, this.tapeWidth, this.tapeColor); //crazy coordinates becasuse it's part of container. And all childs of container is centered in the container...
        //this.lineShape.setOrigin(0, 0.5);
        //this.lineShape.setAngle(this.lineAngle * 180 / Math.PI);
        this.distance = Phaser.Geom.Line.Length(this.line);

        //this.container.add(this.lineShape);
        this.container.setSize(this.distance, this.tapeWidth);
        this.container.setAngle(this.lineAngle * 180 / Math.PI);
        this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.tapeWidth, this.tapeColor));

    }

    addDistanceMarkers() {
        this.numDistanceMarkers = Math.floor(this.distance / this.distanceUnitPixels);

        for (var i = 1; i < this.numDistanceMarkers; i++) {
            var point = { x: (i * this.distanceUnitPixels) - this.distance / 2, y: 0 }; //crazy coordinates becasuse it's part of container. And all childs of container is centered in the container...

            var distanceMarker = this.scene.add.rectangle(point.x, point.y, this.distanceMarkerWidth, this.tapeWidth, this.distanceMarkerColor);
            distanceMarker.setOrigin(0.5);
            var circle = this.scene.add.circle(point.x, point.y, this.tapeWidth / 3, this.tapeColor);
            var distanceText = this.scene.add.text(point.x, point.y, (i).toString(), { fontSize: '6px', resolution: 10, fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' });
            distanceText.setOrigin(0.5, 0.5);
            distanceText.setAngle((this.lineAngle * 180 / Math.PI) + 90);
            this.container.add(distanceMarker);
            this.container.add(circle);
            this.container.add(distanceText);
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