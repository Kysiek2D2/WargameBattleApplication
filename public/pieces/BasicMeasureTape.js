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

        this.startPointNode;
        this.endPointNode;

        this.container = this.scene.add.container((this.x + this.endPoint.x) / 2, (this.y + this.endPoint.y) / 2);
        this.addManipulationNodes();

        this.createLineShape();
        this.addDistanceMarkers();
        this.addContainerListeners();

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

        //this.container = this.scene.add.container((this.x + this.endPoint.x) / 2, (this.y + this.endPoint.y) / 2);

        this.createLineShape();

        this.addDistanceMarkers();

        //this.endPoint = this.configureSideMiddlePoints().rightMiddle;

        //Uncomment below if you want to see container's bounds
        this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.tapeWidth / 2, 0xff0000));
    }

    configureSideMiddlePoints() {

        var leftMiddle = { x: this.container.x - (this.distance / 2), y: this.container.y };
        var rightMiddle = { x: this.container.x + (this.distance / 2), y: this.container.y };

        // Apply container rotation angle
        var angle = this.container.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        // Rotate each side middle point around the container's center
        leftMiddle = {
            x: this.container.x + (leftMiddle.x - this.container.x) * cosAngle - (leftMiddle.y - this.container.y) * sinAngle,
            y: this.container.y + (leftMiddle.x - this.container.x) * sinAngle + (leftMiddle.y - this.container.y) * cosAngle
        };
        rightMiddle = {
            x: this.container.x + (rightMiddle.x - this.container.x) * cosAngle - (rightMiddle.y - this.container.y) * sinAngle,
            y: this.container.y + (rightMiddle.x - this.container.x) * sinAngle + (rightMiddle.y - this.container.y) * cosAngle
        };

        var sideMiddlePoints = { leftMiddle, rightMiddle };

        this.leftMiddleCircle?.destroy();
        this.rightMiddleCircle?.destroy();
        // Mark leftMiddle and rightMiddle as green circles
        this.leftMiddleCircle = this.scene.add.circle(leftMiddle.x, leftMiddle.y, 5, 0x00ff00);
        this.rightMiddleCircle = this.scene.add.circle(rightMiddle.x, rightMiddle.y, 5, 0x00ff00);

        return sideMiddlePoints;
    }

    addManipulationNodes() {
        var nodeColor = 0xff0000;//0x914148;
        var nodeWidth = this.tapeWidth / 4;
        var nodeHeight = this.tapeWidth;
        // var containerWorldPoint = this.scene.camera.getWorldPoint(this.container.x, this.container.y);

        this.startPointNode = this.scene.add.rectangle(this.container.x - (this.distance / 2), this.container.y, nodeWidth, nodeHeight, nodeColor);
        this.startPointNode.setOrigin(0.5, 0.5);
        //this.container.add(this.startPointNode);

        this.endPointNode = this.scene.add.rectangle(0 + (this.distance / 2), 0, nodeWidth, nodeHeight, nodeColor);
        this.endPointNode.setOrigin(1.0, 0.5);
        //this.container.add(this.endPointNode);

        this.startPointNode.setInteractive();
        this.scene.input.setDraggable(this.startPointNode);
        this.startPointNode.on('drag', (pointer) => {
            console.log('dragging start point node')
            var worldPoint = this.scene.camera.getWorldPoint(pointer.x, pointer.y);
            this.startPointNode.x = worldPoint.x;
            this.startPointNode.y = worldPoint.y;
            //this.setEndPoint();
            this.updateMeasureTape();
        });
    }

    updateExternalComponents() {
        var sidePoints = this.configureSideMiddlePoints();
        this.endPointNode.setPosition(sidePoints.rightMiddle?.x, sidePoints.rightMiddle?.y);
        this.startPointNode.setPosition(sidePoints.leftMiddle?.x, sidePoints.leftMiddle?.y);
        //this.startPointNode.setPosition(this.container.x - (this.distance / 2), this.container.y);
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
            this.updateExternalComponents();
        });
    }

    destroyPreviousShape() {
        this.container.removeAll(true);
    }

    createLineShape() {
        this.line = new Phaser.Geom.Line(this.startPointNode.x, this.startPointNode.y, this.endPointNode.x, this.endPointNode.y);


        this.lineAngle = Phaser.Geom.Line.Angle(this.line);
        this.distance = Phaser.Geom.Line.Length(this.line);
        this.container.setSize(this.distance, this.tapeWidth);
        this.container.setAngle(this.lineAngle * 180 / Math.PI);
        this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.tapeWidth, this.tapeColor));

        var middlePoint = Phaser.Geom.Line.GetMidPoint(this.line); // Get the middle point of the line
        this.container.x = middlePoint.x;
        this.container.y = middlePoint.y;

        // Add green circle to mark endpoint
        //this.endPointCircle?.destroy();
        //this.endPointCircle = this.scene.add.circle(this.endPointNode.x, this.endPointNode.y, this.tapeWidth / 2, 0x00FF00);
        //this.container.add(endPointCircle);

        var sidePoints = this.configureSideMiddlePoints();

        // Use the middle point as needed
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