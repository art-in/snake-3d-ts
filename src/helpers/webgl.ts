import {TShaderType, IShaderDescriptor} from './webgl.types';

export function createShader(
  ctx: WebGLRenderingContext,
  type: TShaderType,
  source: string
): WebGLShader {
  const shader = ctx.createShader(type);

  if (!shader) {
    throw Error('Failed to create shader');
  }

  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);

  const compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
  if (!compiled) {
    const lastError = ctx.getShaderInfoLog(shader);
    ctx.deleteShader(shader);
    throw Error('Failed to compile shader: ' + lastError);
  }

  return shader;
}

export function createProgram(
  ctx: WebGLRenderingContext,
  shaders: IShaderDescriptor[]
): WebGLProgram {
  const program = ctx.createProgram();

  if (!program) {
    throw Error('Failed to create program');
  }

  shaders.forEach((shaderDesc) => {
    const shader = createShader(ctx, shaderDesc.type, shaderDesc.src);
    ctx.attachShader(program, shader);
  });

  ctx.linkProgram(program);

  const linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
  if (!linked) {
    const lastError = ctx.getProgramInfoLog(program);
    ctx.deleteProgram(program);
    throw Error('Failed to link program:' + lastError);
  }

  return program;
}

export function getUniformLocation(
  ctx: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
): WebGLUniformLocation {
  const loc = ctx.getUniformLocation(program, name);
  if (loc === null) {
    throw Error(`Failed to get uniform location: ${name}`);
  }
  return loc;
}

export function getAttributeLocation(
  ctx: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
): number {
  const loc = ctx.getAttribLocation(program, name);
  if (loc < 0) {
    throw Error(`Failed to get attribute location: ${name}`);
  }
  return loc;
}
