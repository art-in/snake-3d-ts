import {ICubePosition} from '../state/models/IGridPosition';

export default function isEqualCubePositions(
  a: ICubePosition,
  b: ICubePosition
): boolean {
  return (
    a.cubeSide === b.cubeSide &&
    a.gridCol === b.gridCol &&
    a.gridRow === b.gridRow
  );
}
