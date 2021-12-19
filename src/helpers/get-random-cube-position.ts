import Cube from '../state/models/Cube';
import ICubePosition from '../state/models/ICubePosition';

export default function getRandomCubePosition(cube: Cube): ICubePosition {
  return {
    side: Math.floor(Math.random() * cube.sides.length),
    row: Math.floor(Math.random() * cube.grid.rowsCount),
    col: Math.floor(Math.random() * cube.grid.colsCount),
  };
}
