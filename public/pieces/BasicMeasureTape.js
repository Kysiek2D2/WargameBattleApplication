import { CONSTANTS } from "../Constants.js";
import GamePiece from "./GamePiece.js";

class BasicMeasureTape extends GamePiece {

    static measureRequestOn = false;
    static instances = [];
    static initialDistanceInDistanceUnits = 12;

    constructor({ scene, gamePieceName, tapeWidth = scene.sceneDistanceUnitPixels, x, y }) {
        super({ scene: scene, gamePieceName: gamePieceName });
        this.x = x;
        this.y = y;
        //this.scene = scene;
        this.tapeWidth = tapeWidth;
        this.tapeColor = 0xfcf403;
        this.distanceMarkerColor = 0x000000;
        this.distanceUnitPixels = scene.sceneDistanceUnitPixels;

        //this.startPoint = null;
        this.distance = BasicMeasureTape.initialDistanceInDistanceUnits * scene.sceneDistanceUnitPixels;
        this.endPoint = { x: this.x + this.distance, y: this.y };
        this.line = null;
        this.lineShape = null; //needed???
        this.lineAngle = null;

        this.distanceMarkerPoints = [];
        this.distanceMarkerWidth = 2;
        this.numDistanceMarkers = null;
        this.container = null; //++

        this.container = this.scene.add.container((this.x + this.endPoint.x) / 2, (this.y + this.endPoint.y) / 2);
        this.createLineShape();
        this.addDistanceMarkers();
        this.addContainerListeners();
        this.addManipulationNodes();
        //Uncomment to show container's bounds as red rectangle
        // this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.tapeWidth / 2, 0xff0000));

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

        this.container = this.scene.add.container((this.x + this.endPoint.x) / 2, (this.y + this.endPoint.y) / 2);

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

    addManipulationNodes() {
        var nodeColor = 0x914148;
        var nodeWidth = this.tapeWidth / 4;
        var nodeHeight = this.tapeWidth;
        //var startRectangle = this.scene.add.rectangle(0 - this.distance / 2, 0, this.tapeWidth / 4, this.tapeWidth / 3, nodeColor);
        var startPointNode = this.scene.add.rectangle(0 - (this.distance / 2), 0, nodeWidth, nodeHeight, nodeColor);
        startPointNode.setOrigin(0.0, 0.5);
        this.container.add(startPointNode);

        var endPointNode = this.scene.add.rectangle(0 + (this.distance / 2), 0, nodeWidth, nodeHeight, nodeColor);
        endPointNode.setOrigin(1.0, 0.5);
        this.container.add(endPointNode);

        startPointNode.setInteractive();
        this.scene.input.setDraggable(startPointNode);
        startPointNode.on('drag', (pointer, dragX, dragY) => {
            console.log('dragging start point node')
            var worldPoint = this.scene.camera.getWorldPoint(dragX, dragY);
            this.x = worldPoint.x;
            this.y = worldPoint.y;
            //this.updateMeasureTape();
        });
    }

    addContainerListeners() {
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
        this.container.on('drag', (pointer, dragX, dragY) => {
            console.log('dragging container')
            const dx = dragX - this.container.x;
            const dy = dragY - this.container.y;
            this.container.x += dx;
            this.container.y += dy;
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

        this.line = new Phaser.Geom.Line(this.x, this.y, this.endPoint.x, this.endPoint.y);
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

    // static isMeasurePending() {
    //     var lastInstance = BasicMeasureTape.popInstance();
    //     if (lastInstance === null) return false;
    //     return lastInstance.getStartPoint() === null && lastInstance.getEndPoint() === null;
    // }

    // static isMeasureCompleted() {
    //     var lastInstance = BasicMeasureTape.popInstance();
    //     if (lastInstance === null) return true;
    //     return lastInstance.getStartPoint() !== null
    //         && lastInstance.getEndPoint() !== null
    //         && lastInstance.isCompleted;
    // }

    setStartPoint(x, y) {
        var worldPoint = this.scene.camera.getWorldPoint(x, y);
        this.x = worldPoint.x;
        this.y = worldPoint.y;
    }

    // getStartPoint() {
    //     return this.startPoint;
    // }

    setEndPoint(x, y) {
        var worldPoint = this.scene.camera.getWorldPoint(x, y);
        this.endPoint = { x: worldPoint.x, y: worldPoint.y };
    }

    getEndPoint() {
        return this.endPoint;
    }
}

export default BasicMeasureTape;