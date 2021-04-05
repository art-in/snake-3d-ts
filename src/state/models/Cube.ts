import {makeAutoObservable} from 'mobx';
import CubeSide from './CubeSide';
import ECameraMode from './ECameraMode';
import {ECubeSide} from './ECubeSide';
import IGrid from './IGrid';
import IModelRotation from './IModelRotation';

export default class Cube {
  program?: WebGLProgram;
  snakePartProgram?: WebGLProgram;
  vertexCoordsBuffer?: WebGLBuffer;
  textureCoordsBuffer?: WebGLBuffer;

  textures?: WebGLTexture[];

  targetRotation: IModelRotation = {x: 0, y: 0};
  currentRotation: IModelRotation = {x: 0, y: 0};
  cameraMode: ECameraMode = ECameraMode.Overview;

  isDragging?: boolean;
  clientX?: number;
  clientY?: number;

  needsRedraw = true;

  grid: IGrid = {rowsCount: 16, colsCount: 16};

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
