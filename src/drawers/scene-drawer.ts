import GameState from '../models/GameState';
import {drawCubeLoop, initCubeDrawer} from './cube-drawer/cube-drawer';
import {initCubeSideDrawer, drawCubeSideLoop} from './cube-side-drawer';

export function initSceneDrawer(
  state: GameState,
  canvas: HTMLCanvasElement
): void {
  state.scene.canvas = canvas;

  state.scene.cube.sides.forEach((side) => {
    initCubeSideDrawer(state, side.type);
  });

  initCubeDrawer(state);
}

export function drawSceneLoop(state: GameState): void {
  state.scene.cube.sides.forEach((side) => {
    drawCubeSideLoop(state, side.type);
  });

  drawCubeLoop(state);
}
