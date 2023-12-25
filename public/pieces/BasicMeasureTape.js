import { CONSTANTS } from "../Constants.js";

//class extending Phaser Sprite
class BasicMeasureTape {

    static measureRequestOn = false;
    static instances = [];

    constructor() {
        this.shape = null;
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

    updateMeasureTape(scene) {
        //clear previous this.shape
        if (this.shape !== null) {
            this.shape.destroy();
        }

        var line = new Phaser.Geom.Line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        this.shape = scene.add.graphics({ lineStyle: { width: 10, color: 0x00ff00 } });
        this.shape.strokeLineShape(line);

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