import GamePiece from "./GamePiece.js";

class RegimentPiece extends GamePiece {
    // Entity-Component-System (ECS) programmind design pattern

    constructor(scene, gamePieceName = 'Game Piece Unnamed', { x, y, displayWidth, displayHeight, spriteKey, gamePieceStrength = 15 }) {
        super(scene, gamePieceName);
        console.log(`RegimentPiece constructor...`);

        this.sprite = scene.add.image(x, y, spriteKey)
            .setOrigin(0.5, 0.0) //origin in the middle?
            .setInteractive({ draggable: true })
            .setDisplaySize(displayWidth * scene.sceneDistanceUnitPixels, displayHeight * scene.sceneDistanceUnitPixels)

        this.spriteKey = spriteKey;

        this.gamePieceStrength = gamePieceStrength;

        this.cornerNodes = {
            cornerNodeTopLeft: null,
            cornerNodeTopRight: null,
        }

        //Additional configuration
        this.setCornerNodes();
        this.setOnDragListener();
        this.setActivateListener(this.sprite);
    }

    setCornerNodes() {
        var cornerNodeColor = 0x914148;
        var corners = this.getCornersPositions();
        this.cornerNodes = {
            cornerNodeTopLeft: this.createSingleCornerNode(corners.topLeft.x, corners.topLeft.y, 7, cornerNodeColor),
            cornerNodeTopRight: this.createSingleCornerNode(corners.topRight.x, corners.topRight.y, 7, cornerNodeColor),
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
            RegimentPiece.hideActiveGamePieceNodes();
            //set cornerNode size to 
            var pointerWorldPoint = {
                x: this.scene.camera.getWorldPoint(pointer.x, pointer.y).x,
                y: this.scene.camera.getWorldPoint(pointer.x, pointer.y).y
            };
            var angle = this.getRotationAngle(cornerNode, pointerWorldPoint);
            this.sprite.rotation = angle;
            this.updateCornerNodes();

            /* //Comment-out to show rotation line
            // var oppositeCornerNode = this.getOppositeCornerNode(cornerNode);
            // var thisNode = cornerNode;
            var line = new Phaser.Geom.Line(this.getOppositeCornerNode(cornerNode).x, this.getOppositeCornerNode(cornerNode).y, pointerWorldPoint.x, pointerWorldPoint.y);
            var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
            graphics.strokeLineShape(line); */
        });
        cornerNode.on('dragend', (pointer) => {
            console.log('Drag ended');
            RegimentPiece.showActiveGamePieceNodes();
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
        Object.values(RegimentPiece.activeGamePiece.cornerNodes).forEach(node => node.setVisible(false));
        //TODO: add more, for arrows etc as well
    }

    static showActiveGamePieceNodes() {
        Object.values(RegimentPiece.activeGamePiece.cornerNodes).forEach(node => node.setVisible(true));
    }

    getOppositeCornerNode(cornerNode) {
        if (cornerNode === this.cornerNodes.cornerNodeTopLeft) {
            //console.log(`Opposite corner node is: cornerTopRight`);
            return this.cornerNodes.cornerNodeTopRight;
        } else if (cornerNode === this.cornerNodes.cornerNodeTopRight) {
            //console.log(`Opposite corner node is: cornerTopLeft`);
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

    activateGamePiece() {
        super.activateGamePiece();
        RegimentPiece.showActiveGamePieceNodes();
    }

    setOnDragListener() {
        this.scene.input.setDraggable(this.sprite);
        this.sprite.on('drag', (pointer, dragX, dragY) => {
            const dx = dragX - this.sprite.x;
            const dy = dragY - this.sprite.y;
            this.sprite.x += dx;
            this.sprite.y += dy;
            this.updateCornerNodes();
        })
    }

    static deactivateGamePiece() {
        super.deactivateGamePiece();
        RegimentPiece.activeGamePiece.updateCornerNodes()
        RegimentPiece.hideActiveGamePieceNodes();
    }
}

export default RegimentPiece;