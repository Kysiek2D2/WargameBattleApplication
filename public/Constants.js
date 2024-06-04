export const CONSTANTS = {
    SCENES: {
        MAIN_MENU_SCENE: "MainMenuScene",
        FIRE_AND_SWORD_SCENE: "FireAndSwordScene",
        GAME_PIECE_DETAILS_SCENE: "GamePieceDetailsScene",
        TOOLS_SCENE: "ToolsScene",
    },
    FIRE_AND_SWORD_REGIMENT_SIZES_IN_INCHES: {
        SIZE_S: {
            width: 3.26,
            height: 2.45,
        },
        SIZE_M: {
            width: 4.90,
            height: 2.45,
        },
        SIZE_L: {
            width: 6.53,
            height: 2.24,
        },
    },
    FIRE_AND_SWORD_TERRAIN_SIZES_IN_INCHES: {
        SIZE_S: {
            width: 6,
            height: 6,
        },
        SIZE_M: {
            width: 10,
            height: 10,
        },
        SIZE_L: {
            width: 15,
            height: 15,
        },
    },
    BASIC_COLORS: {
        CLASSIC_RED: 0xff0000,
        TAPE_YELLOW: 0xfcf403,
        BURGUNDY: 0x914148,
        ACID_GREEN: 0x00ff00,
        SNOW_WHITE: 0xfffafa,
        BROWN: 0x8b4513,
        BLUE: 0x0000ff,
        BLACK: 0x000000,
    },
    WARGAME_DEPTH_CATEGORIES: {
        BACKGROUND: -1,
        MAP: 0,
        TERRAIN_PIECE: 1,
        GAME_PIECE_NODES: 2,
        REGIMENT_PIECE_CONTAINER: 3,
        MEASURE_TAPE_PIECE_CONTAINER: 4,
    },
    CONTROL_MODE: {
        CAMERA_MODE: 'cameraMode',
        GAME_PIECE_MODE: 'gamePieceMode',
    }
}

