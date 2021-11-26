import {NEIGHBOUR_COMBINATIONS} from "../constant/neighbourCombinations";

export default function useNeighbourIterator(gameField) {
    const getNeighbours = (gameSquare) => {
        if (typeof gameField.value === 'undefined') {
            debugger;
        }
        const results = [];
        for (let i = 0; i < NEIGHBOUR_COMBINATIONS.length; i++) {
            const nY = gameSquare.y + NEIGHBOUR_COMBINATIONS[i].y;
            const nX = gameSquare.x + NEIGHBOUR_COMBINATIONS[i].x;
            if (nY < 0 || nX < 0 || typeof gameField.value.data[nY] === 'undefined' || typeof gameField.value.data[nY][nX] === 'undefined') {
                continue;
            }
            results.push(gameField.value.data[nY][nX]);
        }
        return results;
    };

    return {
        getNeighbours
    };
};
