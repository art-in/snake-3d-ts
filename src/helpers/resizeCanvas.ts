import ISize from '../state/models/ISize';

export default function resizeCanvas(
  canvas: HTMLCanvasElement,
  cssSize: ISize,
  pixelRatio: number
): void {
  canvas.width = cssSize.width * pixelRatio;
  canvas.height = cssSize.height * pixelRatio;

  canvas.style.width = `${cssSize.width}px`;
  canvas.style.height = `${cssSize.height}px`;
}
