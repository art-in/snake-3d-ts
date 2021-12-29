import {cubeSideCoordsRange} from '../drawers/cube-drawer/geometry/cube-side-coords-range';
import ECubeSide from '../models/ECubeSide';
import IGrid from '../models/IGrid';
import ICubePosition from '../models/ICubePosition';
import IPoint3D from '../models/IPoint3D';

export default function getPosition3dForCubePosition(
  pos: ICubePosition,
  grid: IGrid
): IPoint3D {
  const vertRatio = (pos.row + 0.5) / grid.rowsCount;
  const horizRatio = (pos.col + 0.5) / grid.colsCount;

  const ranges = cubeSideCoordsRange[pos.side];

  const dx = ranges.x[1] - ranges.x[0];
  const dy = ranges.y[1] - ranges.y[0];
  const dz = ranges.z[1] - ranges.z[0];

  switch (pos.side) {
    case ECubeSide.Front:
    case ECubeSide.Back:
      return {
        x: ranges.x[0] + dx * horizRatio,
        y: ranges.y[0] + dy * vertRatio,
        z: ranges.z[0],
      };
    case ECubeSide.Left:
    case ECubeSide.Right:
      return {
        x: ranges.x[0],
        y: ranges.y[0] + dy * vertRatio,
        z: ranges.z[0] + dz * horizRatio,
      };
    case ECubeSide.Up:
    case ECubeSide.Down:
      return {
        x: ranges.x[0] + dx * horizRatio,
        y: ranges.y[0],
        z: ranges.z[0] + dz * vertRatio,
      };
    default:
      throw Error('Unknown cube side');
  }
}
