precision mediump float;

varying vec2 v_cube_texture_coord;
varying float v_cube_vertex_side;

uniform sampler2D u_cube_texture_side_0;
uniform sampler2D u_cube_texture_side_1;
uniform sampler2D u_cube_texture_side_2;
uniform sampler2D u_cube_texture_side_3;
uniform sampler2D u_cube_texture_side_4;
uniform sampler2D u_cube_texture_side_5;

void main() {
  if (v_cube_vertex_side == 0.0) {
    gl_FragColor = texture2D(u_cube_texture_side_0, v_cube_texture_coord);
  } else
  if (v_cube_vertex_side == 1.0) {
    gl_FragColor = texture2D(u_cube_texture_side_1, v_cube_texture_coord);
  } else
  if (v_cube_vertex_side == 2.0) {
    gl_FragColor = texture2D(u_cube_texture_side_2, v_cube_texture_coord);
  } else
  if (v_cube_vertex_side == 3.0) {
    gl_FragColor = texture2D(u_cube_texture_side_3, v_cube_texture_coord);
  } else
  if (v_cube_vertex_side == 4.0) {
    gl_FragColor = texture2D(u_cube_texture_side_4, v_cube_texture_coord);
  } else
  if (v_cube_vertex_side == 5.0) {
    gl_FragColor = texture2D(u_cube_texture_side_5, v_cube_texture_coord);
  }
}
