import GamePiece from "./GamePiece.js";

class RegimentPiece extends GamePiece {
    // Entity-Component-System (ECS) programmind design pattern
    static instances = [];
    static idCounter = 0;

    constructor(scene, { x, y, displayWidth, displayHeight, spriteKey, gamePieceName = 'Game Piece Unnamed', gamePieceStrength = 15 }) {
        super();
        console.log(`GamePiece constructor...`);
        this.scene = scene; //++

        this.container = this.scene.add.container(x, y);

        this.sprite = scene.add.image(0, 0, spriteKey)
            .setOrigin(0.5, 0.0) //origin in the middle?
            .setInteractive({ draggable: true })
            .setDisplaySize(displayWidth * scene.sceneDistanceUnitPixels, displayHeight * scene.sceneDistanceUnitPixels)

        this.container.add(this.sprite);

        this.container.add(this.scene.add.rectangle(0, 0, displayWidth * scene.sceneDistanceUnitPixels, displayHeight * scene.sceneDistanceUnitPixels, 0xff0000));
        this.container.setSize(displayWidth * scene.sceneDistanceUnitPixels, displayHeight * scene.sceneDistanceUnitPixels);
        this.spriteKey = spriteKey;

        //Usable properties
        this.id = RegimentPiece.idCounter++; //++
        this.isSelected = false; //++
        this.isBlocked = false; //++
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
        RegimentPiece.instances = [...RegimentPiece.instances, this]; //++
        RegimentPiece.activeGamePiece = null; //++
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
        this.container.add(cornerNode);

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
            //this.updateCornerNodes();

            /* //Comment-out to show rotation line
            // var oppositeCornerNode = this.getOppositeCornerNode(cornerNode);
            // var thisNode = cornerNode;
            var line = new Phaser.Geom.Line(this.getOppositeCornerNode(cornerNode).x, this.getOppositeCornerNode(cornerNode).y, pointerWorldPoint.x, pointerWorldPoint.y);
            var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
            graphics.strokeLineShape(line); */

            //Comment-out to show rotation line
            // var oppositeCornerNode = this.getOppositeCornerNode(cornerNode);
            // var thisNode = cornerNode;
            var line = new Phaser.Geom.Line(this.getOppositeCornerNode(cornerNode).x, this.getOppositeCornerNode(cornerNode).y, pointerWorldPoint.x, pointerWorldPoint.y);
            var graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 } });
            graphics.strokeLineShape(line);
        });
        cornerNode.on('dragend', (pointer) => {
            console.log('Drag ended');
            RegimentPiece.showActiveGamePieceNodes();
            // Perform your action here
        });

        cornerNode.on('pointerdown', () => {
            if (RegimentPiece.activeGamePiece !== null) {
                RegimentPiece.deactivateGamePiece(); //deactivate previous activeGamePiece
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

    static isMouseClickOnActiveGamePieceCornerNode(pointer) {
        // Convert screen coordinates to world coordinates
        if (RegimentPiece.activeGamePiece === null) return false;
        var worldX = RegimentPiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = RegimentPiece.activeGamePiece?.scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        var isMouseOnCornerNode = Object.values(RegimentPiece.activeGamePiece.cornerNodes).some(node => node.getBounds().contains(worldX, worldY));
        console.log(`Is mouse click on corner ion node: ${isMouseOnCornerNode}`);
        return isMouseOnCornerNode;
    }

    setOnDragListener() { //WORKS
        this.container.setInteractive();
        this.scene.input.setDraggable(this.container);
        this.container.on('drag', (pointer, dragX, dragY) => {
            console.log('!!!!!!dragging container')
            const dx = dragX - this.container.x;
            const dy = dragY - this.container.y;
            this.container.x += dx;
            this.container.y += dy;
            //this.updateCornerNodes();
        })
    }

    setActivateListener() { //++
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', () => {
            console.log('GamePiece clicked:', this.gamePieceName);
            console.log(`GamePieceStrength: ${this.gamePieceStrength}`);

            if (RegimentPiece.activeGamePiece !== null) {
                RegimentPiece.deactivateGamePiece(); //deactivate previous activeGamePiece
            }

            this.activateGamePiece();

            console.log(`Active unit is: ${RegimentPiece.activeGamePiece.gamePieceName}`);
        });
    }

    activateGamePiece() { //++
        RegimentPiece.activeGamePiece = this;
        RegimentPiece.activeGamePiece.sprite.setTint(185273);
        RegimentPiece.showActiveGamePieceNodes();
        this.scene.getGamePieceDetailsScene().updateGamePieceDetailsScene({ gamePiece: this, headerText: this.gamePieceName, gamePieceStrengthValue: this.gamePieceStrength });
        this.scene.getGamePieceDetailsScene().setVisible(true);
    }

    static deactivateGamePiece() { //++
        if (RegimentPiece.activeGamePiece === null) return;
        //RegimentPiece.activeGamePiece.updateCornerNodes()
        RegimentPiece.hideActiveGamePieceNodes();
        RegimentPiece.activeGamePiece?.sprite.clearTint();
        RegimentPiece.activeGamePiece?.scene.getGamePieceDetailsScene().setVisible(false);
        RegimentPiece.activeGamePiece = null;
    }

    static isMouseClickOnGamePiece(pointer, scene) { //++
        // Convert screen coordinates to world coordinates  
        var worldX = scene.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = scene.camera.getWorldPoint(pointer.x, pointer.y).y;
        // Check if the converted coordinates are within the bounds of the 'unit'
        var gamePiecesUnderClick = RegimentPiece.instances.filter(i => i.sprite.getBounds().contains(worldX, worldY));
        var isMouseOnGamePiece = gamePiecesUnderClick.length > 0;
        //console.log(`Is mouse click on unit: ${isMouseOnGamePiece}`);
        return isMouseOnGamePiece;
    }

    static getActiveGamePiece() { //++
        return RegimentPiece.activeGamePiece;
    }
}


export default RegimentPiece;