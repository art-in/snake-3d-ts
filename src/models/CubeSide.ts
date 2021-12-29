import ECubeSide from './ECubeSide';

export default class CubeSide {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  type: ECubeSide;

  needsRedraw = true;
  needsUpdateOnCube = true;

  constructor(side: ECubeSide) {
    this.type = side;
  }
}
