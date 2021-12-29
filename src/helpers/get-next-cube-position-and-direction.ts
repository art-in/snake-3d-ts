import ECubeSide from '../models/ECubeSide';
import EDirection from '../models/EDirection';
import ICubePosition from '../models/ICubePosition';
import IGrid from '../models/IGrid';
import clone from './clone';

export default function getNextCubePositionAndDirection(
  pos: ICubePosition,
  direction: EDirection,
  grid: IGrid
): {nextPos: ICubePosition; nextDirection: EDirection} {
  const nextPos = clone(pos);
  let nextDirection = direction;

  switch (direction) {
    case EDirection.Up:
      nextPos.row += 1;
      break;
    case EDirection.Down:
      nextPos.row -= 1;
      break;
    case EDirection.Left:
      nextPos.col -= 1;
      break;
    case EDirection.Right:
      nextPos.col += 1;
      break;
  }

  // describe how cube sides adjust with each other when jumping from one side
  // to another

  // falling off the up edge
  if (nextPos.row >= grid.rowsCount) {
    switch (nextPos.side) {
      case ECubeSide.Front:
        nextPos.side = ECubeSide.Up;
        nextPos.row = 0;
        break;
      case ECubeSide.Back:
        nextPos.side = ECubeSide.Up;
        nextDirection = EDirection.Down;
        nextPos.col = grid.colsCount - nextPos.col - 1;
        nextPos.row = grid.rowsCount - 1;
        break;
      case ECubeSide.Up:
        nextPos.side = ECubeSide.Back;
        nextDirection = EDirection.Down;
        nextPos.col = grid.colsCount - nextPos.col - 1;
        nextPos.row = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        nextPos.side = ECubeSide.Front;
        nextPos.row = 0;
        break;
      case ECubeSide.Left:
        nextPos.side = ECubeSide.Up;
        nextDirection = EDirection.Right;
        nextPos.row = grid.rowsCount - nextPos.col - 1;
        nextPos.col = 0;
        break;
      case ECubeSide.Right:
        nextPos.side = ECubeSide.Up;
        nextDirection = EDirection.Left;
        nextPos.row = nextPos.col;
        nextPos.col = grid.colsCount - 1;
        break;
    }
  }

  // falling off the down edge
  if (nextPos.row < 0) {
    switch (nextPos.side) {
      case ECubeSide.Front:
        nextPos.side = ECubeSide.Down;
        nextPos.row = grid.colsCount - 1;
        break;
      case ECubeSide.Back:
        nextPos.side = ECubeSide.Down;
        nextDirection = EDirection.Up;
        nextPos.col = grid.colsCount - nextPos.col - 1;
        nextPos.row = 0;
        break;
      case ECubeSide.Up:
        nextPos.side = ECubeSide.Front;
        nextPos.row = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        nextPos.side = ECubeSide.Back;
        nextDirection = EDirection.Up;
        nextPos.col = grid.colsCount - nextPos.col - 1;
        nextPos.row = 0;
        break;
      case ECubeSide.Left:
        nextPos.side = ECubeSide.Down;
        nextDirection = EDirection.Right;
        nextPos.row = nextPos.col;
        nextPos.col = 0;
        break;
      case ECubeSide.Right:
        nextPos.side = ECubeSide.Down;
        nextDirection = EDirection.Left;
        nextPos.row = grid.rowsCount - nextPos.col - 1;
        nextPos.col = grid.colsCount - 1;
        break;
    }
  }

  // falling off the right edge
  if (nextPos.col >= grid.colsCount) {
    switch (nextPos.side) {
      case ECubeSide.Front:
        nextPos.side = ECubeSide.Right;
        nextPos.col = 0;
        break;
      case ECubeSide.Back:
        nextPos.side = ECubeSide.Left;
        nextPos.col = 0;
        break;
      case ECubeSide.Up:
        nextPos.side = ECubeSide.Right;
        nextDirection = EDirection.Down;
        nextPos.col = nextPos.row;
        nextPos.row = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        nextPos.side = ECubeSide.Right;
        nextDirection = EDirection.Up;
        nextPos.col = grid.rowsCount - nextPos.row - 1;
        nextPos.row = 0;
        break;
      case ECubeSide.Left:
        nextPos.side = ECubeSide.Front;
        nextPos.col = 0;
        break;
      case ECubeSide.Right:
        nextPos.side = ECubeSide.Back;
        nextPos.col = 0;
        break;
    }
  }

  // falling off the left edge
  if (nextPos.col < 0) {
    switch (nextPos.side) {
      case ECubeSide.Front:
        nextPos.side = ECubeSide.Left;
        nextPos.col = grid.colsCount - 1;
        break;
      case ECubeSide.Back:
        nextPos.side = ECubeSide.Right;
        nextPos.col = grid.colsCount - 1;
        break;
      case ECubeSide.Up:
        nextPos.side = ECubeSide.Left;
        nextDirection = EDirection.Down;
        nextPos.col = grid.colsCount - nextPos.row - 1;
        nextPos.row = grid.rowsCount - 1;
        break;
      case ECubeSide.Down:
        nextPos.side = ECubeSide.Left;
        nextDirection = EDirection.Up;
        nextPos.col = nextPos.row;
        nextPos.row = 0;
        break;
      case ECubeSide.Left:
        nextPos.side = ECubeSide.Back;
        nextPos.col = grid.colsCount - 1;
        break;
      case ECubeSide.Right:
        nextPos.side = ECubeSide.Front;
        nextPos.col = grid.colsCount - 1;
        break;
    }
  }

  return {nextPos, nextDirection};
}
