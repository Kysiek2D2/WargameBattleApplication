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

    updateGamePiece() {
        throw new Error('You must implement the updateGamePiece method');
    }

    getNodes() {
        return this.nodes;
    }

    createSingleNode(x, y, radius, color) {
        var node = this.scene.add.circle(x, y, radius, color);
        node.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.GAME_PIECE_NODES);
        node.setVisible(false);
        this.setNodeListener(node);
        this.nodes.push(node);
        return node;
    }

    createNodes() {
        var manipulationNodesPositions = this.calulateNodesPositions();
        manipulationNodesPositions.forEach(position => {
            var node = this.createSingleNode(position.x, position.y, this.nodeRadius, this.nodeColor);
        });
    }

    updateNodesPosition() {
        var manipulationNodesPositions = this.calulateNodesPositions();
        this.nodes.forEach((node, index) => {
            node.x = manipulationNodesPositions[index].x,
                node.y = manipulationNodesPositions[index].y
        });
    }

    setNodeListener(node) {
        node.setInteractive();
        var scene = this.scene;
        scene.input.setDraggable(node);

        node.on('drag', (pointer) => {
            var worldPoint = this.scene.camera.getWorldPoint(pointer.x, pointer.y);
            node.x = worldPoint.x;
            node.y = worldPoint.y;
            this.updateGamePiece(node, { x: worldPoint.x, y: worldPoint.y });
        });
    }
}

export default ManipulationNodeComposition;