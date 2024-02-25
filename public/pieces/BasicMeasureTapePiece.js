import { CONSTANTS } from "../Constants.js";
import GamePiece from "./GamePiece.js";
import BasicMeasureTapeNodeComposition from "../nodes/BasicMeasureTapeNodeComposition.js";

class BasicMeasureTapePiece extends GamePiece {

    static distanceMarkerWidthInPixels = 2;

    constructor({ scene, gamePieceName, widthInDistanceUnits, heightInDistanceUnits = 1, x, y, color = CONSTANTS.BASIC_COLORS.TAPE_YELLOW }) {
        super({
            scene: scene,
            gamePieceName: gamePieceName,
            x: x,
            y: y,
            color: color,
            heightInDistanceUnits: heightInDistanceUnits,
            widthInDistanceUnits: widthInDistanceUnits
        });

        this.distanceMarkerColor = CONSTANTS.BASIC_COLORS.BLACK;
        this.line = null;
        this.lineAngle = null;
        this.distanceMarkerPoints = [];
        this.numDistanceMarkers = null;

        this.configureGamePiece();
    }

    configureGamePiece() {
        /**
         * After each interaction container and it's elements are rendered 
         * again from scratch (except for drag), so configureGamePiece and updateGamePiece
         * are the same.
         * This function containing function is only to be consistent with other game pieces.
         */

        //Note: corner nodes are not part of container, they are outside of it
        this.setNodes();
        this.prepareLineShapeAndProperties();
        this.reduceLineShapeToFullDistanceUnits();
        this.renderBasicMeasureTape();
    }

    setNodes() {
        this.nodesComposition = new BasicMeasureTapeNodeComposition(this.scene, this, this.height / 2, CONSTANTS.BASIC_COLORS.ACID_GREEN);
    }

    static popInstance() {
        if (BasicMeasureTapePiece.instances.length === 0) {
            return null;
        } else
            return BasicMeasureTapePiece.instances[BasicMeasureTapePiece.instances.length - 1];
    }

    dropAndCreateBasicMeasureTape() {
        this.prepareLineShapeAndProperties();
        this.renderBasicMeasureTape();
    }

    renderBasicMeasureTape() {
        this.container.removeAll(true);
        this.updateContainer();
        this.addContainerListeners();
        this.nodesComposition.updateNodesPosition();
        this.addDistanceMarkers();
        this.setActivateListener();
        this.showContainerHelpBounds(false); //change to true to show container bounds, should be called after all other elements render
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
            this.nodesComposition.updateNodesPosition();
        });
    }

    updateContainer() {
        var x = this.container.x;
        var y = this.container.y;
        this.container.removeAll(true);
        this.container.destroy();
        this.container = null;
        this.container = this.scene.add.container(x, y);
        this.container.setSize(this.width, this.height);
        this.container.setAngle(this.lineAngle * 180 / Math.PI);
        this.addTapeRectangle();
    }

    addTapeRectangle() {
        // Define the points for the trapezoid
        var points = [
            { x: 0, y: 0 },
            { x: this.width, y: 0 },
            { x: this.width, y: this.height }, //bottom right
            { x: this.height, y: this.height } //bottom left
        ];

        // Create a polygon with the defined points
        var measureTapeLine = this.scene.add.polygon(0, 0, points, this.color);
        this.container.add(measureTapeLine);
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.MEASURE_TAPE_PIECE_CONTAINER);
    }

    prepareLineShapeAndProperties() {
        if (this.nodesComposition.getNodes().length != 2) {
            throw new Error('BasicMeasureTapePiece must have exactly 2 nodes');
        }

        var startNode = this.nodesComposition.getNodes()[0];
        var endNode = this.nodesComposition.getNodes()[1];

        this.line = new Phaser.Geom.Line(startNode.x, startNode.y, endNode.x, endNode.y);
        this.lineAngle = Phaser.Geom.Line.Angle(this.line);
        this.width = Phaser.Geom.Line.Length(this.line); //Note: set to constant value if you want to rotate tape but retain it's length
        var middlePoint = Phaser.Geom.Line.GetMidPoint(this.line);
        this.container.x = middlePoint.x;
        this.container.y = middlePoint.y;
    }

    reduceLineShapeToFullDistanceUnits() {
        if (this.nodesComposition.getNodes().length != 2) {
            throw new Error('BasicMeasureTapePiece must have exactly 2 nodes');
        }

        var initialLineDistanceUnits = this.width / this.scene.sceneDistanceUnitPixels;
        var lineFullDistanceUnits = Math.round(initialLineDistanceUnits);
        var multiplierToShowDistanceMarkersAtTheEnd = 1.0;
        if (lineFullDistanceUnits - initialLineDistanceUnits > 0) {
            multiplierToShowDistanceMarkersAtTheEnd = 1.1;
        } else {
            multiplierToShowDistanceMarkersAtTheEnd = 0.9;
        }

        var reduceLineByPixels = (this.width - lineFullDistanceUnits * this.scene.sceneDistanceUnitPixels) * multiplierToShowDistanceMarkersAtTheEnd;

        this.line = Phaser.Geom.Line.Extend(this.line, 0, -reduceLineByPixels);
        this.width = Phaser.Geom.Line.Length(this.line); //Note: set to constant value if you want to rotate tape but retain it's length
        var middlePoint = Phaser.Geom.Line.GetMidPoint(this.line);
        this.container.x = middlePoint.x;
        this.container.y = middlePoint.y;
    }


    addDistanceMarkers() {
        this.numDistanceMarkers = Math.ceil(this.width / this.scene.sceneDistanceUnitPixels);

        for (var i = 1; i < this.numDistanceMarkers; i++) {
            var point = { x: (i * this.scene.sceneDistanceUnitPixels) - this.width / 2, y: 0 }; //crazy coordinates becasuse it's part of container. And all childs of container is centered in the container...

            var distanceMarker = this.scene.add.rectangle(point.x, point.y, BasicMeasureTapePiece.distanceMarkerWidthInPixels, this.height, this.distanceMarkerColor);
            distanceMarker.setOrigin(0.5);

            var circleAndTextPoint = { x: point.x - (this.scene.sceneDistanceUnitPixels / 4), y: point.y };
            var distanceText = this.scene.add.text(circleAndTextPoint.x, circleAndTextPoint.y, (i).toString(), { fontSize: '6px', resolution: 10, fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' });
            distanceText.setOrigin(0.5, 0.5);
            distanceText.setAngle(90);

            this.container.add(distanceMarker);
            this.container.add(distanceText);
            this.distanceMarkerPoints = [...this.distanceMarkerPoints, { distanceMarker: distanceMarker, distanceText: distanceText }]; // Updated code to include the circle
        }

        this.addCiupaga(true);
    }

    addCiupaga(show = true) {
        if (!show) {
            return;
        }

        var lastDistanceMarkerPoint = this.distanceMarkerPoints[this.distanceMarkerPoints.length - 1];
        var triangleStartPoint = { x: lastDistanceMarkerPoint.distanceMarker.x, y: lastDistanceMarkerPoint.distanceMarker.y - this.height / 2 };

        var triangle = this.scene.add.triangle(
            triangleStartPoint.x, triangleStartPoint.y,
            0, 0,
            0, -this.height,
            this.height, 0,
            this.color
        );
        triangle.setOrigin(1, 0);
        this.container.add(triangle);
    }
}

export default BasicMeasureTapePiece;