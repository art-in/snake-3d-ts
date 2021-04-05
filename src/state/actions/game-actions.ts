import Apple from '../models/Apple';
import Snake from '../models/Snake';
import State from '../models/State';
import Stone from '../models/Stone';
import * as snakeActions from './snake-actions';
import * as sceneActions from './scene-actions';
import EGameStatus from '../models/EGameStatus';
import isEqualCubePositions from '../../helpers/is-equal-cube-positions';
import getRandomCubePosition from '../../helpers/get-random-cube-position';
import ECameraMode from '../models/ECameraMode';

const APPLES_COUNT = 10;
const STONES_COUNT = 10;

export function initGameState(state: State, canvas: HTMLCanvasElement): void {
  sceneActions.initSceneState(state, canvas);

  state.status = EGameStatus.Welcome;
  plantObjects(state);
}

export function updateGameStateCycle(state: State): void {
  snakeActions.moveSnakeCycle(state);
  sceneActions.updateSceneCycle(state);

  if (state.status === EGameStatus.InGame) {
    if (state.snake.crashed) {
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

export function plantObjects(state: State): void {
  const {scene} = state;
  state.snake = new Snake();

  // plant apples
  const apples: Apple[] = [];

  for (let i = 0; i < APPLES_COUNT; i++) {
    const pos = getRandomCubePosition(scene.cube);
    apples.push(new Apple(pos));
  }

  state.apples = apples;

  // plant stones
  const stones: Stone[] = [];

  while (stones.length < STONES_COUNT) {
    const pos = getRandomCubePosition(scene.cube);

    // do not place stones above apples
    if (apples.every((a) => !isEqualCubePositions(a.pos, pos))) {
      stones.push(new Stone(pos));
    }
  }

  state.stones = stones;

  state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
}

export function startOrPauseGame(state: State): void {
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
