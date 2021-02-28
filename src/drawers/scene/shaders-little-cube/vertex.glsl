attribute vec4 a_cube_vertex_coord;
attribute float a_cube_vertex_side;

uniform mat4 u_matrix;

varying float v_cube_vertex_side;

void main() {
  gl_Position = u_matrix * a_cube_vertex_coord;
  v_cube_vertex_side = a_cube_vertex_side;
}
