import {degToRad} from '../../helpers';
import {createProgram} from '../../helpers/webgl';
import * as m4 from '../../helpers/m4';

import {cubeVertexCoords} from './geometry/cube-vertex-coords';
import {cubeTextureCoords} from './textures/cube-texture-coords';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import {IShaderDescriptor} from '../../helpers/webgl.types';
import State from '../../state/models/State';
import assertNotEmpty from '../../helpers/assertNotEmpty';
import {drawCubeSideCycle} from './cube-side-drawer';
import {ECubeSide} from '../../state/models/ECubeSide';

export function initSceneDrawer(state: State): void {
  const {scene} = state;

  const {ctx} = scene;
  assertNotEmpty(ctx);

  // setup GLSL program
  const shaderDescriptors: IShaderDescriptor[] = [
    {src: vertexShader, type: ctx.VERTEX_SHADER},
    {src: fragmentShader, type: ctx.FRAGMENT_SHADER},
  ];

  scene.program = createProgram(ctx, shaderDescriptors);

  // Tell it to use our program (pair of shaders)
  ctx.useProgram(scene.program);

  // look up where the vertex data needs to go.
  const cubeVertexCoordLocation = ctx.getAttribLocation(
    scene.program,
    'a_cube_vertex_coord'
  );

  const cubeVertexSideLocation = ctx.getAttribLocation(
    scene.program,
    'a_cube_vertex_side'
  );

  const cubeTextureCoordLocation = ctx.getAttribLocation(
    scene.program,
    'a_cube_texture_coord'
  );

  // lookup uniforms
  scene.matrixLocation = ctx.getUniformLocation(scene.program, 'u_matrix');

  // Create a buffer for positions
  const cubeVertexCoordsBuffer = ctx.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);
  // Put the positions in the buffer
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeVertexCoords, ctx.STATIC_DRAW);

  // provide texture coordinates for the rectangle.
  const gridTextureCoordBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, gridTextureCoordBuffer);
  // Set Texcoords.
  ctx.bufferData(ctx.ARRAY_BUFFER, cubeTextureCoords, ctx.STATIC_DRAW);

  // Turn on the position attribute
  ctx.enableVertexAttribArray(cubeVertexCoordLocation);

  // Bind the position buffer.
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  // Tell the position attribute how to get data out of positionBuffer
  // (ARRAY_BUFFER)
  let size = 3; // 3 components per iteration
  let type = ctx.FLOAT; // the data is 32bit floats
  let normalize = false; // don't normalize the data
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

  // Turn on the position attribute
  ctx.enableVertexAttribArray(cubeVertexSideLocation);

  // Bind the position buffer.
  ctx.bindBuffer(ctx.ARRAY_BUFFER, cubeVertexCoordsBuffer);

  // Tell the position attribute how to get data out of positionBuffer
  // (ARRAY_BUFFER)
  size = 1; // 1 components per iteration
  type = ctx.FLOAT; // the data is 32bit floats
  normalize = false; // don't normalize the data
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

  // Turn on the texcoord attribute
  ctx.enableVertexAttribArray(cubeTextureCoordLocation);

  // bind the texcoord buffer.
  ctx.bindBuffer(ctx.ARRAY_BUFFER, gridTextureCoordBuffer);

  // Tell the texcoord attribute how to get data out of texcoordBuffer
  // (ARRAY_BUFFER)
  size = 2; // 2 components per iteration
  type = ctx.FLOAT; // the data is 32bit floats
  normalize = false; // don't normalize the data
  stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  offset = 0; // start at the beginning of the buffer
  ctx.vertexAttribPointer(
    cubeTextureCoordLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

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

  scene.fieldOfViewRadians = degToRad(60);
  scene.modelXRotationRadians = degToRad(0);
  scene.modelYRotationRadians = degToRad(0);

  subscribeToEvents(state);
}

