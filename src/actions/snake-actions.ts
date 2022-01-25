import assertNotEmpty from '../helpers/assert-not-empty';
import clone from '../helpers/clone';
import getOppositeDirection from '../helpers/get-opposite-direction';
import isEqualCubePositions from '../helpers/is-equal-cube-positions';
import getNextCubePositionAndDirection from '../helpers/get-next-cube-position-and-direction';
import GameState from '../models/GameState';
import EDirection from '../models/EDirection';
import EGameStatus from '../models/EGameStatus';

const SNAKE_MOVE_PERIOD_MULTIPLIER = 0.05; // higher is faster
const MOVE_SNAKE = true; // for debug

export function moveSnakeLoop(state: GameState): void {
  const {snake} = state;
  if (
    MOVE_SNAKE &&
    state.status === EGameStatus.InGame &&
    (snake.lastMoveTime === undefined ||
      performance.now() - snake.lastMoveTime >= snake.movePeriod)
  ) {
    moveSnake(state);
    snake.lastMoveTime = performance.now();
  }
}

export function moveSnake(state: GameState): void {
  const {scene, snake} = state;
  const {grid} = scene.cube;

  // instead of moving each snake part one step ahead, move tail to new head
  let head = snake.parts[0];
  let tail = snake.parts.pop();

  assertNotEmpty(tail);

  scene.cube[tail.side].needsRedraw = true;

  const {nextPos, nextDirection} = getNextCubePositionAndDirection(
    head,
    snake.direction,
    grid
  );
  tail = nextPos;
  snake.direction = nextDirection;

  snake.parts.unshift(tail);

  head = snake.parts[0];

  scene.cube[head.side].needsRedraw = true;

  checkForApple(state);
  checkCrash(state);
}

export function setSnakeDirection(
  state: GameState,
  direction: EDirection
): void {
  if (state.snake.direction === getOppositeDirection(direction)) {
    return;
  }

  state.snake.direction = direction;
}

export function checkForApple(state: GameState): void {
  const {snake, apples} = state;

  const head = snake.parts[0];
  const tail = snake.parts[snake.parts.length - 1];

  for (let i = 0; i < apples.length; i++) {
    const apple = apples[i];

    if (isEqualCubePositions(apple, head)) {
      apples.splice(i, 1);
      snake.parts.push(clone(tail));

      snake.movePeriod *= 1 - SNAKE_MOVE_PERIOD_MULTIPLIER;
    }
  }
}

export function checkCrash(state: GameState): void {
  const {snake, stones} = state;

  const head = snake.parts[0];

  // crash on stone
  for (const stone of stones) {
    if (isEqualCubePositions(stone, head)) {
      snake.isCrashed = true;
      break;
    }
  }

  // crash on tail
  for (let i = 3; i < snake.parts.length; i++) {
    const part = snake.parts[i];
    if (isEqualCubePositions(part, head)) {
      snake.isCrashed = true;
      break;
    }
  }
}
