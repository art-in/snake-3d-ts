import Cube from '../models/Cube';
import ICubePosition from '../models/ICubePosition';

export default function getRandomCubePosition(cube: Cube): ICubePosition {
  return {
    side: Math.floor(Math.random() * cube.sides.length),
    row: Math.floor(Math.random() * cube.grid.rowsCount),
    col: Math.floor(Math.random() * cube.grid.colsCount),
  };
}
