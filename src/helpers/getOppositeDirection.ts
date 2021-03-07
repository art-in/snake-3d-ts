import {EDirection} from '../state/models/EDirection';

export default function getOppositeDirection(
  direction: EDirection
): EDirection {
  switch (direction) {
    case EDirection.Up:
      return EDirection.Down;
    case EDirection.Down:
      return EDirection.Up;
    case EDirection.Left:
      return EDirection.Right;
    case EDirection.Right:
      return EDirection.Left;
  }
}
