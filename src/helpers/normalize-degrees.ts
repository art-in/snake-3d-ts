import normalizeByCircularRange from './normalize-by-circular-range';

export default function normalizeDegrees(degrees: number): number {
  return normalizeByCircularRange(degrees, -180, 181);
}
