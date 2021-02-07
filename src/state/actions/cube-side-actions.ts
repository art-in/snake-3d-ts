import assertNotEmpty from '../../helpers/assertNotEmpty';
import resizeCanvas from '../../helpers/resizeCanvas';
import {ECubeSide} from '../models/ECubeSide';
import ISize from '../models/ISize';
import State from '../models/State';

export function initCubeSideState(state: State, side: ECubeSide): void {
  const canvas = document.createElement('canvas');

  const size: ISize = {
    width: 300,
    height: 300,
  };
  resizeCanvas(canvas, size, devicePixelRatio);

  const ctx = canvas.getContext('2d');
  assertNotEmpty(ctx);

  ctx.scale(devicePixelRatio, devicePixelRatio);

  state.scene.cube.sides[side].canvas = canvas;
  state.scene.cube.sides[side].ctx = ctx;
  state.scene.cube.sides[side].needsRedraw = true;
  state.scene.cube.sides[side].needsUpdateOnCube = true;
}
