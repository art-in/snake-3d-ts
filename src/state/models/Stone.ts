import {ICubePosition} from './IGridPosition';

export default class Stone {
  pos: ICubePosition;

  constructor(pos: ICubePosition) {
    this.pos = pos;
  }
}
