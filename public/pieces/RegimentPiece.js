import { CONSTANTS } from "../Constants.js";
import RegimentNodeComposition from "../nodes/RegimentNodeComposition.js";
import GamePiece from "./GamePiece.js";

class RegimentPiece extends GamePiece {
    // Entity-Component-System (ECS) programming design pattern

    constructor({ scene, gamePieceName = 'Game Piece Unnamed', x, y, rotationAngle, widthInDistanceUnits, heightInDistanceUnits, spriteKey, gamePieceStrength = 15, color = null }) {
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
        this.sprite = this.scene.add.image(0, 0, this.spriteKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.width, this.height)
        this.container.add(this.sprite);
        this.showContainerHelpBounds(false);
    }

    /**
    * @override
    */
    setNodes() {
        this.nodesComposition = new RegimentNodeComposition(this.scene, this, 7, CONSTANTS.BASIC_COLORS.ACID_GREEN);
    }

    /**
    * @override
    */
    setOnDragListener() {
        this.container.setInteractive();
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