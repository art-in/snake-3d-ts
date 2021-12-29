import ECubeSide from '../../../models/ECubeSide';

// (side, x, y, z)
// prettier-ignore
export const cubeVertexCoords = new Float32Array([
  ECubeSide.Front, -0.5, -0.5,   0.5,
  ECubeSide.Front,  0.5, -0.5,   0.5,
  ECubeSide.Front, -0.5,  0.5,   0.5,
  ECubeSide.Front, -0.5,  0.5,   0.5,
  ECubeSide.Front,  0.5, -0.5,   0.5,
  ECubeSide.Front,  0.5,  0.5,   0.5,

  ECubeSide.Back, -0.5, -0.5,  -0.5,
  ECubeSide.Back, -0.5,  0.5,  -0.5,
  ECubeSide.Back, 0.5, -0.5,  -0.5,
  ECubeSide.Back, -0.5,  0.5,  -0.5,
  ECubeSide.Back,  0.5,  0.5,  -0.5,
  ECubeSide.Back,  0.5, -0.5,  -0.5,

  ECubeSide.Up, -0.5,   0.5, -0.5,
  ECubeSide.Up, -0.5,   0.5,  0.5,
  ECubeSide.Up,  0.5,   0.5, -0.5,
  ECubeSide.Up, -0.5,   0.5,  0.5,
  ECubeSide.Up,  0.5,   0.5,  0.5,
  ECubeSide.Up,  0.5,   0.5, -0.5,

  ECubeSide.Down, -0.5,  -0.5, -0.5,
  ECubeSide.Down,  0.5,  -0.5, -0.5,
  ECubeSide.Down, -0.5,  -0.5,  0.5,
  ECubeSide.Down, -0.5,  -0.5,  0.5,
  ECubeSide.Down,  0.5,  -0.5, -0.5,
  ECubeSide.Down,  0.5,  -0.5,  0.5,

  ECubeSide.Left, -0.5,  -0.5, -0.5,
  ECubeSide.Left, -0.5,  -0.5,  0.5,
  ECubeSide.Left, -0.5,   0.5, -0.5,
  ECubeSide.Left, -0.5,  -0.5,  0.5,
  ECubeSide.Left, -0.5,   0.5,  0.5,
  ECubeSide.Left, -0.5,   0.5, -0.5,

  ECubeSide.Right, 0.5,  -0.5, -0.5,
  ECubeSide.Right, 0.5,   0.5, -0.5,
  ECubeSide.Right, 0.5,  -0.5,  0.5,
  ECubeSide.Right, 0.5,  -0.5,  0.5,
  ECubeSide.Right, 0.5,   0.5, -0.5,
  ECubeSide.Right, 0.5,   0.5,  0.5,
]);
