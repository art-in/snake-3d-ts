import {action} from 'mobx';
import clone from '../../helpers/clone';
import getOppositeDirection from '../../helpers/get-opposite-direction';
import normalizeDegrees from '../../helpers/normalize-degrees';
import {startOrPauseGame} from '../../state/actions/game-actions';
import {setSnakeDirection} from '../../state/actions/snake-actions';
import ECameraMode from '../../state/models/ECameraMode';
import {ECubeSide} from '../../state/models/ECubeSide';
import {EDirection} from '../../state/models/EDirection';
import EGameStatus from '../../state/models/EGameStatus';
import State from '../../state/models/State';

export function subscribeToControlEvents(state: State, window: Window): void {
  window.addEventListener(
    'keydown',
    action((event) => onKeyDown(state, event))
  );
  window.addEventListener(
    'mousedown',
    action(() => onMouseDown(state))
  );
  window.addEventListener(
    'mouseup',
    action(() => onMouseUp(state))
  );
  window.addEventListener(
    'mousemove',
    action((event) => onMouseMove(state, event))
  );
}

function onKeyDown(state: State, event: KeyboardEvent) {
  let direction: EDirection | undefined;

  switch (event.code) {
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
    const headPos = state.snake.parts[0].pos;
    const grid = state.scene.cube.grid;

    // adjust direction per current camera rotation
    if (
      (headPos.cubeSide === ECubeSide.Up &&
        headPos.gridRow >= grid.rowsCount / 2) ||
      (headPos.cubeSide === ECubeSide.Down &&
        headPos.gridRow < grid.rowsCount / 2)
    ) {
      direction = getOppositeDirection(direction);
    }

    setSnakeDirection(state, direction);
  }
}

export function onMouseDown(state: State): void {
  if (state.status !== EGameStatus.InGame) {
    state.scene.cube.isDragging = true;
    state.scene.cube.cameraMode = ECameraMode.ManualControl;
  }
}

export function onMouseUp(state: State): void {
  const {cube} = state.scene;

  cube.isDragging = false;
  cube.clientX = undefined;
  cube.clientY = undefined;
}

export function onMouseMove(state: State, e: MouseEvent): void {
  const {cube} = state.scene;

  if (!cube.isDragging) {
    return;
  }

  if (e.which === 0) {
    // mouse button was released outside browser window
    onMouseUp(state);
    return;
  }

  if (cube.clientX !== undefined && cube.clientY !== undefined) {
    const dx = cube.clientX - e.clientX;
    const dy = cube.clientY - e.clientY;

    cube.targetRotation.x -= dy * 0.25;
    cube.targetRotation.y -= dx * 0.25;

    cube.targetRotation.x = normalizeDegrees(cube.targetRotation.x);
    cube.targetRotation.y = normalizeDegrees(cube.targetRotation.y);

    cube.currentRotation = clone(cube.targetRotation);

    cube.needsRedraw = true;
  }

  cube.clientX = e.clientX;
  cube.clientY = e.clientY;
}
