import {ECubeSide} from './ECubeSide';
import {EDirection} from './EDirection';
import {ICubePosition} from './IGridPosition';

export default class Snake {
  lastMoveTime?: number;

  parts = [new SnakePart({cubeSide: ECubeSide.Front, gridRow: 0, gridCol: 0})];
  direction = EDirection.Right;

  movePeriod = 150;
  crashed = false;
}

export class SnakePart {
  pos: ICubePosition;

  constructor(pos: ICubePosition) {
    this.pos = pos;
  }
}
