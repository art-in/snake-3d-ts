import ECubeSide from '../../../models/ECubeSide';

export const cubeSideCoordsRange = {
  [ECubeSide.Front]: {
    x: [-0.5, 0.5],
    y: [-0.5, 0.5],
    z: [0.5, 0.5],
  },
  [ECubeSide.Left]: {
    x: [-0.5, -0.5],
    y: [-0.5, 0.5],
    z: [-0.5, 0.5],
  },
  [ECubeSide.Right]: {
    x: [0.5, 0.5],
    y: [-0.5, 0.5],
    z: [0.5, -0.5],
  },
  [ECubeSide.Back]: {
    x: [0.5, -0.5],
    y: [-0.5, 0.5],
    z: [-0.5, -0.5],
  },
  [ECubeSide.Up]: {
    x: [-0.5, 0.5],
    y: [0.5, 0.5],
    z: [0.5, -0.5],
  },
  [ECubeSide.Down]: {
    x: [-0.5, 0.5],
    y: [-0.5, -0.5],
    z: [-0.5, 0.5],
  },
};
