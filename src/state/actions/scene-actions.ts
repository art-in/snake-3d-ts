import assertNotEmpty from '../../helpers/assertNotEmpty';
import State from '../models/State';
import {initCubeSideState} from './cube-side-actions';
import {moveSnakeCycle} from './snake-actions';

export function initSceneState(state: State, canvas: HTMLCanvasElement): void {
  const {scene} = state;

  scene.canvas = canvas;

  state.scene.cube.sides.forEach((side) => {
    initCubeSideState(state, side.side);
  });

  const ctx = canvas.getContext('webgl');
  assertNotEmpty(ctx, 'Failed to get webgl context');
  state.scene.ctx = ctx;
}

export function updateSceneCycle(state: State): void {
  moveSnakeCycle(state);
}
