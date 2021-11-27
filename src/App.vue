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
      <minesweeper-settings
          v-model:settings="settings"
          v-model:game-size="gameSize"
          :settings-changed="isSettingsChanged"
          @setDefault="setDefaultSettings"
          @setLevel="setLevel"
      />
    </div>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import Minesweeper from './components/Minesweeper';
import {DEFAULT_BOMB_COUNT, DEFAULT_SIZE_X, DEFAULT_SIZE_Y} from './constant/gameDefaults';
import useGameSettings from './composables/useGameSettings';
import MinesweeperSettings from './components/MinesweeperSettings';

export default {
  name: 'App',
  components: {MinesweeperSettings, Minesweeper},
  setup() {
    const gameKey = ref(1);
    const sizeY = ref(DEFAULT_SIZE_Y);
    const sizeX = ref(DEFAULT_SIZE_X);
    const bombCount = ref(DEFAULT_BOMB_COUNT);
    const errorMessage = ref('');
    const gameLost = ref(false);
    const gameWon = ref(false);
    const bombsLeft = ref(0);
    const startGameTime = ref(Date.now());
    const gameTime = ref('00:00');

    const {
      gameSize,
      settings,
      setDefaultSettings,
      setLevel,
    } = useGameSettings();

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

      sizeY.value = settings.value.sizeY;
      sizeX.value = settings.value.sizeX;
      bombCount.value = settings.value.bombCount;

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

    const onInvalidGameConfigurationThrown = (msg) => {
      errorMessage.value = msg;
      gameLost.value = true;
      setDefaultSettings();
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
      settings,
      gameTime,
      onGameWon,
      onGameLost,
      onNewGameClick,
      setLevel,
      setDefaultSettings,
      onInvalidGameConfigurationThrown,
      isSettingsChanged: computed(() => {
        return bombCount.value !== settings.value.bombCount || sizeY.value !== settings.value.sizeY || sizeX.value !== settings.value.sizeX;
      }),
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

.game-won {
  font-size: 24px;
  font-weight: bold;
  color: #008700;
  margin: 10px 0;
}
</style>
