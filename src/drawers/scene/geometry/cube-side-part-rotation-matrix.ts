import {ECubeSide} from '../../../state/models/ECubeSide';
import {ECubeSidePart} from '../../../state/models/ECubeSidePart';
import IModelRotationDeg from '../../../state/models/IModelRotationDeg';

export type CubeSidePartRotationMatrix = Record<
  ECubeSide,
  Record<ECubeSidePart, IModelRotationDeg>
>;

export const cubeSidePartRotationMatrix: CubeSidePartRotationMatrix = {
  [ECubeSide.Front]: {
    [ECubeSidePart.Center]: {x: 0, y: 0},
    [ECubeSidePart.Top]: {x: 45, y: 0},
    [ECubeSidePart.TopRight]: {x: 45, y: -45},
    [ECubeSidePart.Right]: {x: 0, y: -45},
    [ECubeSidePart.BottomRight]: {x: -45, y: -45},
    [ECubeSidePart.Bottom]: {x: -45, y: 0},
    [ECubeSidePart.BottomLeft]: {x: -45, y: 45},
    [ECubeSidePart.Left]: {x: 0, y: 45},
    [ECubeSidePart.TopLeft]: {x: 45, y: 45},
  },
  [ECubeSide.Back]: {
    [ECubeSidePart.Center]: {x: 0, y: 180},
    [ECubeSidePart.Top]: {x: 45, y: 180},
    [ECubeSidePart.TopRight]: {x: 45, y: 135},
    [ECubeSidePart.Right]: {x: 0, y: 135},
    [ECubeSidePart.BottomRight]: {x: -45, y: 135},
    [ECubeSidePart.Bottom]: {x: -45, y: 180},
    [ECubeSidePart.BottomLeft]: {x: -45, y: -135},
    [ECubeSidePart.Left]: {x: 0, y: -135},
    [ECubeSidePart.TopLeft]: {x: 45, y: -135},
  },
  [ECubeSide.Up]: {
    [ECubeSidePart.Center]: {x: 90, y: 0},
    [ECubeSidePart.Top]: {x: 135, y: 0},
    [ECubeSidePart.TopRight]: {x: 135, y: 45},
    [ECubeSidePart.Right]: {x: 45, y: -45}, // !!!
    [ECubeSidePart.BottomRight]: {x: 45, y: -45},
    [ECubeSidePart.Bottom]: {x: 45, y: 0},
    [ECubeSidePart.BottomLeft]: {x: 45, y: 45}, // !!!
    [ECubeSidePart.Left]: {x: 45, y: 45},
    [ECubeSidePart.TopLeft]: {x: 135, y: -45},
  },
  [ECubeSide.Down]: {
    [ECubeSidePart.Center]: {x: -90, y: 0},
    [ECubeSidePart.Top]: {x: -45, y: 0},
    [ECubeSidePart.TopRight]: {x: -45, y: -45},
    [ECubeSidePart.Right]: {x: -135, y: 45}, // !!!
    [ECubeSidePart.BottomRight]: {x: -135, y: 45},
    [ECubeSidePart.Bottom]: {x: -135, y: 0},
    [ECubeSidePart.BottomLeft]: {x: -135, y: -45},
    [ECubeSidePart.Left]: {x: -135, y: -45}, // !!!
    [ECubeSidePart.TopLeft]: {x: -45, y: 45},
  },
  [ECubeSide.Left]: {
    [ECubeSidePart.Center]: {x: 0, y: 90},
    [ECubeSidePart.Top]: {x: 45, y: 90},
    [ECubeSidePart.TopRight]: {x: 45, y: 45},
    [ECubeSidePart.Right]: {x: 0, y: 45},
    [ECubeSidePart.BottomRight]: {x: -45, y: 45},
    [ECubeSidePart.Bottom]: {x: -45, y: 90},
    [ECubeSidePart.BottomLeft]: {x: -45, y: 135},
    [ECubeSidePart.Left]: {x: 0, y: 135},
    [ECubeSidePart.TopLeft]: {x: 45, y: 135},
  },
  [ECubeSide.Right]: {
    [ECubeSidePart.Center]: {x: 0, y: -90},
    [ECubeSidePart.Top]: {x: 45, y: -90},
    [ECubeSidePart.TopRight]: {x: 45, y: -135},
    [ECubeSidePart.Right]: {x: 0, y: -135},
    [ECubeSidePart.BottomRight]: {x: -45, y: -135},
    [ECubeSidePart.Bottom]: {x: -45, y: -90},
    [ECubeSidePart.BottomLeft]: {x: -45, y: -45},
    [ECubeSidePart.Left]: {x: 0, y: -45},
    [ECubeSidePart.TopLeft]: {x: 45, y: -45},
  },
};
