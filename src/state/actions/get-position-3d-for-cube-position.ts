import {ECubeSide} from '../models/ECubeSide';
import Grid from '../models/Grid';
import {ICubePosition} from '../models/IGridPosition';
import IPosition3D from '../models/IPosition3D';

const cubeSidePositionMatrix = {
  [ECubeSide.Front]: {
    x: [-0.5, 0.5],
    y: [-0.5, 0.5],
    z: [0.5, 0.5],
  },
  [ECubeSide.Left]: {
    x: [-0.5, -0.5],
    y: [-0.5, 0.5],
    z: [-0.5, 0.5],
  },
  [ECubeSide.Right]: {
    x: [0.5, 0.5],
    y: [-0.5, 0.5],
    z: [0.5, -0.5],
  },
  [ECubeSide.Back]: {
    x: [0.5, -0.5],
    y: [-0.5, 0.5],
    z: [-0.5, -0.5],
  },
  [ECubeSide.Up]: {
    x: [-0.5, 0.5],
    y: [0.5, 0.5],
    z: [0.5, -0.5],
  },
  [ECubeSide.Down]: {
    x: [-0.5, 0.5],
    y: [-0.5, -0.5],
    z: [-0.5, 0.5],
  },
};

export function getPosition3dForCubePosition(
  pos: ICubePosition,
  grid: Grid
): IPosition3D {
  const vertRatio = (pos.gridRow + 0.5) / grid.rowsCount;
  const horizRatio = (pos.gridCol + 0.5) / grid.colsCount;

  const ranges = cubeSidePositionMatrix[pos.cubeSide];

  const dx = ranges.x[1] - ranges.x[0];
  const dy = ranges.y[1] - ranges.y[0];
  const dz = ranges.z[1] - ranges.z[0];

  switch (pos.cubeSide) {
    case ECubeSide.Front:
      return {
        x: ranges.x[0] + dx * horizRatio,
        y: ranges.y[0] + dy * vertRatio,
        z: ranges.z[0],
      };
    case ECubeSide.Left:
      return {
        x: ranges.x[0],
        y: ranges.y[0] + dy * vertRatio,
        z: ranges.z[0] + dz * horizRatio,
      };
    case ECubeSide.Right:
      return {
        x: ranges.x[0],
        y: ranges.y[0] + dy * vertRatio,
        z: ranges.z[0] + dz * horizRatio,
      };
    case ECubeSide.Back:
      return {
        x: ranges.x[0] + dx * horizRatio,
        y: ranges.y[0] + dy * vertRatio,
        z: ranges.z[0],
      };
    case ECubeSide.Up:
      return {
        x: ranges.x[0] + dx * horizRatio,
        y: ranges.y[0],
        z: ranges.z[0] + dz * vertRatio,
      };
    case ECubeSide.Down:
      return {
        x: ranges.x[0] + dx * horizRatio,
        y: ranges.y[0],
        z: ranges.z[0] + dz * vertRatio,
      };
  }
}
