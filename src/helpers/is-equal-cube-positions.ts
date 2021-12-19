import ICubePosition from '../state/models/ICubePosition';

export default function isEqualCubePositions(
  a: ICubePosition,
  b: ICubePosition
): boolean {
  return a.side === b.side && a.col === b.col && a.row === b.row;
}
