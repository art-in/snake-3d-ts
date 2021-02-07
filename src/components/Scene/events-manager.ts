import {changeSnakeDirection} from '../../state/actions/snake-actions';
import {EDirection} from '../../state/models/EDirection';
import State from '../../state/models/State';

export function handleControlEvents(state: State, window: Window): void {
  window.addEventListener('keydown', (event) => {
    let direction: EDirection | undefined;

    switch (event.code) {
      case 'ArrowUp':
        direction = EDirection.Up;
        break;
      case 'ArrowDown':
        direction = EDirection.Down;
        break;
      case 'ArrowLeft':
        direction = EDirection.Left;
        break;
      case 'ArrowRight':
        direction = EDirection.Right;
        break;
    }

    if (direction !== undefined) {
      changeSnakeDirection(state, direction);
    }
  });
}
