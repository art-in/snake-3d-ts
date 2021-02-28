import State from '../models/State';
import Snake, {SnakePart} from '../models/Snake';
import Grid from '../models/Grid';
import assertNotEmpty from '../../helpers/assertNotEmpty';
import {EDirection} from '../models/EDirection';
import clone from '../../helpers/clone';
import {ECubeSide} from '../models/ECubeSide';
import getModelRotationForCubePosition from './get-model-rotation-for-cube-position';

const SNAKE_MOVE_PERIOD = 100; // ms

export function moveSnakeCycle(state: State): void {
  const {snake} = state.scene;
  if (
    snake.lastMoveTime === undefined ||
    performance.now() - snake.lastMoveTime >= SNAKE_MOVE_PERIOD
  ) {
    moveSnake(state);
    snake.lastMoveTime = performance.now();
  }
}

export function moveSnake(state: State): void {
  const {grid, snake} = state.scene;

  const head = snake.parts[0];
  const tail = snake.parts.pop();

  state.scene.cube[head.pos.cubeSide].needsRedraw = true;

  assertNotEmpty(tail);

  tail.pos.gridRow = head.pos.gridRow;
  tail.pos.gridCol = head.pos.gridCol;
  tail.pos.cubeSide = head.pos.cubeSide;

  switch (snake.direction) {
    case EDirection.Up:
      tail.pos.gridRow += 1;
      break;
    case EDirection.Down:
      tail.pos.gridRow -= 1;
      break;
    case EDirection.Left:
      tail.pos.gridCol -= 1;
      break;
    case EDirection.Right:
      tail.pos.gridCol += 1;
      break;
  }

  snake.parts.unshift(tail);
  ensureSideBounds(grid, snake);

  checkForApple(state);

  state.scene.targetRotationDeg = getModelRotationForCubePosition(
    snake.parts[0].pos,
    state.scene.grid
  );
  state.scene.cube[head.pos.cubeSide].needsRedraw = true;
  state.scene.cube[tail.pos.cubeSide].needsRedraw = true;
}

function ensureSideBounds(grid: Grid, snake: Snake): void {
  assertNotEmpty(grid.rowsCount);
  assertNotEmpty(grid.colsCount);

  const head = snake.parts[0];
  const pos = head.pos;

  // falling off the up edge
  if (pos.gridRow >= grid.rowsCount) {
    switch (pos.cubeSide) {
      case ECubeSide.Front:
        pos.cubeSide = ECubeSide.Up;
        pos.gridRow = 0;
        break;
      case ECubeSide.Back:
        pos.cubeSide = ECubeSide.Up;
        snake.direction = EDirection.Down;
        pos.gridCol = grid.colsCount - pos.gridCol - 1;
        pos.gridRow = grid.rowsCount - 1;
        break;
      case ECubeSide.Up:
        pos.cubeSide = ECubeSide.Back;
        snake.direction = EDirection.Down;
        pos.gridCol = grid.colsCount - pos.gridCol - 1;
        pos.gridRow = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        pos.cubeSide = ECubeSide.Front;
        pos.gridRow = 0;
        break;
      case ECubeSide.Left:
        pos.cubeSide = ECubeSide.Up;
        snake.direction = EDirection.Right;
        pos.gridRow = grid.rowsCount - pos.gridCol - 1;
        pos.gridCol = 0;
        break;
      case ECubeSide.Right:
        pos.cubeSide = ECubeSide.Up;
        snake.direction = EDirection.Left;
        pos.gridRow = pos.gridCol;
        pos.gridCol = grid.colsCount - 1;
        break;
    }
  }

  // falling off the down edge
  if (pos.gridRow < 0) {
    switch (pos.cubeSide) {
      case ECubeSide.Front:
        pos.cubeSide = ECubeSide.Down;
        pos.gridRow = grid.colsCount - 1;
        break;
      case ECubeSide.Back:
        pos.cubeSide = ECubeSide.Down;
        snake.direction = EDirection.Up;
        pos.gridCol = grid.colsCount - pos.gridCol - 1;
        pos.gridRow = 0;
        break;
      case ECubeSide.Up:
        pos.cubeSide = ECubeSide.Front;
        pos.gridRow = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        pos.cubeSide = ECubeSide.Back;
        snake.direction = EDirection.Up;
        pos.gridCol = grid.colsCount - pos.gridCol - 1;
        pos.gridRow = 0;
        break;
      case ECubeSide.Left:
        pos.cubeSide = ECubeSide.Down;
        snake.direction = EDirection.Right;
        pos.gridRow = pos.gridCol;
        pos.gridCol = 0;
        break;
      case ECubeSide.Right:
        pos.cubeSide = ECubeSide.Down;
        snake.direction = EDirection.Left;
        pos.gridRow = grid.rowsCount - pos.gridCol - 1;
        pos.gridCol = grid.colsCount - 1;
        break;
    }
  }

  // falling off the right edge
  if (pos.gridCol >= grid.colsCount) {
    switch (pos.cubeSide) {
      case ECubeSide.Front:
        pos.cubeSide = ECubeSide.Right;
        pos.gridCol = 0;
        break;
      case ECubeSide.Back:
        pos.cubeSide = ECubeSide.Left;
        pos.gridCol = 0;
        break;
      case ECubeSide.Up:
        pos.cubeSide = ECubeSide.Right;
        snake.direction = EDirection.Down;
        pos.gridCol = pos.gridRow;
        pos.gridRow = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        pos.cubeSide = ECubeSide.Right;
        snake.direction = EDirection.Up;
        pos.gridCol = grid.rowsCount - pos.gridRow - 1;
        pos.gridRow = 0;
        break;
      case ECubeSide.Left:
        pos.cubeSide = ECubeSide.Front;
        pos.gridCol = 0;
        break;
      case ECubeSide.Right:
        pos.cubeSide = ECubeSide.Back;
        pos.gridCol = 0;
        break;
    }
  }

  // falling off the left edge
  if (pos.gridCol < 0) {
    switch (pos.cubeSide) {
      case ECubeSide.Front:
        pos.cubeSide = ECubeSide.Left;
        pos.gridCol = grid.colsCount - 1;
        break;
      case ECubeSide.Back:
        pos.cubeSide = ECubeSide.Right;
        pos.gridCol = grid.colsCount - 1;
        break;
      case ECubeSide.Up:
        pos.cubeSide = ECubeSide.Left;
        snake.direction = EDirection.Down;
        pos.gridCol = grid.colsCount - pos.gridRow - 1;
        pos.gridRow = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        pos.cubeSide = ECubeSide.Left;
        snake.direction = EDirection.Up;
        pos.gridCol = pos.gridRow;
        pos.gridRow = 0;
        break;
      case ECubeSide.Left:
        pos.cubeSide = ECubeSide.Back;
        pos.gridCol = grid.colsCount - 1;
        break;
      case ECubeSide.Right:
        pos.cubeSide = ECubeSide.Front;
        pos.gridCol = grid.colsCount - 1;
        break;
    }
  }
}

export function changeSnakeDirection(
  state: State,
  direction: EDirection
): void {
  state.scene.snake.direction = direction;
}

export function checkForApple(state: State): void {
  const {snake, apples} = state.scene;

  const head = snake.parts[0];
  const tail = snake.parts[snake.parts.length - 1];

  for (let i = 0; i < apples.length; i++) {
    const apple = apples[i];

    if (
      apple.pos.gridRow === head.pos.gridRow &&
      apple.pos.gridCol === head.pos.gridCol
    ) {
      apples.splice(i, 1);

      snake.parts.push(new SnakePart(clone(tail.pos)));
    }
  }
}
