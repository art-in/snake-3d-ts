import assertNotEmpty from '../helpers/assert-not-empty';
import getCanvasFontString from '../helpers/get-canvas-font-string';
import getCubeSideLabel from '../helpers/get-cube-side-label';
import measureCanvasText from '../helpers/measure-canvas-text';
import {ECubeSide} from '../state/models/ECubeSide';
import EGameStatus from '../state/models/EGameStatus';
import State from '../state/models/State';

const DRAW_SIDE_LABELS = false;

export function drawCubeSideCycle(state: State, cubeSide: ECubeSide): void {
  const {scene, snake, apples, stones} = state;
  const {grid} = scene.cube;

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

  for (let colIdx = 1; colIdx < grid.colsCount; colIdx++) {
    const x = colIdx * cellWidth;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let rowIdx = 1; rowIdx < grid.rowsCount; rowIdx++) {
    const y = rowIdx * cellHeight;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.lineWidth = 1;
  ctx.stroke();

  // draw snake
  ctx.fillStyle = 'red';
  snake.parts.forEach((part) => {
    if (part.pos.cubeSide === cubeSide) {
      ctx.fillRect(
        part.pos.gridCol * cellWidth,
        height - part.pos.gridRow * cellHeight - cellHeight,
        cellWidth,
        cellHeight
      );
    }
  });

  // draw apples
  ctx.fillStyle = 'green';
  apples.forEach((apple) => {
    if (apple.pos.cubeSide === cubeSide) {
      ctx.fillRect(
        apple.pos.gridCol * cellWidth,
        height - apple.pos.gridRow * cellHeight - cellHeight,
        cellWidth,
        cellHeight
      );
    }
  });

  // draw stones
  ctx.fillStyle = 'black';
  stones.forEach((apple) => {
    if (apple.pos.cubeSide === cubeSide) {
      ctx.fillRect(
        apple.pos.gridCol * cellWidth,
        height - apple.pos.gridRow * cellHeight - cellHeight,
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
    const headerSize = measureCanvasText(ctx, title);
    ctx.fillText(
      title,
      width / 2 - headerSize.width / 2,
      height / 2 + headerSize.height / 2
    );

    ctx.font = getCanvasFontString(20, 'Consolas');
    const controlsHint = 'WSAD/arrows to control';
    const controlsHintSize = measureCanvasText(ctx, controlsHint);
    ctx.fillText(
      controlsHint,
      width / 2 - controlsHintSize.width / 2,
      overlayVerticalMargin + overlayPadding + controlsHintSize.height
    );

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
