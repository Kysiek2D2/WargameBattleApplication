import BasicMeasureTapePiece from './BasicMeasureTapePiece.js';
import { CONSTANTS } from '../Constants.js';
import BasicMeasureTapeNodeComposition from '../nodes/BasicMeasureTapeNodeComposition.js';

class PoleAxeMeasureTapePiece extends BasicMeasureTapePiece {

    constructor({ scene, gamePieceName, x, y, widthInDistanceUnits, heightInDistanceUnits = 1, color = CONSTANTS.BASIC_COLORS.TAPE_YELLOW, isFlipped = false }) {
        super({ scene: scene, gamePieceName: gamePieceName, x: x, y: y, widthInDistanceUnits: widthInDistanceUnits, heightInDistanceUnits: heightInDistanceUnits, color: color, isFlipped: isFlipped });
        this.isFlipped = isFlipped;
        this.renderMeasureTape(); //second call after parent class in order to flip is needed on creation
    }

    /**
     * @override
     */
    renderMeasureTape() {
        super.renderMeasureTape();
        this.addPoleAxeShape();
    }

    /**
    * @override
    */
    setNodes() {
        this.nodesComposition = new BasicMeasureTapeNodeComposition(this.scene, this, this.height / 2, null, 'turnArrowNode');
    }

    /**
    * @override
    */
    addTapeShape() {

        var points;
        if (this.isFlipped) {
            points = [
                { x: 0, y: 0 }, //top left
                { x: this.width, y: 0 }, //top right
                { x: this.width, y: this.height }, //bottom right
                { x: this.height, y: this.height } //bottom left
            ];
        } else {
            points = [
                { x: this.height, y: 0 }, //top left
                { x: this.width, y: 0 }, //top right
                { x: this.width, y: this.height }, //bottom right
                { x: 0, y: this.height } //bottom left
            ];
        }

        // Create a polygon with the defined points
        this.measureTapeLine = this.scene.add.polygon(0, (this.isFlipped ? 1 : -1) * this.container.height / 2, points, this.color);
        this.container.add(this.measureTapeLine);
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.MEASURE_TAPE_PIECE_CONTAINER);
    }

    /**
    * @override
    */
    addDistanceMarkers() {
        this.numDistanceMarkers = Math.ceil(this.width / this.scene.sceneDistanceUnitPixels);

        for (var i = 1; i < this.numDistanceMarkers; i++) {
            var point = { x: (i * this.scene.sceneDistanceUnitPixels) - this.width / 2, y: (this.isFlipped ? 1 : -1) * this.container.height / 2 }; //crazy coordinates becasuse it's part of container. And all childs of container is centered in the container...

            var distanceMarker = this.scene.add.rectangle(point.x, point.y, BasicMeasureTapePiece.distanceMarkerWidthInPixels, this.height, this.distanceMarkerColor);
            distanceMarker.setOrigin(0.5);

            var circleAndTextPoint = { x: point.x - (this.scene.sceneDistanceUnitPixels / 4), y: point.y };
            var distanceText = this.scene.add.text(circleAndTextPoint.x, circleAndTextPoint.y, (i).toString(), { fontSize: '9px', resolution: 20, fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' });
            distanceText.setOrigin(0.5, 0.5);
            distanceText.setAngle(90);

            this.container.add(distanceMarker);
            this.container.add(distanceText);
            this.distanceMarkerPoints = [...this.distanceMarkerPoints, { distanceMarker: distanceMarker, distanceText: distanceText }]; // Updated code to include the circle
        }
    }

    addPoleAxeShape() {

        var sign;
        if (this.isFlipped) {
            sign = 1;
        } else {
            sign = -1;
        }

        var lastDistanceMarkerPoint = this.distanceMarkerPoints[this.distanceMarkerPoints.length - 1];
        var triangleStartPoint = { x: lastDistanceMarkerPoint.distanceMarker.x, y: sign * this.height / 2 };

        this.triangle = this.scene.add.triangle(
            triangleStartPoint.x, triangleStartPoint.y + (this.isFlipped ? 1 : -1) * this.container.height / 2,
            0, 0,
            0, sign * this.height,
            this.height, 0,
            this.color
        );

        this.triangle.setOrigin(1, 0);
        this.container.add(this.triangle);
    }
}

export default PoleAxeMeasureTapePiece;