// TODO: move to events-manager
// TODO: add unsubscribe
export function subscribeToEvents(state: State): void {
  window.addEventListener('mousedown', () => onWindowMouseDown(state));
  window.addEventListener('mouseup', () => onWindowMouseUp(state));
  window.addEventListener('mousemove', (event) =>
    onWindowMouseMove(state, event)
  );
}

export function drawSceneCycle(state: State): void {
  state.scene.cube.sides.forEach((side) => {
    drawCubeSideCycle(state, side.side);
  });

  const {scene} = state;

  if (
    !scene.needsRedraw &&
    scene.cube.sides.every((s) => !s.needsUpdateOnCube)
  ) {
    return;
  }

  const {
    ctx,
    canvas,
    program,
    matrixLocation,
    fieldOfViewRadians,
    cubeTextures: cubeSideTextures,
    modelXRotationRadians,
    modelYRotationRadians,
  } = scene;

  assertNotEmpty(ctx);
  assertNotEmpty(canvas);
  assertNotEmpty(program);
  assertNotEmpty(matrixLocation);
  assertNotEmpty(fieldOfViewRadians);
  assertNotEmpty(cubeSideTextures);
  assertNotEmpty(modelXRotationRadians);
  assertNotEmpty(modelYRotationRadians);

  // Tell WebGL how to convert from clip space to pixels
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.enable(ctx.CULL_FACE);
  ctx.enable(ctx.DEPTH_TEST);

  // Clear the canvas AND the depth buffer.
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  state.scene.cube.sides.forEach((side) => {
    if (side.needsUpdateOnCube) {
      // console.log('update cube side on GPU', getCubeSideLabel(side.side));
      const canvas = side.canvas;
      assertNotEmpty(canvas);

      ctx.bindTexture(ctx.TEXTURE_2D, cubeSideTextures[side.side]);
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
    }
  });

  state.scene.cube.sides.forEach((side) => {
    ctx.activeTexture(ctx.TEXTURE0 + side.side);
    ctx.bindTexture(ctx.TEXTURE_2D, cubeSideTextures[side.side]);
  });

  // Compute the projection matrix
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

  const cameraPosition = [0, 0, 2];
  const up = [0, 1, 0];
  const target = [0, 0, 0];

  // Compute the camera's matrix using look at.
  const cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // Make a view matrix from the camera matrix.
  const viewMatrix = m4.inverse(cameraMatrix);

  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  let matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
  matrix = m4.yRotate(matrix, modelYRotationRadians);

  // Set the matrix.
  ctx.uniformMatrix4fv(matrixLocation, false, matrix);

  // Draw the geometry
  const cubeSidesCount = 6;
  const trianglesPerCubeSideCount = 2;
  const verticesPerTriangleCount = 3;
  const totalVerticesCount =
    cubeSidesCount * trianglesPerCubeSideCount * verticesPerTriangleCount;

  ctx.drawArrays(ctx.TRIANGLES, 0, totalVerticesCount);

  scene.needsRedraw = false;
}

export function onWindowMouseDown(state: State): void {
  state.scene.isDragging = true;
}

export function onWindowMouseUp(state: State): void {
  const {scene} = state;

  scene.isDragging = false;
  scene.clientX = undefined;
  scene.clientY = undefined;
}

export function onWindowMouseMove(state: State, e: MouseEvent): void {
  const {scene} = state;

  if (!scene.isDragging) {
    return;
  }

  if (e.which === 0) {
    // mouse button was released outside browser window
    onWindowMouseUp(state);
    return;
  }

  if (scene.clientX !== undefined && scene.clientY !== undefined) {
    const dx = scene.clientX - e.clientX;
    const dy = scene.clientY - e.clientY;

    assertNotEmpty(scene.modelXRotationRadians);
    assertNotEmpty(scene.modelYRotationRadians);

    scene.modelXRotationRadians -= dy * 0.01;
    scene.modelYRotationRadians -= dx * 0.01;

    scene.needsRedraw = true;
  }

  scene.clientX = e.clientX;
  scene.clientY = e.clientY;
}
