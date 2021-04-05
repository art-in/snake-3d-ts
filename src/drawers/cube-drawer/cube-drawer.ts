import State from '../../state/models/State';
import {
  createProgram,
  getAttributeLocation,
  getUniformLocation,
  vertexAttributePointer,
} from '../../helpers/webgl';
import * as m4 from '../../helpers/m4';
import {IShaderDescriptor} from '../../helpers/webgl.types';
import assertNotEmpty from '../../helpers/assert-not-empty';
import Cube from '../../state/models/Cube';
import {ECubeSide} from '../../state/models/ECubeSide';
import {degToRad} from '../../helpers/deg-to-rad';
import {cubeVertexCoords} from './geometry/cube-vertex-coords';
import {cubeTextureCoords} from './geometry/cube-texture-coords';
import cubeVertexShader from './shaders/vertex.glsl';
import cubeFragmentShader from './shaders/fragment.glsl';

const FIELD_OF_VIEW_RAD = degToRad(60);

export function initCubeDrawer(state: State): void {
  const {scene} = state;

  const {ctx, cube} = scene;
  assertNotEmpty(ctx);

  // compile GLSL shaders for cube
  const shaderDescriptors: IShaderDescriptor[] = [
    {src: cubeVertexShader, type: ctx.VERTEX_SHADER},
    {src: cubeFragmentShader, type: ctx.FRAGMENT_SHADER},
  ];

  cube.program = createProgram(ctx, shaderDescriptors);

  ctx.useProgram(cube.program);

  // pass buffer with vertex coordinates
  const cubeVertexCoordsBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeVertexCoords, ctx.STATIC_DRAW);
  assertNotEmpty(cubeVertexCoordsBuffer);
  cube.vertexCoordsBuffer = cubeVertexCoordsBuffer;

  // pass buffer with texture coordinates
  const cubeTextureCoordsBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeTextureCoordsBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeTextureCoords, ctx.STATIC_DRAW);
  assertNotEmpty(cubeTextureCoordsBuffer);
  cube.textureCoordsBuffer = cubeTextureCoordsBuffer;

  // create textures for cube sides
  const cubeTextures: WebGLTexture[] = [];
  for (let side: ECubeSide = 0; side < 6; side++) {
    const texture: WebGLTexture | null = ctx.createTexture();
    assertNotEmpty(texture);
    cubeTextures.push(texture);

    const cubeTextureSideLocation = ctx.getUniformLocation(
      cube.program,
      'u_cube_texture_side_' + side
    );

    ctx.uniform1i(cubeTextureSideLocation, side);
  }

  cube.textures = cubeTextures;

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

function shouldRedrawCube(cube: Cube) {
  return cube.needsRedraw || cube.sides.some((s) => s.needsUpdateOnCube);
}

export function drawCubeCycle(state: State): void {
  const {scene} = state;
  const {canvas, ctx, cube} = scene;

  assertNotEmpty(canvas);
  assertNotEmpty(ctx);

  if (!shouldRedrawCube(cube)) {
    return;
  }

  // define how to convert from clip space to canvas pixels
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.enable(ctx.CULL_FACE);
  ctx.enable(ctx.DEPTH_TEST);

  // clear the canvas AND the depth buffer.
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  // calculate transformation matrix
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projectionMatrix = m4.perspective(FIELD_OF_VIEW_RAD, aspect, 1, 2000);

  const cameraPosition = [0, 0, 2];
  const up = [0, 1, 0];
  const target = [0, 0, 0];

  const cameraMatrix = m4.lookAt(cameraPosition, target, up);
  const viewMatrix = m4.inverse(cameraMatrix);
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  let matrix = m4.xRotate(
    viewProjectionMatrix,
    degToRad(cube.currentRotation.x)
  );
  matrix = m4.yRotate(matrix, degToRad(cube.currentRotation.y));

  drawCube(state, matrix);

  cube.needsRedraw = false;
}

function drawCube(state: State, matrix: m4.TMatrix4) {
  const {ctx, canvas, cube} = state.scene;

  assertNotEmpty(ctx);
  assertNotEmpty(canvas);
  assertNotEmpty(cube.program);
  assertNotEmpty(cube.textures);
  assertNotEmpty(cube.vertexCoordsBuffer);
  assertNotEmpty(cube.textureCoordsBuffer);

  ctx.useProgram(cube.program);

  // define how to extract coordinates from vertex buffer
  const cubeVertexCoordLocation = getAttributeLocation(
    ctx,
    cube.program,
    'a_cube_vertex_coord'
  );

  ctx.enableVertexAttribArray(cubeVertexCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cube.vertexCoordsBuffer);

  vertexAttributePointer(ctx, {
    location: cubeVertexCoordLocation,
    size: 3, // 3 components per iteration
    type: ctx.FLOAT, // the data is 32bit floats
    normalize: false,
    stride: 16, //(bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
    offset: 4, // (bytes) skip side float
  });

  // define how to extract cube side index from vertex buffer
  const cubeVertexSideLocation = getAttributeLocation(
    ctx,
    cube.program,
    'a_cube_vertex_side'
  );

  ctx.enableVertexAttribArray(cubeVertexSideLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cube.vertexCoordsBuffer);

  vertexAttributePointer(ctx, {
    location: cubeVertexSideLocation,
    size: 1,
    type: ctx.FLOAT,
    normalize: false,
    stride: 16, // (bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
    offset: 0,
  });

  // define how to extract coordinates from texture coordinates buffer
  const cubeTextureCoordLocation = getAttributeLocation(
    ctx,
    cube.program,
    'a_cube_texture_coord'
  );

  ctx.enableVertexAttribArray(cubeTextureCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cube.textureCoordsBuffer);

  vertexAttributePointer(ctx, {
    location: cubeTextureCoordLocation,
    size: 2, // 2 components per iteration
    type: ctx.FLOAT, // the data is 32bit floats
    normalize: false,
    stride: 0,
    offset: 0,
  });

  // update texture data if needed
  state.scene.cube.sides.forEach((side) => {
    if (side.needsUpdateOnCube) {
      const canvas = side.canvas;
      assertNotEmpty(canvas);
      assertNotEmpty(cube.textures);

      ctx.bindTexture(ctx.TEXTURE_2D, cube.textures[side.side]);
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
    assertNotEmpty(cube.textures);
    ctx.activeTexture(ctx.TEXTURE0 + side.side);
    ctx.bindTexture(ctx.TEXTURE_2D, cube.textures[side.side]);
  });

  // pass transformation matrix
  const matrixLocation = getUniformLocation(ctx, cube.program, 'u_matrix');
  ctx.uniformMatrix4fv(matrixLocation, false, matrix);

  // draw the geometry
  const cubeSidesCount = 6;
  const trianglesPerCubeSideCount = 2;
  const verticesPerTriangleCount = 3;
  const totalVerticesCount =
    cubeSidesCount * trianglesPerCubeSideCount * verticesPerTriangleCount;

  ctx.drawArrays(ctx.TRIANGLES, 0, totalVerticesCount);
}
