import assertNotEmpty from '../../helpers/assertNotEmpty';
import getCubeSideLabel from '../../helpers/getCubeSideLabel';
import {ECubeSide} from '../../state/models/ECubeSide';
import State from '../../state/models/State';

export function drawCubeSideCycle(state: State, cubeSide: ECubeSide): void {
  const {grid, snake} = state.scene;

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

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // grid
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

  // snake drawer
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

  // side label
  const cubeSideLabel = getCubeSideLabel(cubeSide);
  ctx.fillText(cubeSideLabel, 5, 15);
  ctx.fillText(cubeSideLabel, width - 30, 15);
  ctx.fillText(cubeSideLabel, width - 30, height - 5);
  ctx.fillText(cubeSideLabel, 5, height - 5);

  side.needsRedraw = false;
  side.needsUpdateOnCube = true;
}
