import GameState from '../../models/GameState';
import {
  createProgram,
  getAttributeLocation,
  getUniformLocation,
  vertexAttributePointer,
} from '../../helpers/webgl';
import * as gmath from '../../helpers/graphics-math';
import {IShaderDescriptor} from '../../helpers/webgl.types';
import assertNotEmpty from '../../helpers/assert-not-empty';
import Cube from '../../models/Cube';
import ECubeSide from '../../models/ECubeSide';
import {degToRad} from '../../helpers/deg-to-rad';
import {cubeVertexCoords} from './geometry/cube-vertex-coords';
import {cubeTextureCoords} from './geometry/cube-texture-coords';
import cubeVertexShader from './shaders/vertex.glsl';
import cubeFragmentShader from './shaders/fragment.glsl';

const FIELD_OF_VIEW_RAD = degToRad(60);

export function initCubeDrawer(state: GameState): void {
  const {scene} = state;
  assertNotEmpty(scene.canvas);

  const ctx = scene.canvas.getContext('webgl');
  assertNotEmpty(ctx, 'Failed to get webgl context');
  state.scene.ctx = ctx;

  const {cube} = scene;

  // compile GLSL shaders for cube
  const shaderDescriptors: IShaderDescriptor[] = [
    {src: cubeVertexShader, type: ctx.VERTEX_SHADER},
    {src: cubeFragmentShader, type: ctx.FRAGMENT_SHADER},
  ];

  const program = (cube.program = createProgram(ctx, shaderDescriptors));
  ctx.useProgram(program);

  // lookup locations for attributes/uniforms
  const cubeVertexCoordLocation = getAttributeLocation(
    ctx,
    program,
    'a_cube_vertex_coord'
  );
  const cubeVertexSideLocation = getAttributeLocation(
    ctx,
    program,
    'a_cube_vertex_side'
  );
  const cubeTextureCoordLocation = getAttributeLocation(
    ctx,
    program,
    'a_cube_texture_coord'
  );
  cube.matrixUniformLocation = getUniformLocation(ctx, program, 'u_matrix');

  // pass buffer with vertex coordinates
  const cubeVertexCoordsBuffer = ctx.createBuffer();
  assertNotEmpty(cubeVertexCoordsBuffer);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeVertexCoords, ctx.STATIC_DRAW);

  // pass buffer with texture coordinates
  const cubeTextureCoordsBuffer = ctx.createBuffer();
  assertNotEmpty(cubeTextureCoordsBuffer);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeTextureCoordsBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeTextureCoords, ctx.STATIC_DRAW);

  // define how to extract coordinates from vertex buffer
  ctx.enableVertexAttribArray(cubeVertexCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  vertexAttributePointer(ctx, {
    location: cubeVertexCoordLocation,
    size: 3, // 3 components per iteration
    type: ctx.FLOAT, // the data is 32bit floats
    normalize: false,
    stride: 16, // (bytes) each vertex consists of 4 x 4-byte floats (side, x, y, z)
    offset: 4, // (bytes) skip side float
  });

  // define how to extract cube side index from vertex buffer
  ctx.enableVertexAttribArray(cubeVertexSideLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  vertexAttributePointer(ctx, {
    location: cubeVertexSideLocation,
    size: 1,
    type: ctx.FLOAT,
    normalize: false,
    stride: 16,
    offset: 0,
  });

  // define how to extract coordinates from texture coordinates buffer
  ctx.enableVertexAttribArray(cubeTextureCoordLocation);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeTextureCoordsBuffer);

  vertexAttributePointer(ctx, {
    location: cubeTextureCoordLocation,
    size: 2,
    type: ctx.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
  });

  // create textures for cube sides
  const cubeTextures: WebGLTexture[] = [];
  for (let side: ECubeSide = 0; side < 6; side++) {
    const texture: WebGLTexture | null = ctx.createTexture();
    assertNotEmpty(texture);
    cubeTextures.push(texture);

    // bind uniform with texture unit
    const cubeTextureSideLocation = ctx.getUniformLocation(
      program,
      'u_cube_texture_side_' + side
    );

    ctx.uniform1i(cubeTextureSideLocation, side);
  }

  cube.textures = cubeTextures;

  // pass texture data for the first time (update later in draw loop)
  cube.sides.forEach((side) => {
    const canvas = side.canvas;
    assertNotEmpty(canvas);

    ctx.activeTexture(ctx.TEXTURE0 + side.type); // select texture unit
    ctx.bindTexture(ctx.TEXTURE_2D, cubeTextures[side.type]);
    ctx.texImage2D(
      ctx.TEXTURE_2D, // target
      0, // level
      ctx.RGBA, // internal format
      ctx.RGBA, // format
      ctx.UNSIGNED_BYTE, // type
      canvas // source
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

export function drawCubeLoop(state: GameState): void {
  const {scene} = state;
  const {canvas, ctx, cube} = scene;

  assertNotEmpty(canvas);
  assertNotEmpty(ctx);

  if (!shouldRedrawCube(cube)) {
    return;
  }

  // define how to convert from clip space to canvas pixels
  ctx.viewport(0, 0, canvas.width, canvas.height);

  ctx.enable(ctx.CULL_FACE);
  ctx.enable(ctx.DEPTH_TEST);

  // clear the canvas and the depth buffer
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  // calculate transformation matrix
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projectionMatrix = gmath.perspective(
    FIELD_OF_VIEW_RAD,
    aspect,
    1,
    2000
  );

  const cameraPosition = [0, 0, 2];
  const up = [0, 1, 0];
  const target = [0, 0, 0];

  const cameraMatrix = gmath.lookAt(cameraPosition, target, up);
  const viewMatrix = gmath.inverse(cameraMatrix);
  const viewProjectionMatrix = gmath.multiply(projectionMatrix, viewMatrix);

  let matrix = gmath.xRotate(
    viewProjectionMatrix,
    degToRad(cube.currentRotation.x)
  );
  matrix = gmath.yRotate(matrix, degToRad(cube.currentRotation.y));

  drawCube(state, matrix);
}

function drawCube(state: GameState, matrix: gmath.TMatrix4) {
  const {ctx, cube} = state.scene;

  assertNotEmpty(ctx);
  assertNotEmpty(cube.program);

  ctx.useProgram(cube.program);

  // update texture data if needed
  cube.sides.forEach((side) => {
    if (side.needsUpdateOnCube) {
      assertNotEmpty(side.canvas);
      assertNotEmpty(cube.textures);

      ctx.activeTexture(ctx.TEXTURE0 + side.type); // select texture unit
      ctx.bindTexture(ctx.TEXTURE_2D, cube.textures[side.type]);
      ctx.texSubImage2D(
        ctx.TEXTURE_2D, // target
        0, // level
        0, // offset x
        0, // offset y
        ctx.RGBA, // format
        ctx.UNSIGNED_BYTE, // type
        side.canvas // source
      );

      side.needsUpdateOnCube = false;
    }
  });

  // pass transformation matrix
  assertNotEmpty(cube.matrixUniformLocation);
  ctx.uniformMatrix4fv(cube.matrixUniformLocation, false, matrix);

  // draw the geometry
  const CUBE_VERTICES_COUNT =
    6 * // cube sides
    2 * // triangles per cube side
    3; // vertices per triangle

  ctx.drawArrays(ctx.TRIANGLES, 0, CUBE_VERTICES_COUNT);

  cube.needsRedraw = false;
}
