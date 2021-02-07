export type TShaderType =
  | typeof WebGLRenderingContext.VERTEX_SHADER
  | typeof WebGLRenderingContext.FRAGMENT_SHADER;

export interface IShaderDescriptor {
  type: TShaderType;
  src: string;
}
