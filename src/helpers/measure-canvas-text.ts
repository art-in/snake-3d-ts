import ISize from '../state/models/ISize';

export default function measureCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string
): ISize {
  const textSize = ctx.measureText(text);

  return {
    width: Math.ceil(textSize.width),
    height: Math.ceil(textSize.actualBoundingBoxAscent),
  };
}
