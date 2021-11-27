import {ref} from 'vue';
import {DEFAULT_BOMB_COUNT, DEFAULT_GAME_SIZE, DEFAULT_SIZE_X, DEFAULT_SIZE_Y} from '../constant/gameDefaults';
import {LEVELS} from '../constant/gameSettings';

export default function useGameSettings() {
    const gameSize = ref(DEFAULT_GAME_SIZE);
    const settings = ref({
        sizeY: DEFAULT_SIZE_Y,
        sizeX: DEFAULT_SIZE_X,
        bombCount: DEFAULT_BOMB_COUNT
    });
    const setDefaultSettings = () => {
        settings.value = {
            sizeY: DEFAULT_SIZE_Y,
            sizeX: DEFAULT_SIZE_X,
            bombCount: DEFAULT_BOMB_COUNT,
        };
        gameSize.value = DEFAULT_GAME_SIZE;
    };

    const setLevel = (level) => {
        settings.value = {...LEVELS[level]};
    };

    return {
        gameSize,
        settings,
        setDefaultSettings,
        setLevel,
    };
};
