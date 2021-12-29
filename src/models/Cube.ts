import {makeAutoObservable} from 'mobx';
import CubeSide from './CubeSide';
import ECameraMode from './ECameraMode';
import ECubeSide from './ECubeSide';
import IGrid from './IGrid';
import IModelRotation from './IModelRotation';
import IPoint2D from './IPoint2D';

export default class Cube {
  program?: WebGLProgram;
  matrixUniformLocation?: WebGLUniformLocation;
  textures?: WebGLTexture[];

  targetRotation: IModelRotation = {x: 0, y: 0};
  currentRotation: IModelRotation = {x: 0, y: 0};

  cameraMode: ECameraMode = ECameraMode.Overview;

  mouseIsDragging?: boolean;
  mousePos?: IPoint2D;

  needsRedraw = true;

  static GRID_SIZE = 16;
  grid: IGrid = {rowsCount: Cube.GRID_SIZE, colsCount: Cube.GRID_SIZE};

  sides: CubeSide[] = [];

  [ECubeSide.Front]: CubeSide;
  [ECubeSide.Back]: CubeSide;
  [ECubeSide.Up]: CubeSide;
  [ECubeSide.Down]: CubeSide;
  [ECubeSide.Left]: CubeSide;
  [ECubeSide.Right]: CubeSide;

  constructor() {
    makeAutoObservable(this);

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
