import {action} from 'mobx';
import clone from '../../helpers/clone';
import getOppositeDirection from '../../helpers/get-opposite-direction';
import normalizeDegrees from '../../helpers/normalize-degrees';
import {startOrPauseGame} from '../../state/actions/game-actions';
import {setSnakeDirection} from '../../state/actions/snake-actions';
import ECameraMode from '../../state/models/ECameraMode';
import ECubeSide from '../../state/models/ECubeSide';
import EDirection from '../../state/models/EDirection';
import EGameStatus from '../../state/models/EGameStatus';
import GameState from '../../state/models/GameState';

export function subscribeToControlEvents(
  state: GameState,
  window: Window
): void {
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

function onKeyDown(state: GameState, event: KeyboardEvent) {
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
    state.scene.cube.isDragging = true;
    state.scene.cube.cameraMode = ECameraMode.ManualControl;
  }
}

export function onMouseUp(state: GameState): void {
  const {cube} = state.scene;

  cube.isDragging = false;
  cube.pointerPosX = undefined;
  cube.pointerPosY = undefined;
}

export function onMouseMove(state: GameState, e: MouseEvent): void {
  const {cube} = state.scene;

  if (!cube.isDragging) {
    return;
  }

  if (e.which === 0) {
    // mouse button was released outside browser window
    onMouseUp(state);
    return;
  }

  if (cube.pointerPosX !== undefined && cube.pointerPosY !== undefined) {
    const dx = cube.pointerPosX - e.clientX;
    const dy = cube.pointerPosY - e.clientY;

    cube.targetRotation.x -= dy * 0.25;
    cube.targetRotation.y -= dx * 0.25;

    cube.targetRotation.x = normalizeDegrees(cube.targetRotation.x);
    cube.targetRotation.y = normalizeDegrees(cube.targetRotation.y);

    cube.currentRotation = clone(cube.targetRotation);

    cube.needsRedraw = true;
  }

  cube.pointerPosX = e.clientX;
  cube.pointerPosY = e.clientY;
}
