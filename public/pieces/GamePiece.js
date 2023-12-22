import { CONSTANTS } from "../Constants.js";
import SidePanelScene from "../scenes/SidePanelScene.js";


class GamePiece {
    // Entity-Component-System (ECS) programmind design pattern
    static instances = [];
    static idCounter = 0;

    constructor(scene, { x, y, displayWidth, displayHeight, spriteKey, gamePieceName = 'Game Piece Unnamed', gamePieceStrength = 15 }) {
        console.log(`GamePiece constructor...`);
        this.scene = scene;

        this.sprite = scene.add.image(x, y, spriteKey)
            .setOrigin(0.5, 0.0) //origin in the middle?
            .setInteractive({ draggable: true })
            .setDisplaySize(displayWidth * scene.sceneDistanceUnitPixels, displayHeight * scene.sceneDistanceUnitPixels)

        this.spriteKey = spriteKey;

        //Usable properties
        this.id = GamePiece.idCounter++;
        this.isSelected = false;
        this.isBlocked = false;
        this.gamePieceName = gamePieceName;
        this.gamePieceStrength = gamePieceStrength;

        this.cornerNodes = {
            cornerNodeTopLeft: null,
            cornerNodeTopRight: null,
        }

        //Additional configuration
        this.setCornerNodes();
        this.setOnDragListener();
        this.setActivateListener();
        GamePiece.instances = [...GamePiece.instances, this];
        GamePiece.activeGamePiece = null;
    }

    setCornerNodes() {
        var corners = this.getCornersPositions();
        this.cornerNodes = {
            cornerNodeTopLeft: this.createSingleCornerNode(corners.topLeft.x, corners.topLeft.y, 7, 0x914148),
            cornerNodeTopRight: this.createSingleCornerNode(corners.topRight.x, corners.topRight.y, 7, 0x914148),
        }
    }

    createSingleCornerNode(x, y, radius, color) {
        var cornerNode = this.scene.add.circle(x, y, radius, color);
        cornerNode.setOrigin(0.5, 0.5);
        cornerNode.setInteractive();
        cornerNode.setVisible(false);
        cornerNode.setSize(radius * 2, radius * 2);
        this.scene.input.setDraggable(cornerNode);
        cornerNode.on('dragstart', (pointer) => {
            console.log('Drag started');
        });
        cornerNode.on('drag', (pointer) => {
            console.log(`createSingleCornerNode pointer:`)
            GamePiece.hideActiveGamePieceNodes();
            var pointerWorldPoint = {
                x: this.scene.camera.getWorldPoint(pointer.x, pointer.y).x,
                y: this.scene.camera.getWorldPoint(pointer.x, pointer.y).y
            };
            var angle = this.getRotationAngle(cornerNode, pointerWorldPoint);
            this.sprite.rotation = angle;
            //this.updateCornerNodes();
            console.log(`sprite rotation angle: ${angle}`)
            //Calculate point between cornerNodes
            var oppositeCornerNode = this.getOppositeCornerNode(cornerNode);
            var thisNode = cornerNode;
            /* //Comment-out to show rotation line
            var line = new Phaser.Geom.Line(this.getOppositeCornerNode(cornerNode).x, this.getOppositeCornerNode(cornerNode).y, pointerWorldPoint.x, pointerWorldPoint.y);
            var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
            graphics.strokeLineShape(line); */
        });
        cornerNode.on('dragend', (pointer) => {
            console.log('Drag ended');
            this.updateCornerNodes();
            GamePiece.showActiveGamePieceNodes();
            // Perform your action here
        });

        cornerNode.on('pointerdown', () => {
            if (GamePiece.activeGamePiece !== null) {
                GamePiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }
            this.activateGamePiece();
        });
        return cornerNode;
    }

    static hideActiveGamePieceNodes() {
        Object.values(GamePiece.activeGamePiece.cornerNodes).forEach(node => node.setVisible(false));
        //TODO: add more, for arrows etc as well
    }

