import { CONSTANTS } from "../Constants.js";
import RegimentTray from "../extras/RegimentTray.js";
import RegimentNodeComposition from "../nodes/RegimentNodeComposition.js";
import GamePiece from "./GamePiece.js";

class RegimentPiece extends GamePiece {
    // Entity-Component-System (ECS) programming design pattern

    constructor({ scene, gamePieceName = 'Game Piece Unnamed', x, y, rotationAngle, widthInDistanceUnits, heightInDistanceUnits, spriteKey, gamePieceStrength = 15, color = null, isTrayVisible = false }) {
        super({
            scene: scene,
            gamePieceName: gamePieceName,
            x: x,
            y: y,
            rotationAngle: rotationAngle,
            color: color,
            heightInDistanceUnits: heightInDistanceUnits,
            widthInDistanceUnits: widthInDistanceUnits
        });
        this.spriteKey = spriteKey;
        this.gamePieceStrength = gamePieceStrength;
        this.hitArea = null;

        this.tray = null;
        this.isTrayVisible = isTrayVisible;

        this.configureGamePiece();
    }

    /**
    * @override
    */
    configureGamePiece() {
        this.setNodes();
        this.container.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.REGIMENT_PIECE_CONTAINER);
        this.container.setSize(this.width, this.height);
        this.setOnDragListener();


        this.sprite = this.scene.add.image(0, this.container.height / 2, this.spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.width, this.height);
        this.container.add(this.sprite);
        this.tray = new RegimentTray({
            scene: this.scene,
            container: this.container,
            x: 0,
            y: this.container.height / 2,
            width: this.width * 1.1,
            height: this.height * 1.1,
            color: this.color,
            isVisible: this.isTrayVisible,
            transparentParameter: 0.5
        });

        this.showContainerHelpBounds(false);
    }

    /**
    * @override
    */
    setNodes() {
        this.nodesComposition = new RegimentNodeComposition(this.scene, this, 7, this.color);
    }

    /**
    * @override
    */
    setOnDragListener() {
        this.hitArea = this.scene.add.rectangle(0, this.container.height / 2, this.width, this.height, 0x000000, 0);
        this.hitArea.setVisible(false);
        this.container.add(this.hitArea);

        this.container.setInteractive(this.hitArea, Phaser.Geom.Rectangle.Contains);
        this.scene.input.setDraggable(this.container);
        this.container.on('drag', (pointer, dragX, dragY) => {
            const dx = dragX - this.container.x;
            const dy = dragY - this.container.y;
            this.container.x += dx;
            this.container.y += dy;
            this.nodesComposition.updateNodesPosition();

            console.log(`RegimentPiece ${this.gamePieceName} position:
            \n    X: ${this.container.x} 
            \n    Y: ${this.container.y}
            \n    rotation angle: ${this.container.rotation}`);
        })
    }
}

export default RegimentPiece;