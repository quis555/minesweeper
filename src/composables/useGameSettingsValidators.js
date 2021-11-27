import validateInt from "../functions/validateInt";
import {DEFAULT_BOMB_COUNT, DEFAULT_SIZE_X, DEFAULT_SIZE_Y} from "../constant/gameDefaults";
import {MAX_BOMB_COUNT, MAX_SIZE_X, MAX_SIZE_Y, MIN_BOMB_COUNT, MIN_SIZE_X, MIN_SIZE_Y} from "../constant/gameSettings";

export default function useGameSettingsValidators() {
    const validateBombCount = (value) => {
        return validateInt(value, MIN_BOMB_COUNT, MAX_BOMB_COUNT, DEFAULT_BOMB_COUNT);
    };

    const validateSizeY = (value) => {
        return validateInt(value, MIN_SIZE_Y, MAX_SIZE_Y, DEFAULT_SIZE_Y);
    };

    const validateSizeX = (value) => {
        return validateInt(value, MIN_SIZE_X, MAX_SIZE_X, DEFAULT_SIZE_X);
    };

    return {
        validateBombCount,
        validateSizeY,
        validateSizeX,
    };
}
