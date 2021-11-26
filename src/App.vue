<template>
  <div class="container">
    <h1>Minesweeper by Quis</h1>
    <div>
      <minesweeper
          :size-y="sizeY"
          :size-x="sizeX"
          :bomb-count="bombCount"
          :game-size="gameSize"
          :game-won="gameWon"
          :game-lost="gameLost"
          @lost="onGameLost"
          @won="onGameWon"
          @invalidConfiguration="onInvalidGameConfigurationThrown"
          v-model:proposalCount="bombsLeft"
          :key="gameKey"/>
    </div>
    <table class="game-status">
      <thead>
      <tr>
        <th>Pozostało</th>
        <th>Czas gry</th>
        <th>Rozmiar planszy</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ bombsLeft }}/{{ bombCount }}</td>
        <td>{{ gameTime }}</td>
        <td>{{ sizeY }}&nbsp;x&nbsp;{{ sizeX }}</td>
      </tr>
      </tbody>
    </table>
    <div class="game-won" v-if="gameWon">Wygrana w czasie {{ gameTime }}!</div>
    <div class="msg" v-if="errorMessage.length > 0">
      {{ errorMessage }}
    </div>
    <div>
      <button type="button" class="btn" @click="onNewGameClick">Nowa gra</button>
    </div>
    <div>
      <table class="game-settings">
        <thead>
        <tr>
          <th colspan="3">
            Ustawienia
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>Rozmiar:</th>
          <td>
            <button class="btn" type="button" @click.prevent="onDecreaseSizeClick">-</button>&nbsp;{{ gameSize }}&nbsp;<button
              class="btn" type="button" @click.prevent="onIncreaseSizeClick">+
          </button>
          </td>
          <td rowspan="3">
            <button type="button" class="btn" @click.prevent="onSetDefaultSettingsClick">Ustaw<br/>domyślne</button>
          </td>
        </tr>
        <tr>
          <th>Rozmiar pola gry:</th>
          <td>Wysokość: <input type="number" v-model="settingsSizeY" @blur.prevent="validateSizeY"/><br/>Szerokość:
            <input type="number"
                   v-model="settingsSizeX"
                   @blur.prevent="validateSizeX"/></td>
        </tr>
        <tr>
          <th>Liczba bomb:</th>
          <td>&nbsp;<button class="btn" type="button" @click.prevent="onDecreaseBombCountClick">-</button>
            <input type="text" v-model="settingsBombCount" @blur.prevent="validateBombCount" class="bomb-count"/>
            <button class="btn" type="button" @click.prevent="onIncreaseBombCountClick">
              +
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: center">
            <button type="button" class="btn" @click.prevent="onSetLevel1Click">Łatwy</button>
            <button type="button" class="btn" @click.prevent="onSetLevel2Click">Średni</button>
            <button type="button" class="btn" @click.prevent="onSetLevel3Click">Ekspert</button>
          </td>
        </tr>
        </tbody>
        <tfoot v-if="settingsBombCount !== bombCount || sizeY !== settingsSizeY || sizeX !== settingsSizeX">
        <tr>
          <td colspan="3">Rozpocznij nową grę aby zastosować ustawienia</td>
        </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import Minesweeper from "./components/Minesweeper";
import {DEFAULT_BOMB_COUNT, DEFAULT_GAME_SIZE, DEFAULT_SIZE_X, DEFAULT_SIZE_Y} from "./constant/gameDefaults";
import clearInt from "./functions/clearInt";

