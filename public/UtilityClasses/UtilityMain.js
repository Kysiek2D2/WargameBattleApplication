export function loadBattleground() {
    console.log('Loading battleground...');
}

export function calculateDistanceUnitPixels(gameConfig, battlegroundWidthDistanceUnits, battlegroundHeightDistanceUnits) {
    console.log('Calculating distance unit...');
    var distanceUnitPixels;
    if (gameConfig.width < gameConfig.height) {
        distanceUnitPixels = gameConfig.width / battlegroundWidthDistanceUnits;
    } else {
        distanceUnitPixels = gameConfig.height / battlegroundHeightDistanceUnits;
    }
    console.log(`...distance unit pixels: ${distanceUnitPixels}`);
    return distanceUnitPixels;
}
