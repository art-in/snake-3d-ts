import normalizeByCircularRange from './normalize-by-circular-range';

export default function normalizeDegrees(degrees: Degrees): Degrees {
  return normalizeByCircularRange(degrees, -180, 181);
}
