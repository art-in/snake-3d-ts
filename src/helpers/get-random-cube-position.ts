import Cube from '../state/models/Cube';
import {ICubePosition} from '../state/models/IGridPosition';

export default function getRandomCubePosition(cube: Cube): ICubePosition {
  return {
    cubeSide: Math.floor(Math.random() * cube.sides.length),
    gridRow: Math.floor(Math.random() * cube.grid.rowsCount),
    gridCol: Math.floor(Math.random() * cube.grid.colsCount),
  };
}
