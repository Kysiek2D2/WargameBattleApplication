export function calculateGameDistanceUnitPixels(scene) {
    var distanceUnitPixels;
    if (scene.gameConfig.width < scene.gameConfig.height) {
        distanceUnitPixels = scene.gameConfig.width / scene.mapWidthInGameDistanceUnits;
    } else {
        distanceUnitPixels = scene.gameConfig.height / scene.mapHeightInGameDistanceUnits;
    }
    console.log(`Single game distance unit = ${distanceUnitPixels} px.`);
    return distanceUnitPixels;
}

export function loadMap(mapName, scene) {
    console.log('Loading map...');
    var map = scene.add.sprite(scene.gameConfig.width / 2, scene.gameConfig.height / 2, mapName);
    map.setOrigin(0.5, 0.5);
    map.setPosition(scene.gameConfig.width / 2, scene.gameConfig.height / 2);
    map.displayWidth = scene.mapWidthInGameDistanceUnits * scene.gameDistanceUnitPixels;
    map.displayHeight = scene.mapHeightInGameDistanceUnits * scene.gameDistanceUnitPixels;

    console.log(`Map size: \n width: ${map.width} px, \n height: ${map.height} px.`);
}