export default {
  name: 'App',
  components: {Minesweeper},
  setup() {
    const gameKey = ref(1);
    const sizeY = ref(DEFAULT_SIZE_Y);
    const sizeX = ref(DEFAULT_SIZE_X);
    const bombCount = ref(DEFAULT_BOMB_COUNT);
    const gameSize = ref(DEFAULT_GAME_SIZE);
    const errorMessage = ref('');
    const gameLost = ref(false);
    const gameWon = ref(false);
    const bombsLeft = ref(0);
    const startGameTime = ref(Date.now());
    const gameTime = ref('00:00');
    const settingsSizeY = ref(DEFAULT_SIZE_Y);
    const settingsSizeX = ref(DEFAULT_SIZE_X);
    const settingsBombCount = ref(DEFAULT_BOMB_COUNT);

    const onGameWon = () => {
      gameWon.value = true;
      gameLost.value = false;
    };

    const onGameLost = () => {
      gameLost.value = true;
      gameWon.value = false;
    };

    const onNewGameClick = () => {
      gameLost.value = false;
      gameWon.value = false;
      errorMessage.value = '';

      sizeY.value = settingsSizeY.value;
      sizeX.value = settingsSizeX.value;
      bombCount.value = settingsBombCount.value;

      startGameTime.value = Date.now();
      gameTime.value = '00:00';

      gameKey.value++;
    };

    setInterval(() => {
      if (!gameLost.value && !gameWon.value) {
        const timeLeft = Date.now() - startGameTime.value;
        const minutes = Math.floor(timeLeft / 1000 / 60).toString();
        const seconds = Math.floor(((timeLeft / 1000) - (minutes * 60))).toString();
        gameTime.value = minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0');
      }
    }, 1000);

    const onSetDefaultSettingsClick = () => {
      settingsSizeY.value = DEFAULT_SIZE_Y;
      settingsSizeX.value = DEFAULT_SIZE_X;
      settingsBombCount.value = DEFAULT_BOMB_COUNT;
      gameSize.value = DEFAULT_GAME_SIZE;
    };

    const onSetLevel1Click = () => {
      settingsSizeY.value = 9;
      settingsSizeX.value = 9;
      settingsBombCount.value = 10;
    };

    const onSetLevel2Click = () => {
      settingsSizeY.value = 16;
      settingsSizeX.value = 16;
      settingsBombCount.value = 40;
    };

    const onSetLevel3Click = () => {
      settingsSizeY.value = 16;
      settingsSizeX.value = 30;
      settingsBombCount.value = 99;
    };

    const onDecreaseSizeClick = () => {
      if (gameSize.value > 1) {
        gameSize.value--;
      }
    };
    const onIncreaseSizeClick = () => {
      if (gameSize.value < 10) {
        gameSize.value++;
      }
    };

    const onDecreaseBombCountClick = () => {
      if (settingsBombCount.value > 5) {
        settingsBombCount.value--;
      }
    };
    const onIncreaseBombCountClick = () => {
      if (settingsBombCount.value < 500) {
        settingsBombCount.value++;
      }
    };

    const validateBombCount = () => {
      let value = clearInt(settingsBombCount.value);
      if (isNaN(value)) {
        value = DEFAULT_BOMB_COUNT;
      }
      if (value < 5) {
        value = 5;
      } else if (value > 500) {
        value = 500;
      }
      settingsBombCount.value = value;
    };

    const validateSizeY = () => {
      let value = clearInt(settingsSizeY.value);
      if (isNaN(value)) {
        value = DEFAULT_SIZE_Y;
      } else if (value > 75) {
        value = 75;
      } else if (value < 5) {
        value = 5;
      }
      settingsSizeY.value = value;
    };

    const validateSizeX = () => {
      let value = clearInt(settingsSizeX.value);
      if (isNaN(value)) {
        value = DEFAULT_SIZE_Y;
      } else if (value > 50) {
        value = 50;
      } else if (value < 5) {
        value = 5;
      }
      settingsSizeX.value = value;
    };

    const onInvalidGameConfigurationThrown = (msg) => {
      errorMessage.value = msg;
      gameLost.value = true;
      onSetDefaultSettingsClick();
    };

    return {
      gameKey,
      sizeX,
      sizeY,
      bombCount,
      gameWon,
      gameLost,
      bombsLeft,
      errorMessage,
      gameSize,
      gameTime,
      onGameWon,
      onGameLost,
      onNewGameClick,
      settingsSizeY,
      settingsSizeX,
      settingsBombCount,
      onSetDefaultSettingsClick,
      onDecreaseSizeClick,
      onIncreaseSizeClick,
      onDecreaseBombCountClick,
      onIncreaseBombCountClick,
      validateBombCount,
      validateSizeY,
      validateSizeX,
      onInvalidGameConfigurationThrown,
      onSetLevel1Click,
      onSetLevel2Click,
      onSetLevel3Click,
    };
  }
}
</script>

<style>
.container {
  width: 100%;
}

@media (min-width: 1200px) {
  .container {
    width: 80%;
    margin: auto;
  }
}

.btn {
  background-color: #0088ff;
  color: white;
  padding: 4px 15px;
  border-radius: 5px;
  border: 1px solid #6d6d6d;
  margin: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #0078e7;
}

.msg {
  color: #ff6e6e;
  padding: 15px 0;
}

table.game-status {
  text-align: center;
}

table.game-status td {
  padding: 5px 30px;
}

table.game-settings thead th {
  font-size: 24px;
}

table.game-settings tbody th {
  text-align: right;
}

table.game-settings tfoot td {
  text-align: center;
}

input[type=text], input[type=number] {
  padding: 4px;
  margin: 2px;
  border-radius: 5px;
  border: 1px solid #6d6d6d;
  text-align: center;
}

input[type=number] {
  width: 40px;
}

input.bomb-count {
  width: 50px;
  text-align: center;
}

.game-won {
  font-size: 24px;
  font-weight: bold;
  color: #008700;
  margin: 10px 0;
}
</style>
