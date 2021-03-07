import State from '../state/models/State';
import {drawCubeCycle, initCubeDrawer} from './cube-drawer/cube-drawer';
import {drawCubeSideCycle} from './cube-side-drawer';

export function initSceneDrawer(state: State): void {
  initCubeDrawer(state);
}

export function drawSceneCycle(state: State): void {
  state.scene.cube.sides.forEach((side) => {
    drawCubeSideCycle(state, side.side);
  });

  drawCubeCycle(state);
}
