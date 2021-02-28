import assertNotEmpty from '../../helpers/assertNotEmpty';
import resizeCanvas from '../../helpers/resizeCanvas';
import {ECubeSide} from '../models/ECubeSide';
import ISize from '../models/ISize';
import State from '../models/State';

export function initCubeSideState(state: State, side: ECubeSide): void {
  const canvas = document.createElement('canvas');

  canvas.width = 2 ** 9;
  canvas.height = 2 ** 9;

  const ctx = canvas.getContext('2d');
  assertNotEmpty(ctx);

  state.scene.cube.sides[side].canvas = canvas;
  state.scene.cube.sides[side].ctx = ctx;
  state.scene.cube.sides[side].needsRedraw = true;
  state.scene.cube.sides[side].needsUpdateOnCube = true;
}
