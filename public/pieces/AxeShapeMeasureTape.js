import { CONSTANTS } from "../Constants.js";

//class extending Phaser Sprite
class AxeShapeMeasureTape {

    static measureRequestOn = false;
    static instances = [];

    constructor() {
        this.shape = null;
        this.startPoint = null;
        this.endPoint = null;
        this.width = null;
        this.stage = CONSTANTS.MEASURE_TAPE_CREATION_STAGES.REQUESTED;
        //AxeShapeMeasureTape.measureRequestOn = false;
        AxeShapeMeasureTape.instances = [...AxeShapeMeasureTape.instances, this];
    }


    static getLastMeasureTapeInstance() {
        if (AxeShapeMeasureTape.instances.length === 0) {
            return null;
        } else
            return AxeShapeMeasureTape.instances[AxeShapeMeasureTape.instances.length - 1];
    }

    // static setMeasureRequestOn(bool) {
    //     AxeShapeMeasureTape.measureRequestOn = bool;
    // }

    // static isMeasureRequestOn() {
    //     return AxeShapeMeasureTape.measureRequestOn;
    // }

    // static isMeasureStarted() {
    //     return AxeShapeMeasureTape.getLastMeasureTapeInstance()?.startPoint !== null;
    // }

    updateMeasureTape(scene) {
        //clear previous this.shape
        if (this.shape !== null) {
            this.shape.destroy();
        }

        var line = new Phaser.Geom.Line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        this.shape = scene.add.graphics({ lineStyle: { width: 10, color: 0x00ff00 } });
        this.shape.strokeLineShape(line);
    }

    setStage(stage) {
        this.stage = stage;
    }

    setStartPointAndStage(x, y) {
        this.stage = CONSTANTS.MEASURE_TAPE_CREATION_STAGES.STARTED;
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
}

export default AxeShapeMeasureTape;