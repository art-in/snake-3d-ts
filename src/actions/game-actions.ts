import isEqualCubePositions from '../helpers/is-equal-cube-positions';
import getRandomCubePosition from '../helpers/get-random-cube-position';
import Snake from '../models/Snake';
import GameState from '../models/GameState';
import EGameStatus from '../models/EGameStatus';
import ECameraMode from '../models/ECameraMode';
import * as snakeActions from './snake-actions';
import * as cubeActions from './cube-actions';

const APPLES_COUNT = 10;
const STONES_COUNT = 10;

export function initGameState(state: GameState): void {
  state.status = EGameStatus.Welcome;
  plantObjects(state);
}

export function updateGameStateLoop(state: GameState): void {
  snakeActions.moveSnakeLoop(state);
  cubeActions.autoRotateLoop(state);

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

  // plant snake
  state.snake = new Snake();

  // plant apples
  state.apples = [];

  for (let i = 0; i < APPLES_COUNT; i++) {
    const pos = getRandomCubePosition(scene.cube);
    state.apples.push(pos);
  }

  // plant stones
  state.stones = [];

  while (state.stones.length < STONES_COUNT) {
    const pos = getRandomCubePosition(scene.cube);

    // do not place stones above apples
    if (state.apples.every((a) => !isEqualCubePositions(a, pos))) {
      state.stones.push(pos);
    }
  }

  state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
}

export function startOrPauseGame(state: GameState): void {
  switch (state.status) {
    case EGameStatus.Welcome:
    case EGameStatus.Paused:
      state.status = EGameStatus.InGame;
      break;
    case EGameStatus.Win:
    case EGameStatus.Fail:
      plantObjects(state);
      state.status = EGameStatus.InGame;
      break;
    case EGameStatus.InGame:
      state.status = EGameStatus.Paused;
  }

  if (state.status === EGameStatus.InGame) {
    state.scene.cube.cameraMode = ECameraMode.FollowSnake;
  } else {
    state.scene.cube.cameraMode = ECameraMode.Overview;
  }

  state.scene.cube.sides.forEach((side) => (side.needsRedraw = true));
}
