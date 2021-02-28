import State from '../../state/models/State';
import {createProgram} from '../../helpers/webgl';
import * as m4 from '../../helpers/m4';
import {IShaderDescriptor} from '../../helpers/webgl.types';
import assertNotEmpty from '../../helpers/assertNotEmpty';
import {drawCubeSideCycle} from './cube-side-drawer';
import {ECubeSide} from '../../state/models/ECubeSide';
import {degToRad} from '../../helpers';
import {cubeVertexCoords} from './geometry/cube-vertex-coords';
import {cubeTextureCoords} from './geometry/cube-texture-coords';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import littleCubeVertexShader from './shaders-little-cube/vertex.glsl';
import littleCubeFragmentShader from './shaders-little-cube/fragment.glsl';
import {getPosition3dForCubePosition} from '../../state/actions/get-position-3d-for-cube-position';
import getCubeSideLabel from '../../helpers/getCubeSideLabel';

export function initCubeDrawer(state: State): void {
  const {scene} = state;

  const {ctx} = scene;
  assertNotEmpty(ctx);

  // setup GLSL program
  const shaderDescriptors: IShaderDescriptor[] = [
    {src: vertexShader, type: ctx.VERTEX_SHADER},
    {src: fragmentShader, type: ctx.FRAGMENT_SHADER},
  ];

  scene.program = createProgram(ctx, shaderDescriptors);
  ctx.useProgram(scene.program);

  // setup GLSL program
  const littleCubeShaderDescriptors: IShaderDescriptor[] = [
    {src: littleCubeVertexShader, type: ctx.VERTEX_SHADER},
    {src: littleCubeFragmentShader, type: ctx.FRAGMENT_SHADER},
  ];

  scene.littleCubeProgram = createProgram(ctx, littleCubeShaderDescriptors);

  // create a buffer for positions
  const cubeVertexCoordsBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeVertexCoords, ctx.STATIC_DRAW);
  assertNotEmpty(cubeVertexCoordsBuffer);
  scene.cubeVertexCoordsBuffer = cubeVertexCoordsBuffer;

  // provide texture coordinates for the rectangle.
  const cubeTextureCoordsBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeTextureCoordsBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeTextureCoords, ctx.STATIC_DRAW);
  assertNotEmpty(cubeTextureCoordsBuffer);
  scene.cubeTextureCoordsBuffer = cubeTextureCoordsBuffer;

  const cubeTextures: WebGLTexture[] = [];
  for (let side: ECubeSide = 0; side < 6; side++) {
    const texture: WebGLTexture | null = ctx.createTexture();
    assertNotEmpty(texture);
    cubeTextures.push(texture);

    const cubeTextureSideLocation = ctx.getUniformLocation(
      scene.program,
      'u_cube_texture_side_' + side
    );

    ctx.uniform1i(cubeTextureSideLocation, side);
  }

  scene.cubeTextures = cubeTextures;

  // pass texture data for the first time (later will update them)
  state.scene.cube.sides.forEach((side) => {
    const canvas = side.canvas;
    assertNotEmpty(canvas);

    ctx.bindTexture(ctx.TEXTURE_2D, cubeTextures[side.side]);
    ctx.texImage2D(
      ctx.TEXTURE_2D,
      0,
      ctx.RGBA,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      canvas
    );

    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);

    side.needsUpdateOnCube = false;
  });
}

export function drawCubeCycle(state: State): void {
  state.scene.cube.sides.forEach((side) => {
    drawCubeSideCycle(state, side.side);
  });

  const {scene} = state;
  const {canvas, ctx, fieldOfViewRad, currentRotationDeg} = scene;

  assertNotEmpty(canvas);
  assertNotEmpty(ctx);
  assertNotEmpty(currentRotationDeg);

  if (
    !scene.needsRedraw &&
    scene.cube.sides.every((s) => !s.needsUpdateOnCube) &&
    scene.currentRotationDeg.x === scene.targetRotationDeg.x &&
    scene.currentRotationDeg.y === scene.targetRotationDeg.y
  ) {
    return;
  }

  // define how to convert from clip space to canvas pixels
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.enable(ctx.CULL_FACE);
  ctx.enable(ctx.DEPTH_TEST);

  // clear the canvas AND the depth buffer.
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  // compute transformation matrix
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projectionMatrix = m4.perspective(fieldOfViewRad, aspect, 1, 2000);

  const cameraPosition = [0, 0, 2];
  const up = [0, 1, 0];
  const target = [0, 0, 0];

  const cameraMatrix = m4.lookAt(cameraPosition, target, up);
  const viewMatrix = m4.inverse(cameraMatrix);
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  let matrix = m4.xRotate(viewProjectionMatrix, degToRad(currentRotationDeg.x));
  matrix = m4.yRotate(matrix, degToRad(currentRotationDeg.y));

  drawCube(state, matrix);
  drawLittleCube(state, matrix);

  scene.needsRedraw = false;
}

