import clone from '../helpers/clone';
import getOppositeDirection from '../helpers/get-opposite-direction';
import normalizeDegrees from '../helpers/normalize-degrees';
import ECameraMode from '../models/ECameraMode';
import ECubeSide from '../models/ECubeSide';
import EDirection from '../models/EDirection';
import EGameStatus from '../models/EGameStatus';
import GameState from '../models/GameState';
import IPoint2D from '../models/IPoint2D';
import {startOrPauseGame} from './game-actions';
import {setSnakeDirection} from './snake-actions';

export function onKeyDown(state: GameState, keyCode: string): void {
  let direction: EDirection | undefined;

  switch (keyCode) {
    case 'ArrowUp':
    case 'KeyW':
      direction = EDirection.Up;
      break;
    case 'ArrowDown':
    case 'KeyS':
      direction = EDirection.Down;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      direction = EDirection.Left;
      break;
    case 'ArrowRight':
    case 'KeyD':
      direction = EDirection.Right;
      break;
    case 'Space':
    case 'Enter':
      startOrPauseGame(state);
      break;
  }

  if (direction !== undefined) {
    const headPos = state.snake.parts[0];
    const grid = state.scene.cube.grid;

    // adjust direction per current camera rotation
    if (
      (headPos.side === ECubeSide.Up && headPos.row >= grid.rowsCount / 2) ||
      (headPos.side === ECubeSide.Down && headPos.row < grid.rowsCount / 2)
    ) {
      direction = getOppositeDirection(direction);
    }

    setSnakeDirection(state, direction);
  }
}

export function onMouseDown(state: GameState): void {
  if (state.status !== EGameStatus.InGame) {
    state.scene.cube.mouseIsDragging = true;
    state.scene.cube.cameraMode = ECameraMode.ManualControl;
  }
}

export function onMouseUp(state: GameState): void {
  const {cube} = state.scene;

  cube.mouseIsDragging = false;
  cube.mousePos = undefined;
}

export function onMouseMove(state: GameState, mousePos: IPoint2D): void {
  const {cube} = state.scene;

  if (!cube.mouseIsDragging) {
    return;
  }

  if (cube.mousePos != undefined) {
    const dx = cube.mousePos.x - mousePos.x;
    const dy = cube.mousePos.y - mousePos.y;

    cube.targetRotation.x -= dy * 0.25;
    cube.targetRotation.y -= dx * 0.25;

    cube.targetRotation.x = normalizeDegrees(cube.targetRotation.x);
    cube.targetRotation.y = normalizeDegrees(cube.targetRotation.y);

    cube.currentRotation = clone(cube.targetRotation);

    cube.needsRedraw = true;
  }

  cube.mousePos = mousePos;
}
