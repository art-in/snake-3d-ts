precision mediump float;

varying float v_cube_vertex_side;

void main() {
  if (v_cube_vertex_side == 0.0) {
    gl_FragColor = vec4(1, 0, 0, 1);
  } else
  if (v_cube_vertex_side == 1.0) {
    gl_FragColor = vec4(1, 1, 0, 1);
  } else
  if (v_cube_vertex_side == 2.0) {
    gl_FragColor = vec4(1, 0, 1, 1);
  } else
  if (v_cube_vertex_side == 3.0) {
    gl_FragColor = vec4(0, 1, 1, 1);
  } else
  if (v_cube_vertex_side == 4.0) {
    gl_FragColor = vec4(0, 1, 0, 1);
  } else
  if (v_cube_vertex_side == 5.0) {
    gl_FragColor = vec4(0, 0, 1, 1);
  }
}
