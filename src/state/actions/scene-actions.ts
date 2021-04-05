import assertNotEmpty from '../../helpers/assert-not-empty';
import State from '../models/State';
import * as cubeActions from './cube-actions';
import * as cubeSideActions from './cube-side-actions';

export function initSceneState(state: State, canvas: HTMLCanvasElement): void {
  const {scene} = state;

  scene.canvas = canvas;

  state.scene.cube.sides.forEach((side) => {
    cubeSideActions.initCubeSideState(state, side.side);
  });

  const ctx = canvas.getContext('webgl');
  assertNotEmpty(ctx, 'Failed to get webgl context');
  state.scene.ctx = ctx;
}

export function updateSceneCycle(state: State): void {
  cubeActions.autoRotateCycle(state);
}
