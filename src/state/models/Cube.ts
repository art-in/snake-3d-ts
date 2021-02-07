import CubeSide from './CubeSide';
import {ECubeSide} from './ECubeSide';

export default class Cube {
  sides: CubeSide[] = [];

  [ECubeSide.Front]: CubeSide;
  [ECubeSide.Back]: CubeSide;
  [ECubeSide.Up]: CubeSide;
  [ECubeSide.Down]: CubeSide;
  [ECubeSide.Left]: CubeSide;
  [ECubeSide.Right]: CubeSide;

  constructor() {
    const front = new CubeSide(ECubeSide.Front);
    const back = new CubeSide(ECubeSide.Back);
    const up = new CubeSide(ECubeSide.Up);
    const down = new CubeSide(ECubeSide.Down);
    const left = new CubeSide(ECubeSide.Left);
    const right = new CubeSide(ECubeSide.Right);

    this.sides.push(...[front, back, up, down, left, right]);

    this[ECubeSide.Front] = front;
    this[ECubeSide.Back] = back;
    this[ECubeSide.Up] = up;
    this[ECubeSide.Down] = down;
    this[ECubeSide.Left] = left;
    this[ECubeSide.Right] = right;
  }
}
