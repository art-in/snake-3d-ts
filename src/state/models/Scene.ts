import {degToRad} from '../../helpers';
import Apple from './Apple';
import Cube from './Cube';
import Grid from './Grid';
import IModelRotationDeg from './IModelRotationDeg';
import Snake from './Snake';

export default class Scene {
  canvas: HTMLCanvasElement | undefined;
  ctx: WebGLRenderingContext | undefined;

  program?: WebGLProgram;
  littleCubeProgram?: WebGLProgram;
  matrixLocation?: WebGLUniformLocation | null;
  cubeVertexCoordsBuffer?: WebGLBuffer;
  cubeTextureCoordsBuffer?: WebGLBuffer;

  cubeTextures?: WebGLTexture[];

  fieldOfViewRad: number = degToRad(60);

  targetRotationDeg: IModelRotationDeg = {x: 0, y: 0};
  currentRotationDeg: IModelRotationDeg = {x: 0, y: 0};

  isDragging?: boolean;
  clientX?: number;
  clientY?: number;

  grid = new Grid();
  snake = new Snake();
  apples: Apple[] = [];

  cube = new Cube();

  needsRedraw = true;
}
