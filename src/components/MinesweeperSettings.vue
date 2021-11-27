<template>
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
        <button class="btn" type="button" @click.prevent="onDecreaseGameSizeClick">-</button>&nbsp;{{ gameSize }}&nbsp;<button
          class="btn" type="button" @click.prevent="onIncreaseGameSizeClick">+
      </button>
      </td>
      <td rowspan="3">
        <button type="button" class="btn" @click.prevent="onSetDefaultSettingsClick">Ustaw<br/>domyślne</button>
      </td>
    </tr>
    <tr>
      <th>Rozmiar pola gry:</th>
      <td>Wysokość: <input type="number" v-model="sizeY" @blur.prevent="onBlurSizeY"/><br/>Szerokość:
        <input type="number"
               v-model="sizeX"
               @blur.prevent="onBlurSizeX"/></td>
    </tr>
    <tr>
      <th>Liczba bomb:</th>
      <td>&nbsp;<button class="btn" type="button" @click.prevent="onDecreaseBombCountClick">-</button>
        <input type="text" v-model="bombCount" @blur.prevent="onBlurBombCount" class="bomb-count"/>
        <button class="btn" type="button" @click.prevent="onIncreaseBombCountClick">
          +
        </button>
      </td>
    </tr>
    <tr>
      <td colspan="3" style="text-align: center">
        <button type="button" class="btn" @click.prevent="onSetLevelClick(1)">Łatwy</button>
        <button type="button" class="btn" @click.prevent="onSetLevelClick(2)">Średni</button>
        <button type="button" class="btn" @click.prevent="onSetLevelClick(3)">Ekspert</button>
      </td>
    </tr>
    </tbody>
    <tfoot v-if="settingsChanged">
    <tr>
      <td colspan="3">Rozpocznij nową grę aby zastosować ustawienia</td>
    </tr>
    </tfoot>
  </table>
</template>

<script>
import {ref, toRef} from 'vue';
import useGameSettingsValidators from '../composables/useGameSettingsValidators';

export default {
  name: 'MinesweeperSettings',
  props: {
    gameSize: {
      type: Number,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
    settingsChanged: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:settings', 'update:gameSize', 'setDefault', 'setLevel'],
  setup(props, {emit}) {
    const gameSize = toRef(props, 'gameSize');
    const settings = toRef(props, 'settings');
    const sizeY = ref(settings.value.sizeY);
    const sizeX = ref(settings.value.sizeX);
    const bombCount = ref(settings.value.bombCount);
    const settingsChanged = toRef(props, 'settingsChanged');

    const {
      validateBombCount,
      validateSizeY,
      validateSizeX,
    } = useGameSettingsValidators();

    const onSetDefaultSettingsClick = () => {
      emit('setDefault');
    };

    const onSetLevelClick = (level) => {
      emit('setLevel', level);
    };

    const onDecreaseGameSizeClick = () => {
      emit('update:gameSize', --gameSize.value);
    };
    const onIncreaseGameSizeClick = () => {
      emit('update:gameSize', ++gameSize.value);
    };

    const onDecreaseBombCountClick = () => {
      emit('update:settings', {...settings.value, bombCount: --settings.value.bombCount});
    };
    const onIncreaseBombCountClick = () => {
      emit('update:settings', {...settings.value, bombCount: ++settings.value.bombCount});
    };

    const onBlurBombCount = () => {
      bombCount.value = validateBombCount(bombCount.value);
      emit('update:settings', {...settings.value, bombCount: bombCount.value});
    };
    const onBlurSizeY = () => {
      sizeY.value = validateSizeY(sizeY.value);
      emit('update:settings', {...settings.value, sizeY: sizeY.value});
    };
    const onBlurSizeX = () => {
      sizeX.value = validateSizeX(sizeX.value);
      emit('update:settings', {...settings.value, sizeX: sizeX.value});
    };

    return {
      gameSize,
      sizeY,
      sizeX,
      bombCount,
      settingsChanged,
      onSetDefaultSettingsClick,
      onDecreaseGameSizeClick,
      onIncreaseGameSizeClick,
      onDecreaseBombCountClick,
      onIncreaseBombCountClick,
      onBlurBombCount,
      onBlurSizeY,
      onBlurSizeX,
      onSetLevelClick,
    }
  },
}
</script>

<style scoped>
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
</style>
