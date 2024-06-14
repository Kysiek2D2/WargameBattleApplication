import { CONSTANTS } from '../Constants.js';

class RegimentSymbolic {

    static createRegimentSymbolic(regimentPiece, x, y) {
        var symbolicRepresentationSprite = regimentPiece.scene.add.rectangle(
            x, y,
            regimentPiece.sprite.displayWidth, regimentPiece.sprite.displayHeight,
            regimentPiece.color);

        symbolicRepresentationSprite.setOrigin(0.5, 0.5);

        return symbolicRepresentationSprite;
    }
}

export default RegimentSymbolic;