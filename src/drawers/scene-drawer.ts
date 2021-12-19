import GameState from '../state/models/GameState';
import {drawCubeCycle, initCubeDrawer} from './cube-drawer/cube-drawer';
import {initCubeSideDrawer, drawCubeSideCycle} from './cube-side-drawer';

export function initSceneDrawer(
  state: GameState,
  canvas: HTMLCanvasElement
): void {
  const {scene} = state;
  scene.canvas = canvas;

  state.scene.cube.sides.forEach((side) => {
    initCubeSideDrawer(state, side.type);
  });

  initCubeDrawer(state);
}

export function drawSceneCycle(state: GameState): void {
  state.scene.cube.sides.forEach((side) => {
    drawCubeSideCycle(state, side.type);
  });

  drawCubeCycle(state);
}
