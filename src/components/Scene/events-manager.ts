import clone from '../../helpers/clone';
import normalizeDegrees from '../../helpers/normalize-degrees';
import {
  changeSnakeDirection,
  moveSnake,
} from '../../state/actions/snake-actions';
import {ECubeSide} from '../../state/models/ECubeSide';
import {EDirection} from '../../state/models/EDirection';
import State from '../../state/models/State';

export function handleControlEvents(state: State, window: Window): void {
  window.addEventListener('keydown', (event) => onKeyDown(state, event));
  window.addEventListener('mousedown', () => onWindowMouseDown(state));
  window.addEventListener('mouseup', () => onWindowMouseUp(state));
  window.addEventListener('mousemove', (event) =>
    onWindowMouseMove(state, event)
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
  }

  if (direction !== undefined) {
    const headPos = state.scene.snake.parts[0].pos;
    const grid = state.scene.grid;
    if (
      (headPos.cubeSide === ECubeSide.Up &&
        headPos.gridRow >= grid.rowsCount / 2) ||
      (headPos.cubeSide === ECubeSide.Down &&
        headPos.gridRow < grid.rowsCount / 2)
    ) {
      direction = getOppositeDirection(direction);
    }

    changeSnakeDirection(state, direction);
    moveSnake(state);
  }
}

function getOppositeDirection(direction: EDirection): EDirection {
  switch (direction) {
    case EDirection.Up:
      return EDirection.Down;
    case EDirection.Down:
      return EDirection.Up;
    case EDirection.Left:
      return EDirection.Right;
    case EDirection.Right:
      return EDirection.Left;
  }
}

export function onWindowMouseDown(state: State): void {
  state.scene.isDragging = true;
}

export function onWindowMouseUp(state: State): void {
  const {scene} = state;

  scene.isDragging = false;
  scene.clientX = undefined;
  scene.clientY = undefined;
}

export function onWindowMouseMove(state: State, e: MouseEvent): void {
  const {scene} = state;

  if (!scene.isDragging) {
    return;
  }

  if (e.which === 0) {
    // mouse button was released outside browser window
    onWindowMouseUp(state);
    return;
  }

  if (scene.clientX !== undefined && scene.clientY !== undefined) {
    const dx = scene.clientX - e.clientX;
    const dy = scene.clientY - e.clientY;

    scene.targetRotationDeg.x -= Math.round(dy * 0.5);
    scene.targetRotationDeg.y -= Math.round(dx * 0.5);

    scene.targetRotationDeg.x = normalizeDegrees(scene.targetRotationDeg.x);
    scene.targetRotationDeg.y = normalizeDegrees(scene.targetRotationDeg.y);

    scene.currentRotationDeg = clone(scene.targetRotationDeg);

    scene.needsRedraw = true;
  }

  scene.clientX = e.clientX;
  scene.clientY = e.clientY;
}
