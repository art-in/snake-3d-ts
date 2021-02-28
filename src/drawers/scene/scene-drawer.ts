import State from '../../state/models/State';
import {initCubeDrawer, drawCubeCycle} from './cube-drawer';

export function initSceneDrawer(state: State): void {
  initCubeDrawer(state);
}

export function drawSceneCycle(state: State): void {
  drawCubeCycle(state);
}
