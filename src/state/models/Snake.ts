import ECubeSide from './ECubeSide';
import EDirection from './EDirection';
import ICubePosition from './ICubePosition';

export default class Snake {
  lastMoveTime?: number;
  parts: ICubePosition[] = [{side: ECubeSide.Front, row: 0, col: 0}];
  direction = EDirection.Right;
  movePeriod = 150;
  isCrashed = false;
}
