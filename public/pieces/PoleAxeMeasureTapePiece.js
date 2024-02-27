import BasicMeasureTapePiece from './BasicMeasureTapePiece.js';
import { CONSTANTS } from '../Constants.js';
import PoleAxeMeasureTapeNodeComposition from '../nodes/PoleAxeMeasureTapeNodeComposition.js';
import BasicMeasureTapeNodeComposition from '../nodes/BasicMeasureTapeNodeComposition.js';

class PoleAxeMeasureTapePiece extends BasicMeasureTapePiece {

    constructor({ scene, gamePieceName, x, y, widthInDistanceUnits, heightInDistanceUnits = 1, color = CONSTANTS.BASIC_COLORS.TAPE_YELLOW, isFlipped = false }) {
        super({ scene: scene, gamePieceName: gamePieceName, x: x, y: y, widthInDistanceUnits: widthInDistanceUnits, heightInDistanceUnits: heightInDistanceUnits, color: color, isFlipped: isFlipped });
        this.isFlipped = isFlipped;
    }

    /**
    * @override
    */
    setNodes() {
        this.nodesComposition = new PoleAxeMeasureTapeNodeComposition(this.scene, this, this.height / 2, CONSTANTS.BASIC_COLORS.ACID_GREEN);
        //this.nodesComposition = new BasicMeasureTapeNodeComposition(this.scene, this, this.height / 2, CONSTANTS.BASIC_COLORS.ACID_GREEN);
    }

    /**
    * @override
    */
    addDistanceMarkers() {
        super.addDistanceMarkers();
        this.addPoleAxeShape();
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
        var measureTapeLine = this.scene.add.polygon(0, 0, points, this.color);
        this.container.add(measureTapeLine);
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.MEASURE_TAPE_PIECE_CONTAINER);
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
            triangleStartPoint.x, triangleStartPoint.y,
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