function drawCube(state: State, matrix: m4.TMatrix4) {
  const {
    ctx,
    canvas,
    program,
    fieldOfViewRad,
    cubeTextures,
    cubeVertexCoordsBuffer,
    cubeTextureCoordsBuffer,
  } = state.scene;

  assertNotEmpty(program);
  assertNotEmpty(ctx);
  assertNotEmpty(canvas);
  assertNotEmpty(program);
  assertNotEmpty(fieldOfViewRad);
  assertNotEmpty(cubeTextures);
  assertNotEmpty(cubeVertexCoordsBuffer);
  assertNotEmpty(cubeTextureCoordsBuffer);

  ctx.useProgram(program);

  // define how to extract coordinates from vertex buffer
  const cubeVertexCoordLocation = ctx.getAttribLocation(
    program,
    'a_cube_vertex_coord'
  );

  ctx.enableVertexAttribArray(cubeVertexCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  let size = 3; // 3 components per iteration
  let type = ctx.FLOAT; // the data is 32bit floats
  let normalize = false;
  let stride = 16; // (bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
  let offset = 4; // (bytes) skip side float
  ctx.vertexAttribPointer(
    cubeVertexCoordLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // define how to extract cube side from vertex buffer
  const cubeVertexSideLocation = ctx.getAttribLocation(
    program,
    'a_cube_vertex_side'
  );

  ctx.enableVertexAttribArray(cubeVertexSideLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  size = 1; // 1 components per iteration
  type = ctx.FLOAT; // the data is 32bit floats
  normalize = false;
  stride = 16; // (bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
  offset = 0; // (bytes) start at the beginning of the buffer
  ctx.vertexAttribPointer(
    cubeVertexSideLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // define how to extract coordinates from texture coordinates buffer
  const cubeTextureCoordLocation = ctx.getAttribLocation(
    program,
    'a_cube_texture_coord'
  );

  ctx.enableVertexAttribArray(cubeTextureCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeTextureCoordsBuffer);

  size = 2; // 2 components per iteration
  type = ctx.FLOAT; // the data is 32bit floats
  normalize = false;
  stride = 0;
  offset = 0; // start at the beginning of the buffer
  ctx.vertexAttribPointer(
    cubeTextureCoordLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // update texture data if needed
  state.scene.cube.sides.forEach((side) => {
    if (side.needsUpdateOnCube) {
      console.log('update cube side on GPU', getCubeSideLabel(side.side));
      const canvas = side.canvas;
      assertNotEmpty(canvas);

      ctx.bindTexture(ctx.TEXTURE_2D, cubeTextures[side.side]);
      ctx.texSubImage2D(
        ctx.TEXTURE_2D,
        0, // level
        0, // offset x
        0, // offset y
        ctx.RGBA,
        ctx.UNSIGNED_BYTE,
        canvas
      );

      side.needsUpdateOnCube = false;
    }
  });

  state.scene.cube.sides.forEach((side) => {
    ctx.activeTexture(ctx.TEXTURE0 + side.side);
    ctx.bindTexture(ctx.TEXTURE_2D, cubeTextures[side.side]);
  });

  // pass transformation matrix
  const matrixLocation = ctx.getUniformLocation(program, 'u_matrix');
  ctx.uniformMatrix4fv(matrixLocation, false, matrix);

  // draw the geometry
  const cubeSidesCount = 6;
  const trianglesPerCubeSideCount = 2;
  const verticesPerTriangleCount = 3;
  const totalVerticesCount =
    cubeSidesCount * trianglesPerCubeSideCount * verticesPerTriangleCount;

  ctx.drawArrays(ctx.TRIANGLES, 0, totalVerticesCount);
}

function drawLittleCube(state: State, matrix: m4.TMatrix4) {
  const {
    ctx,
    canvas,
    littleCubeProgram,
    fieldOfViewRad,
    cubeTextures,
    cubeVertexCoordsBuffer,
    cubeTextureCoordsBuffer,
  } = state.scene;

  assertNotEmpty(littleCubeProgram);
  assertNotEmpty(ctx);
  assertNotEmpty(canvas);
  assertNotEmpty(fieldOfViewRad);
  assertNotEmpty(cubeTextures);
  assertNotEmpty(cubeVertexCoordsBuffer);
  assertNotEmpty(cubeTextureCoordsBuffer);

  ctx.useProgram(littleCubeProgram);

  // define how to extract coordinates from vertex buffer
  const cubeVertexCoordLocation = ctx.getAttribLocation(
    littleCubeProgram,
    'a_cube_vertex_coord'
  );

  ctx.enableVertexAttribArray(cubeVertexCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  let size = 3; // 3 components per iteration
  let type = ctx.FLOAT; // the data is 32bit floats
  let normalize = false;
  let stride = 16; // (bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
  let offset = 4; // (bytes) skip side float
  ctx.vertexAttribPointer(
    cubeVertexCoordLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // define how to extract cube side from vertex buffer
  const cubeVertexSideLocation = ctx.getAttribLocation(
    littleCubeProgram,
    'a_cube_vertex_side'
  );

  ctx.enableVertexAttribArray(cubeVertexSideLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  size = 1; // 1 components per iteration
  type = ctx.FLOAT; // the data is 32bit floats
  normalize = false;
  stride = 16; // (bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
  offset = 0; // (bytes) start at the beginning of the buffer
  ctx.vertexAttribPointer(
    cubeVertexSideLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // pass transformation matrix
  const matrixLocation = ctx.getUniformLocation(littleCubeProgram, 'u_matrix');
  const pos = getPosition3dForCubePosition(
    state.scene.snake.parts[0].pos,
    state.scene.grid
  );
  matrix = m4.translate(matrix, pos.x, pos.y, pos.z);
  const scaleFactor = 1 / 16 - (1 / 16) * 0.1;
  matrix = m4.scale(matrix, scaleFactor, scaleFactor, scaleFactor);
  ctx.uniformMatrix4fv(matrixLocation, false, matrix);

  // draw the geometry
  const cubeSidesCount = 6;
  const trianglesPerCubeSideCount = 2;
  const verticesPerTriangleCount = 3;
  const totalVerticesCount =
    cubeSidesCount * trianglesPerCubeSideCount * verticesPerTriangleCount;

  ctx.drawArrays(ctx.TRIANGLES, 0, totalVerticesCount);
}
