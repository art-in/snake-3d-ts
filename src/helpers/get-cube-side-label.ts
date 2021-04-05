import {ECubeSide} from '../state/models/ECubeSide';

export default function getCubeSideLabel(side: ECubeSide): string {
  switch (side) {
    case ECubeSide.Front:
      return 'front';
    case ECubeSide.Back:
      return 'back';
    case ECubeSide.Up:
      return 'up';
    case ECubeSide.Down:
      return 'down';
    case ECubeSide.Left:
      return 'left';
    case ECubeSide.Right:
      return 'right';
  }
}
