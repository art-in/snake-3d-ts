import assertNotEmpty from '../helpers/assert-not-empty';
import getCanvasFontString from '../helpers/get-canvas-font-string';
import getCubeSideLabel from '../helpers/get-cube-side-label';
import measureCanvasText from '../helpers/measure-canvas-text';
import ECubeSide from '../models/ECubeSide';
import EGameStatus from '../models/EGameStatus';
import GameState from '../models/GameState';

const DRAW_SIDE_LABELS = false;

// sides are drawn in 2D context and passed as textures to 3D cube.
// this is not very performant approach, since we need to upload entire side
// image when something small changes on it. faster wound be to upload object
// positions only and draw them as separate 3D entities, textures untouched.
// I've dodged this approach because I guess it would be harder to code, while
// I want it to be as basic as possible without diving into 3D coding hell
// (for that I would chose some 3D library) ie. need to calculate 3D positions
// for all objects, apply different textures for different objects (snake,
// stones, apples, status overlays), etc.
export function initCubeSideDrawer(state: GameState, side: ECubeSide): void {
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

export function drawCubeSideLoop(state: GameState, cubeSide: ECubeSide): void {
  const {grid} = state.scene.cube;

  const side = state.scene.cube[cubeSide];
  if (!side.needsRedraw) {
    return;
  }

  const {canvas, ctx} = side;
  assertNotEmpty(canvas);
  assertNotEmpty(ctx);

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // draw grid
  const cellWidth = width / grid.colsCount;
  const cellHeight = height / grid.rowsCount;

  for (let i = 1; i < grid.colsCount; i++) {
    const x = i * cellWidth;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let i = 1; i < grid.rowsCount; i++) {
    const y = i * cellHeight;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.lineWidth = 1;
  ctx.stroke();

  // draw snake
  ctx.fillStyle = 'red';
  state.snake.parts.forEach((part) => {
    if (part.side === cubeSide) {
      ctx.fillRect(
        part.col * cellWidth,
        height - part.row * cellHeight - cellHeight,
        cellWidth,
        cellHeight
      );
    }
  });

  // draw apples
  ctx.fillStyle = 'green';
  state.apples.forEach((apple) => {
    if (apple.side === cubeSide) {
      ctx.fillRect(
        apple.col * cellWidth,
        height - apple.row * cellHeight - cellHeight,
        cellWidth,
        cellHeight
      );
    }
  });

  // draw stones
  ctx.fillStyle = 'black';
  state.stones.forEach((stone) => {
    if (stone.side === cubeSide) {
      ctx.fillRect(
        stone.col * cellWidth,
        height - stone.row * cellHeight - cellHeight,
        cellWidth,
        cellHeight
      );
    }
  });

  // draw side label
  if (DRAW_SIDE_LABELS) {
    ctx.fillStyle = 'red';
    ctx.font = getCanvasFontString(10, 'Consolas');
    const cubeSideLabel = getCubeSideLabel(cubeSide);
    ctx.fillText(cubeSideLabel, 5, 15);
    ctx.fillText(cubeSideLabel, width - 30, 15);
    ctx.fillText(cubeSideLabel, width - 30, height - 5);
    ctx.fillText(cubeSideLabel, 5, height - 5);
  }

  // draw status overlay
  if (state.status !== EGameStatus.InGame) {
    const overlayHeight = 200;
    const overlayWidth = 400;
    const overlayPadding = 30;

    const overlayHorizontalMargin = (width - overlayWidth) / 2;
    const overlayVerticalMargin = (height - overlayHeight) / 2;

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'white';
    ctx.fillRect(
      overlayHorizontalMargin,
      overlayVerticalMargin,
      overlayWidth,
      overlayHeight
    );

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      overlayHorizontalMargin,
      overlayVerticalMargin,
      overlayWidth,
      overlayHeight
    );

    // title
    ctx.fillStyle = 'black';
    ctx.font = getCanvasFontString(70, 'Consolas', 'px', 'bold');
    const title =
      state.status === EGameStatus.Paused
        ? 'PAUSED'
        : state.status === EGameStatus.Win
        ? 'WIN'
        : state.status === EGameStatus.Fail
        ? 'FAIL'
        : 'SNAKE 3D';

    const titleSize = measureCanvasText(ctx, title);
    ctx.fillText(
      title,
      width / 2 - titleSize.width / 2,
      height / 2 + titleSize.height / 2
    );

    // controls hint
    ctx.font = getCanvasFontString(20, 'Consolas');
    const controlsHint = 'WSAD/arrows to control';
    const controlsHintSize = measureCanvasText(ctx, controlsHint);
    ctx.fillText(
      controlsHint,
      width / 2 - controlsHintSize.width / 2,
      overlayVerticalMargin + overlayPadding + controlsHintSize.height
    );

    // start hint
    ctx.font = getCanvasFontString(20, 'Consolas');
    const startHint = 'space/enter to start';
    const startHintSize = measureCanvasText(ctx, startHint);
    ctx.fillText(
      startHint,
      width / 2 - startHintSize.width / 2,
      height - overlayVerticalMargin - overlayPadding
    );
  }

  side.needsRedraw = false;
  side.needsUpdateOnCube = true;
}
