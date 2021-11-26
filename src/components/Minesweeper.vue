<template>
  <div v-for="row in gameField.data" class="game-row">
    <div
        v-for="square in row"
        :class="getSquareClasses(square)"
        :style="squareStyle"
        @click.prevent="onClickSquare(square)"
        @contextmenu.prevent="onRightClickSquare(square)"
    >
      {{ getSquareContent(square) }}
      <img src="../../public/favicon.png" class="bomb-img" alt="O" v-if="shouldDisplayBomb(square)"
           :style="bombImageStyle"/>
    </div>
  </div>
</template>

<script>
import {computed, ref, toRefs} from 'vue';
import {STATE_COVERED, STATE_MAYBE, STATE_PROPOSAL, STATE_UNCOVERED} from '../constant/gameSquareState';
import useGameFieldFactory from '../composables/useGameFieldFactory';
import useNeighbourIterator from '../composables/useNeighbourIterator';
import TooMuchBombsError from "../errors/TooMuchBombsError";

export default {
  name: 'Minesweeper',
  props: {
    sizeY: {
      type: Number,
      default: 20,
    },
    sizeX: {
      type: Number,
      default: 15,
    },
    bombCount: {
      type: Number,
      default: 50,
    },
    gameLost: {
      type: Boolean,
      default: false
    },
    gameWon: {
      type: Boolean,
      default: false
    },
    proposalCount: {
      type: Number,
      default: 0,
    },
    gameSize: {
      type: Number,
      default: 5,
    }
  },
  emits: [
    'won',
    'lost',
    'invalidConfiguration',
    'update:proposalCount',
  ],
  setup(props, {emit}) {
    const {sizeY, sizeX, bombCount, gameWon, gameLost, proposalCount, gameSize} = toRefs(props);
    const {newGameField} = useGameFieldFactory();
    let gameField = ref({});
    try {
      gameField = newGameField(sizeY.value, sizeX.value, bombCount.value);
    } catch (error) {
      if (error instanceof TooMuchBombsError) {
        emit('invalidConfiguration', 'Plansza nie zmieści tylu bomb!');
      } else {
        throw error;
      }
    }
    const {getNeighbours} = useNeighbourIterator(gameField);
    emit('update:proposalCount', bombCount.value);

    const undercoverNeighbours = (bomb) => {
      getNeighbours(bomb).forEach((neighbour) => {
        if (neighbour.state === STATE_COVERED) {
          neighbour.state = STATE_UNCOVERED;
          if (!neighbour.surrounding) {
            undercoverNeighbours(neighbour);
          }
        }
      });
    };

    const onClickSquare = (bomb) => {
      if (gameLost.value || gameWon.value || bomb.state === STATE_MAYBE || bomb.state === STATE_PROPOSAL) {
        return;
      }
      if (bomb.bomb) {
        emit('lost');
        return;
      }
      bomb.state = STATE_UNCOVERED;
      if (!bomb.surrounding) {
        undercoverNeighbours(bomb);
      }

      let toUndercover = (sizeY.value * sizeX.value) - bombCount.value;
      for (let y = 0; y < sizeY.value; y++) {
        for (let x = 0; x < sizeX.value; x++) {
          if (gameField.value.data[y][x].state === STATE_UNCOVERED) {
            toUndercover--;
          }
        }
      }
      if (toUndercover === 0) {
        emit('won');
      }
    };

    const onRightClickSquare = (bomb) => {
      if (gameLost.value) {
        return;
      }
      if (bomb.state === STATE_COVERED) {
        bomb.state = STATE_PROPOSAL;
        if (proposalCount.value > 0) {
          emit('update:proposalCount', proposalCount.value - 1);
        }
      } else if (bomb.state === STATE_PROPOSAL) {
        bomb.state = STATE_MAYBE;
        emit('update:proposalCount', proposalCount.value + 1);
      } else if (bomb.state === STATE_MAYBE) {
        bomb.state = STATE_COVERED;
      }
    };

    const getSquareClasses = (square) => {
      const classes = {
        'game-square': true,
        'covered': [STATE_COVERED, STATE_PROPOSAL, STATE_MAYBE].includes(square.state),
        'proposal': square.state === STATE_PROPOSAL,
        'maybe': square.state === STATE_MAYBE,
        'uncovered': square.state === STATE_UNCOVERED,
        'bomb': square.bomb && gameLost.value
      };
      if (square.surrounding > 0) {
        classes['b' + square.surrounding] = true;
      }
      return classes;
    }

    const getSquareContent = (square) => {
      if (square.state === STATE_UNCOVERED && square.surrounding) {
        return square.surrounding;
      }
      if (square.state === STATE_MAYBE) {
        return '?';
      }
      return '';
    }

    const shouldDisplayBomb = (square) => {
      return square.state === STATE_PROPOSAL || (gameLost.value && square.bomb);
    };

    return {
      gameField,
      onClickSquare,
      onRightClickSquare,
      getSquareClasses,
      getSquareContent,
      shouldDisplayBomb,
      squareStyle: computed(() => {
        const size = 18 + ((gameSize.value - 3) * 2);
        return {
          width: size + 'px',
          height: size + 'px',
          'font-size': (12 + ((gameSize.value - 3) * 2)) + 'px',
          'line-height': gameSize.value <= 4 ? '20px' : '26px',
        }
      }),
      bombImageStyle: computed(() => {
        const size = 10 + ((gameSize.value - 3) * 2);
        return {
          width: size + 'px',
          height: size + 'px',
        }
      }),
    };
  }
}
</script>

<style scoped>
div.game-row {
  line-height: 0;
}

div.game-square {
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 1px solid #e4e4e4;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

div.game-square.covered {
  background-color: #abbfff;
}

div.game-square.covered.proposal {
  color: #ff5050;
}

div.game-square.covered.maybe {
  color: #000;
}

div.game-square.covered:hover {
  background-color: #8aa3ff;
}

div.game-square.uncovered, div.game-square.uncovered:hover {
  background-color: #ffffff;
}

div.game-square.bomb {
  background-color: #ffb0b0;
}

div.game-square.bomb:hover {
  background-color: #ff8787;
}

.b1 {
  color: #2424ff;
}

.b2 {
  color: #006a00;
}

.b3 {
  color: #8f0101;
}

.b4 {
  color: #730073;
}

.b5 {
  color: #3c0000;
}

.b6 {
  color: #2ea394;
}

.b7 {
  color: #181818;
}

.b8 {
  color: #656565;
}
</style>
