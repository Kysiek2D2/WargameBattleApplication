import { CONSTANTS } from '../Constants.js';

class ManipulationNodeComposition {

    constructor(scene, gamePiece, radius, color) {
        this.scene = scene;
        this.gamePiece = gamePiece;

        this.nodeRadius = radius;
        this.nodeColor = color;

        this.nodes = [];
        this.createNodes();
    }

    createSingleNode(x, y, radius, color) {
        var node = this.scene.add.circle(x, y, radius, color);
        node.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.GAME_PIECE_NODES);
        node.setVisible(false);
        return node;
    }

    createNodes() {
        var manipulationNodesPositions = this.calulateNodesPositions();
        manipulationNodesPositions.forEach(position => {
            var node = this.createSingleNode(position.x, position.y, this.nodeRadius, this.nodeColor);
            this.setNodeListener(node);
            this.nodes.push(node);
        });
    }

    updateNodesPosition() {
        throw new Error('You must implement the updateNodesPosition method');
    }

    updateNodesPosition() {
        var manipulationNodesPositions = this.calulateNodesPositions();
        this.nodes.forEach((node, index) => {
            node.setPosition(
                manipulationNodesPositions[index].x,
                manipulationNodesPositions[index].y
            );
        });
    }

    setNodeListener(node) {
        node.setInteractive();
        var scene = this.scene;
        scene.input.setDraggable(node);

        node.on('drag', (pointer) => {
            var worldPoint = this.scene.camera.getWorldPoint(pointer.x, pointer.y);
            this.updateGamePiece(node, { x: worldPoint.x, y: worldPoint.y });
        });
    }

    getNodes() {
        return this.nodes;
    }
}

export default ManipulationNodeComposition;