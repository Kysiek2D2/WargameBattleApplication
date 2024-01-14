import { CONSTANTS } from "../Constants.js";
import GamePiece from "./GamePiece.js";

class BasicMeasureTape extends GamePiece {

    static distanceMarkerWidthInPixels = 2;
    static instances = [];

    constructor({ scene, gamePieceName, widthInDistanceUnits = 1, heightInDistanceUnits, x, y, color }) {
        super({ scene: scene, gamePieceName: gamePieceName, x, y, color });

        this.width = widthInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.container = this.scene.add.container(x, y);
        this.color = 0xfcf403;

        this.distanceMarkerColor = 0x000000;
        this.distance = heightInDistanceUnits * this.scene.sceneDistanceUnitPixels;
        this.lineAngle = null;
        this.distanceMarkerPoints = [];
        this.numDistanceMarkers = null;
        this.sideNodes = { startNode: null, endNode: null };
        this.setSideNodes();
        this.updateMeasureTape();
        BasicMeasureTape.instances = [...BasicMeasureTape.instances, this];
    }

    showContainerBounds(show = false) {
        if (!show) return;
        //Shows only half of the container's bounds, to show full bounds remove the division by 2
        this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.width / 2, 0xff0000));
    }

    static popInstance() {
        if (BasicMeasureTape.instances.length === 0) {
            return null;
        } else
            return BasicMeasureTape.instances[BasicMeasureTape.instances.length - 1];
    }

    updateMeasureTape() {
        this.container.removeAll(true);
        this.createLineShape();
        this.updateContainer();
        this.addContainerListeners();
        this.updateSideNodes();
        this.addDistanceMarkers();
        this.showContainerBounds(false); //change to true to show container bounds
    }

    updateSideNodes() {
        var middlePoints = this.getSideMiddlePointsPostions();
        this.sideNodes.startNode.setPosition(middlePoints.startMiddlePointRotated.x, middlePoints.startMiddlePointRotated.y);
        this.sideNodes.endNode.setPosition(middlePoints.startEndPointRotated.x, middlePoints.startEndPointRotated.y);
    }

    getSideMiddlePointsPostions() {
        var startMiddlePoint = { x: this.container.x - (this.distance / 2), y: this.container.y };
        var endMiddlePoint = { x: this.container.x + (this.distance / 2), y: this.container.y };

        var angle = this.container.rotation;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        var startMiddlePointRotated = {
            x: this.container.x + (startMiddlePoint.x - this.container.x) * cosAngle - (startMiddlePoint.y - this.container.y) * sinAngle,
            y: this.container.y + (startMiddlePoint.x - this.container.x) * sinAngle + (startMiddlePoint.y - this.container.y) * cosAngle
        };
        var startEndPointRotated = {
            x: this.container.x + (endMiddlePoint.x - this.container.x) * cosAngle - (endMiddlePoint.y - this.container.y) * sinAngle,
            y: this.container.y + (endMiddlePoint.x - this.container.x) * sinAngle + (endMiddlePoint.y - this.container.y) * cosAngle
        };

        var sideMiddlePoints = { startMiddlePointRotated: startMiddlePointRotated, startEndPointRotated: startEndPointRotated };
        return sideMiddlePoints;
    }

    setSideNodes() {
        var middlePoints = this.getSideMiddlePointsPostions();
        this.sideNodes = {
            startNode: this.createSingleSideNode(middlePoints.startMiddlePointRotated.x, middlePoints.startMiddlePointRotated.y),
            endNode: this.createSingleSideNode(middlePoints.startEndPointRotated.x, middlePoints.startEndPointRotated.y),
        };
    }

    createSingleSideNode(x, y) {
        var sideNodeColor = CONSTANTS.BASIC_COLOR_CODES.BURGUNDY;
        var node = this.scene.add.circle(x, y, 5, sideNodeColor);
        node.setInteractive();
        this.scene.input.setDraggable(node);
        node.on('drag', (pointer) => {
            console.log('dragging left middle point node')
            var worldPoint = this.scene.camera.getWorldPoint(pointer.x, pointer.y);
            node.x = worldPoint.x;
            node.y = worldPoint.y;
            this.updateMeasureTape();
        });
        return node;
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
            this.updateSideNodes();
        });
    }

    updateContainer() {
        var x = this.container.x;
        var y = this.container.y;
        this.container.removeAll(true);
        this.container.destroy();
        this.container = null;
        this.container = this.scene.add.container(x, y);
        this.container.setSize(this.distance, this.width);
        this.container.setAngle(this.lineAngle * 180 / Math.PI);
        this.container.add(this.scene.add.rectangle(0, 0, this.distance, this.width, this.color));
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.MEASURE_TAPE_PIECE);
    }

    createLineShape() {
        var line = new Phaser.Geom.Line(this.sideNodes.startNode.x, this.sideNodes.startNode.y, this.sideNodes.endNode.x, this.sideNodes.endNode.y);
        this.lineAngle = Phaser.Geom.Line.Angle(line);
        this.distance = Phaser.Geom.Line.Length(line);
        var middlePoint = Phaser.Geom.Line.GetMidPoint(line);
        this.container.x = middlePoint.x;
        this.container.y = middlePoint.y;
    }

    addDistanceMarkers() {
        this.numDistanceMarkers = Math.floor(this.distance / this.scene.sceneDistanceUnitPixels);

        for (var i = 1; i < this.numDistanceMarkers; i++) {
            var point = { x: (i * this.scene.sceneDistanceUnitPixels) - this.distance / 2, y: 0 }; //crazy coordinates becasuse it's part of container. And all childs of container is centered in the container...

            var distanceMarker = this.scene.add.rectangle(point.x, point.y, BasicMeasureTape.distanceMarkerWidthInPixels, this.width, this.distanceMarkerColor);
            distanceMarker.setOrigin(0.5);
            var circle = this.scene.add.circle(point.x, point.y, this.width / 3, this.color);
            var distanceText = this.scene.add.text(point.x, point.y, (i).toString(), { fontSize: '6px', resolution: 10, fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' });
            distanceText.setOrigin(0.5, 0.5);
            distanceText.setAngle((this.lineAngle * 180 / Math.PI) + 90);
            this.container.add(distanceMarker);
            this.container.add(circle);
            this.container.add(distanceText);
            this.distanceMarkerPoints = [...this.distanceMarkerPoints, { distanceMarker: distanceMarker, distanceCircle: circle, distanceText: distanceText }]; // Updated code to include the circle
        }
    }
}

export default BasicMeasureTape;