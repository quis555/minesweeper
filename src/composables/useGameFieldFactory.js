import {ref} from 'vue';
import {STATE_COVERED} from '../constant/gameSquareState';
import getRandomInt from "../functions/getRandomInt";
import useNeighbourIterator from "./useNeighbourIterator";
import TooMuchBombsError from "../errors/TooMuchBombsError";

export default function useGameFieldFactory() {
    const newGameField = (sizeY, sizeX, bombCount) => {
        const totalArea = sizeY * sizeX;
        if (bombCount > totalArea) {
            throw new TooMuchBombsError('Too much bombs for given size.');
        }
        const gameField = ref({
            sizeY,
            sizeX,
            bombCount,
            data: []
        });
        const {getNeighbours} = useNeighbourIterator(gameField);

        for (let y = 0; y < sizeY; y++) {
            for (let x = 0; x < sizeX; x++) {
                if (!gameField.value.data[y]) {
                    gameField.value.data[y] = [];
                }

                gameField.value.data[y].push({
                    x,
                    y,
                    state: STATE_COVERED,
                    bomb: false,
                    surrounding: 0
                });
            }
        }

        let createdBombs = 0;
        while (createdBombs < bombCount) {
            const y = getRandomInt(0, sizeY);
            const x = getRandomInt(0, sizeX);
            if (!gameField.value.data[y][x].bomb) {
                gameField.value.data[y][x].bomb = true;
                createdBombs++;
            }
        }
        for (let y = 0; y < sizeY; y++) {
            for (let x = 0; x < sizeX; x++) {
                const gameSquare = gameField.value.data[y][x];
                getNeighbours(gameSquare).forEach((neighbour) => {
                    if (neighbour.bomb) {
                        gameSquare.surrounding++;
                    }
                });
            }
        }
        return gameField;
    };
    return {
        newGameField
    };
};
