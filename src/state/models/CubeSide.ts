import {ECubeSide} from './ECubeSide';
export default class CubeSide {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  side: ECubeSide;

  needsRedraw = true;
  needsUpdateOnCube = true;

  constructor(side: ECubeSide) {
    this.side = side;
  }
}