    static showActiveGamePieceNodes() {
        Object.values(GamePiece.activeGamePiece.cornerNodes).forEach(node => node.setVisible(true));
    }

    getOppositeCornerNode(cornerNode) {
        if (cornerNode === this.cornerNodes.cornerNodeTopLeft) {
            console.log(`Opposite corner node is: cornerTopRight`);
            return this.cornerNodes.cornerNodeTopRight;
        } else if (cornerNode === this.cornerNodes.cornerNodeTopRight) {
            console.log(`Opposite corner node is: cornerTopLeft`);
            return this.cornerNodes.cornerNodeTopLeft;
        } else {
            return null;
        }
    }

    updateCornerNodes() {
        var corners = this.getCornersPositions();
        this.cornerNodes.cornerNodeTopLeft.setPosition(corners.topLeft.x, corners.topLeft.y);
        this.cornerNodes.cornerNodeTopRight.setPosition(corners.topRight.x, corners.topRight.y);
    }

    getCornersPositions() {
        var corners = {
            topLeft: this.sprite.getTopLeft(),
            topRight: this.sprite.getTopRight(),
            bottomLeft: this.sprite.getBottomLeft(),
            bottomRight: this.sprite.getBottomRight(),
        }
        return corners;
    }

    getRotationAngle(cornerNode, pointerWorldPoint) {
        var angle = null;
        var opposideCornerNode = this.getOppositeCornerNode(cornerNode);
        if (cornerNode == this.cornerNodes.cornerNodeTopRight) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint);
        }
        else if (cornerNode == this.cornerNodes.cornerNodeTopLeft) {
            var angle = Phaser.Math.Angle.BetweenPoints(opposideCornerNode, pointerWorldPoint) - Math.PI;
        }
        return angle;
    }

    static isMouseClickOnActiveGamePieceCornerNode(pointer) {
        // Convert screen coordinates to world coordinates
        if (GamePiece.activeGamePiece === null) return false;
        var worldX = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = GamePiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnCornerNode = Object.values(GamePiece.activeGamePiece.cornerNodes).some(node => node.getBounds().contains(worldX, worldY));
        console.log(`Is mouse click on corner ion node: ${isMouseOnCornerNode}`);
        return isMouseOnCornerNode;
    }

    setOnDragListener() {
        this.scene.input.setDraggable(this.sprite);
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.updateCornerNodes();
        })
    }

    setActivateListener() {
        //Activate listener
        this.sprite.setInteractive(); // Make sure the sprite is interactive
        this.sprite.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);
            console.log(`GamePieceStrength: ${this.gamePieceStrength}`);

            if (GamePiece.activeGamePiece !== null) {
                GamePiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }

            this.activateGamePiece();

            console.log(`Active unit is: ${GamePiece.activeGamePiece.gamePieceName}`);
        });
    }

    activateGamePiece() {
        GamePiece.activeGamePiece = this;
        GamePiece.activeGamePiece.sprite.setTint(185273);
        GamePiece.showActiveGamePieceNodes();
        this.scene.getSidePanelScene().updateSidePanelScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getSidePanelScene().setVisible(true);
    }

    static deactivateGamePiece() {
        if (GamePiece.activeGamePiece === null) return;
        GamePiece.activeGamePiece.updateCornerNodes()
        GamePiece.hideActiveGamePieceNodes();
        GamePiece.activeGamePiece?.sprite.clearTint();
        GamePiece.activeGamePiece?.scene.getSidePanelScene().setVisible(false);
        GamePiece.activeGamePiece = null;
    }

    static isMouseClickOnGamePiece(pointer, scene) {
        // Convert screen coordinates to world coordinates
        var worldX = scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        // Check if the converted coordinates are within the bounds of the 'unit'
        var gamePiecesUnderClick = GamePiece.instances.filter(i => i.sprite.getBounds().contains(worldX, worldY));
        var isMouseOnGamePiece = gamePiecesUnderClick.length > 0;
        console.log(`Is mouse click on unit: ${isMouseOnGamePiece}`);
        return isMouseOnGamePiece;
    }
}

export default GamePiece;