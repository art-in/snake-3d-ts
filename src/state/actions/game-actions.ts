import Snake from '../models/Snake';
import GameState from '../models/GameState';
import * as snakeActions from './snake-actions';
import * as sceneActions from './scene-actions';
import EGameStatus from '../models/EGameStatus';
import isEqualCubePositions from '../../helpers/is-equal-cube-positions';
import getRandomCubePosition from '../../helpers/get-random-cube-position';
import ECameraMode from '../models/ECameraMode';
import ICubePosition from '../models/ICubePosition';

const APPLES_COUNT = 10;
const STONES_COUNT = 10;

export function initGameState(state: GameState): void {
  state.status = EGameStatus.Welcome;
  plantObjects(state);
}

export function updateGameStateCycle(state: GameState): void {
  snakeActions.moveSnakeCycle(state);
  sceneActions.updateSceneCycle(state);

  if (state.status === EGameStatus.InGame) {
    if (state.snake.isCrashed) {
      state.status = EGameStatus.Fail;
      state.scene.cube.cameraMode = ECameraMode.Overview;
      state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
    }

    if (state.apples.length === 0) {
      state.status = EGameStatus.Win;
      state.scene.cube.cameraMode = ECameraMode.Overview;
      state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
    }
  }
}

export function plantObjects(state: GameState): void {
  const {scene} = state;
  state.snake = new Snake();

  // plant apples
  const apples: ICubePosition[] = [];

  for (let i = 0; i < APPLES_COUNT; i++) {
    const pos = getRandomCubePosition(scene.cube);
    apples.push(pos);
  }

  state.apples = apples;

  // plant stones
  const stones: ICubePosition[] = [];

  while (stones.length < STONES_COUNT) {
    const pos = getRandomCubePosition(scene.cube);

    // do not place stones above apples
    if (apples.every((a) => !isEqualCubePositions(a, pos))) {
      stones.push(pos);
    }
  }

  state.stones = stones;

  state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
}

export function startOrPauseGame(state: GameState): void {
  if (state.status === EGameStatus.Welcome) {
    state.status = EGameStatus.InGame;
  } else if (
    state.status === EGameStatus.Win ||
    state.status === EGameStatus.Fail
  ) {
    plantObjects(state);
    state.status = EGameStatus.InGame;
  } else if (state.status === EGameStatus.Paused) {
    state.status = EGameStatus.InGame;
  } else if (state.status === EGameStatus.InGame) {
    state.status = EGameStatus.Paused;
  }

  if (state.status === EGameStatus.InGame) {
    state.scene.cube.cameraMode = ECameraMode.FollowSnake;
  } else {
    state.scene.cube.cameraMode = ECameraMode.Overview;
  }

  state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
}
