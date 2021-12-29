import Cube from './Cube';

export default class Scene {
  canvas: HTMLCanvasElement | undefined;
  ctx: WebGLRenderingContext | undefined;

  cube = new Cube();
}
