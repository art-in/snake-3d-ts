export type TVec3 = number[] | Float32Array;
export type TMatrix4 = number[] | Float32Array;

/**
 * Takes two 4-by-4 matrices, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, this function returns
 * the same object in both row-major and column-major mode.
 * @param {TMatrix4} a A matrix.
 * @param {TMatrix4} b A matrix.
 * @param {TMatrix4} [dst] optional matrix to store result
 * @return {TMatrix4} dst or a new matrix if none provided
 */
export function multiply(a: TMatrix4, b: TMatrix4): TMatrix4 {
  const res = new Float32Array(16);

  const b00 = b[0 * 4 + 0];
  const b01 = b[0 * 4 + 1];
  const b02 = b[0 * 4 + 2];
  const b03 = b[0 * 4 + 3];
  const b10 = b[1 * 4 + 0];
  const b11 = b[1 * 4 + 1];
  const b12 = b[1 * 4 + 2];
  const b13 = b[1 * 4 + 3];
  const b20 = b[2 * 4 + 0];
  const b21 = b[2 * 4 + 1];
  const b22 = b[2 * 4 + 2];
  const b23 = b[2 * 4 + 3];
  const b30 = b[3 * 4 + 0];
  const b31 = b[3 * 4 + 1];
  const b32 = b[3 * 4 + 2];
  const b33 = b[3 * 4 + 3];
  const a00 = a[0 * 4 + 0];
  const a01 = a[0 * 4 + 1];
  const a02 = a[0 * 4 + 2];
  const a03 = a[0 * 4 + 3];
  const a10 = a[1 * 4 + 0];
  const a11 = a[1 * 4 + 1];
  const a12 = a[1 * 4 + 2];
  const a13 = a[1 * 4 + 3];
  const a20 = a[2 * 4 + 0];
  const a21 = a[2 * 4 + 1];
  const a22 = a[2 * 4 + 2];
  const a23 = a[2 * 4 + 3];
  const a30 = a[3 * 4 + 0];
  const a31 = a[3 * 4 + 1];
  const a32 = a[3 * 4 + 2];
  const a33 = a[3 * 4 + 3];

  res[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
  res[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
  res[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
  res[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
  res[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
  res[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
  res[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
  res[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
  res[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
  res[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
  res[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
  res[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
  res[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
  res[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
  res[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
  res[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

  return res;
}

/**
 * normalizes a vector.
 * @param {Vector3} v vector to normalize
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */
export function normalize(v: Float32Array): Float32Array {
  const res = new Float32Array(3);

  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

  // make sure we don't divide by 0.
  if (length > 0.00001) {
    res[0] = v[0] / length;
    res[1] = v[1] / length;
    res[2] = v[2] / length;
  }

  return res;
}

/**
 * subtracts 2 vectors3s
 * @param {Vector3} a a
 * @param {Vector3} b b
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */
export function subtractVectors(a: TVec3, b: TVec3): Float32Array {
  const res = new Float32Array(3);

  res[0] = a[0] - b[0];
  res[1] = a[1] - b[1];
  res[2] = a[2] - b[2];

  return res;
}

/**
 * Computes the cross product of 2 vectors3s
 * @param {Vector3} a a
 * @param {Vector3} b b
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */
export function cross(a: TVec3, b: TVec3): Float32Array {
  const res = new Float32Array(3);

  res[0] = a[1] * b[2] - a[2] * b[1];
  res[1] = a[2] * b[0] - a[0] * b[2];
  res[2] = a[0] * b[1] - a[1] * b[0];

  return res;
}

/**
 * Creates a lookAt matrix.
 * This is a world matrix for a camera. In other words it will transform
 * from the origin to a place and orientation in the world. For a view
 * matrix take the inverse of this.
 * @param {Vector3} cameraPosition position of the camera
 * @param {Vector3} target position of the target
 * @param {Vector3} up direction
 * @param {TMatrix4} [dst] optional matrix to store result
 * @return {TMatrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function lookAt(
  cameraPosition: TVec3,
  target: TVec3,
  up: TVec3
): TMatrix4 {
  const res = new Float32Array(16);

  const zAxis = normalize(subtractVectors(cameraPosition, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = normalize(cross(zAxis, xAxis));

  res[0] = xAxis[0];
  res[1] = xAxis[1];
  res[2] = xAxis[2];
  res[3] = 0;
  res[4] = yAxis[0];
  res[5] = yAxis[1];
  res[6] = yAxis[2];
  res[7] = 0;
  res[8] = zAxis[0];
  res[9] = zAxis[1];
  res[10] = zAxis[2];
  res[11] = 0;
  res[12] = cameraPosition[0];
  res[13] = cameraPosition[1];
  res[14] = cameraPosition[2];
  res[15] = 1;

  return res;
}

/**
 * Computes the inverse of a matrix.
 * @param {TMatrix4} m matrix to compute inverse of
 * @param {TMatrix4} [dst] optional matrix to store result
 * @return {TMatrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function inverse(m: TMatrix4): TMatrix4 {
  const res = new Float32Array(16);
  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const m30 = m[3 * 4 + 0];
  const m31 = m[3 * 4 + 1];
  const m32 = m[3 * 4 + 2];
  const m33 = m[3 * 4 + 3];
  const tmp_0 = m22 * m33;
  const tmp_1 = m32 * m23;
  const tmp_2 = m12 * m33;
  const tmp_3 = m32 * m13;
  const tmp_4 = m12 * m23;
  const tmp_5 = m22 * m13;
  const tmp_6 = m02 * m33;
  const tmp_7 = m32 * m03;
  const tmp_8 = m02 * m23;
  const tmp_9 = m22 * m03;
  const tmp_10 = m02 * m13;
  const tmp_11 = m12 * m03;
  const tmp_12 = m20 * m31;
  const tmp_13 = m30 * m21;
  const tmp_14 = m10 * m31;
  const tmp_15 = m30 * m11;
  const tmp_16 = m10 * m21;
  const tmp_17 = m20 * m11;
  const tmp_18 = m00 * m31;
  const tmp_19 = m30 * m01;
  const tmp_20 = m00 * m21;
  const tmp_21 = m20 * m01;
  const tmp_22 = m00 * m11;
  const tmp_23 = m10 * m01;

  const t0 =
    tmp_0 * m11 +
    tmp_3 * m21 +
    tmp_4 * m31 -
    (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  const t1 =
    tmp_1 * m01 +
    tmp_6 * m21 +
    tmp_9 * m31 -
    (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  const t2 =
    tmp_2 * m01 +
    tmp_7 * m11 +
    tmp_10 * m31 -
    (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  const t3 =
    tmp_5 * m01 +
    tmp_8 * m11 +
    tmp_11 * m21 -
    (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  res[0] = d * t0;
  res[1] = d * t1;
  res[2] = d * t2;
  res[3] = d * t3;
  res[4] =
    d *
    (tmp_1 * m10 +
      tmp_2 * m20 +
      tmp_5 * m30 -
      (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  res[5] =
    d *
    (tmp_0 * m00 +
      tmp_7 * m20 +
      tmp_8 * m30 -
      (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  res[6] =
    d *
    (tmp_3 * m00 +
      tmp_6 * m10 +
      tmp_11 * m30 -
      (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  res[7] =
    d *
    (tmp_4 * m00 +
      tmp_9 * m10 +
      tmp_10 * m20 -
      (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  res[8] =
    d *
    (tmp_12 * m13 +
      tmp_15 * m23 +
      tmp_16 * m33 -
      (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  res[9] =
    d *
    (tmp_13 * m03 +
      tmp_18 * m23 +
      tmp_21 * m33 -
      (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  res[10] =
    d *
    (tmp_14 * m03 +
      tmp_19 * m13 +
      tmp_22 * m33 -
      (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  res[11] =
    d *
    (tmp_17 * m03 +
      tmp_20 * m13 +
      tmp_23 * m23 -
      (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  res[12] =
    d *
    (tmp_14 * m22 +
      tmp_17 * m32 +
      tmp_13 * m12 -
      (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  res[13] =
    d *
    (tmp_20 * m32 +
      tmp_12 * m02 +
      tmp_19 * m22 -
      (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  res[14] =
    d *
    (tmp_18 * m12 +
      tmp_23 * m32 +
      tmp_15 * m02 -
      (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  res[15] =
    d *
    (tmp_22 * m22 +
      tmp_16 * m02 +
      tmp_21 * m12 -
      (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

  return res;
}

/**
 * Multiply by translation matrix.
 * @param {Matrix4} m matrix to multiply
 * @param {number} tx x translation.
 * @param {number} ty y translation.
 * @param {number} tz z translation.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function translate(
  m: TMatrix4,
  tx: number,
  ty: number,
  tz: number
): TMatrix4 {
  // This is the optimized version of
  // return multiply(m, translation(tx, ty, tz), dst);
  const dst = new Float32Array(16);

  const m00 = m[0];
  const m01 = m[1];
  const m02 = m[2];
  const m03 = m[3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const m30 = m[3 * 4 + 0];
  const m31 = m[3 * 4 + 1];
  const m32 = m[3 * 4 + 2];
  const m33 = m[3 * 4 + 3];

  if (m !== dst) {
    dst[0] = m00;
    dst[1] = m01;
    dst[2] = m02;
    dst[3] = m03;
    dst[4] = m10;
    dst[5] = m11;
    dst[6] = m12;
    dst[7] = m13;
    dst[8] = m20;
    dst[9] = m21;
    dst[10] = m22;
    dst[11] = m23;
  }

  dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
  dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
  dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
  dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

  return dst;
}

/**
 * Multiply by an x rotation matrix
 * @param {TMatrix4} m matrix to multiply
 * @param {number} angleInRadians amount to rotate
 * @param {TMatrix4} [dst] optional matrix to store result
 * @return {TMatrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function xRotate(m: TMatrix4, angleInRadians: number): TMatrix4 {
  // this is the optimized version of
  // return multiply(m, xRotation(angleInRadians), dst);
  const res = new Float32Array(16);

  const m10 = m[4];
  const m11 = m[5];
  const m12 = m[6];
  const m13 = m[7];
  const m20 = m[8];
  const m21 = m[9];
  const m22 = m[10];
  const m23 = m[11];
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  res[4] = c * m10 + s * m20;
  res[5] = c * m11 + s * m21;
  res[6] = c * m12 + s * m22;
  res[7] = c * m13 + s * m23;
  res[8] = c * m20 - s * m10;
  res[9] = c * m21 - s * m11;
  res[10] = c * m22 - s * m12;
  res[11] = c * m23 - s * m13;

  if (m !== res) {
    res[0] = m[0];
    res[1] = m[1];
    res[2] = m[2];
    res[3] = m[3];
    res[12] = m[12];
    res[13] = m[13];
    res[14] = m[14];
    res[15] = m[15];
  }

  return res;
}

/**
 * Multiply by an y rotation matrix
 * @param {TMatrix4} m matrix to multiply
 * @param {number} angleInRadians amount to rotate
 * @param {TMatrix4} [dst] optional matrix to store result
 * @return {TMatrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function yRotate(m: TMatrix4, angleInRadians: number): TMatrix4 {
  // this is the optimized version of
  // return multiply(m, yRotation(angleInRadians), dst);
  const res = new Float32Array(16);

  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  res[0] = c * m00 - s * m20;
  res[1] = c * m01 - s * m21;
  res[2] = c * m02 - s * m22;
  res[3] = c * m03 - s * m23;
  res[8] = c * m20 + s * m00;
  res[9] = c * m21 + s * m01;
  res[10] = c * m22 + s * m02;
  res[11] = c * m23 + s * m03;

  if (m !== res) {
    res[4] = m[4];
    res[5] = m[5];
    res[6] = m[6];
    res[7] = m[7];
    res[12] = m[12];
    res[13] = m[13];
    res[14] = m[14];
    res[15] = m[15];
  }

  return res;
}

/**
 * Multiply by a scaling matrix
 * @param {Matrix4} m matrix to multiply
 * @param {number} sx x scale.
 * @param {number} sy y scale.
 * @param {number} sz z scale.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function scale(
  m: TMatrix4,
  sx: number,
  sy: number,
  sz: number
): TMatrix4 {
  // This is the optimized version of
  // return multiply(m, scaling(sx, sy, sz), dst);
  const res = new Float32Array(16);

  res[0] = sx * m[0 * 4 + 0];
  res[1] = sx * m[0 * 4 + 1];
  res[2] = sx * m[0 * 4 + 2];
  res[3] = sx * m[0 * 4 + 3];
  res[4] = sy * m[1 * 4 + 0];
  res[5] = sy * m[1 * 4 + 1];
  res[6] = sy * m[1 * 4 + 2];
  res[7] = sy * m[1 * 4 + 3];
  res[8] = sz * m[2 * 4 + 0];
  res[9] = sz * m[2 * 4 + 1];
  res[10] = sz * m[2 * 4 + 2];
  res[11] = sz * m[2 * 4 + 3];

  if (m !== res) {
    res[12] = m[12];
    res[13] = m[13];
    res[14] = m[14];
    res[15] = m[15];
  }

  return res;
}

/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from -1 to 1 in the z dimension.
 * @param {number} fieldOfViewInRadians field of view in y axis.
 * @param {number} aspect aspect of viewport (width / height)
 * @param {number} near near Z clipping plane
 * @param {number} far far Z clipping plane
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function perspective(
  fieldOfViewInRadians: number,
  aspect: number,
  near: number,
  far: number
): TMatrix4 {
  const res = new Float32Array(16);
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  const rangeInv = 1.0 / (near - far);

  res[0] = f / aspect;
  res[1] = 0;
  res[2] = 0;
  res[3] = 0;
  res[4] = 0;
  res[5] = f;
  res[6] = 0;
  res[7] = 0;
  res[8] = 0;
  res[9] = 0;
  res[10] = (near + far) * rangeInv;
  res[11] = -1;
  res[12] = 0;
  res[13] = 0;
  res[14] = near * far * rangeInv * 2;
  res[15] = 0;

  return res;
}
