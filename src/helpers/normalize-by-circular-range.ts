// normalizes any number to an arbitrary range
// by assuming the range wraps around when going below min or above max
export default function normalizeByCircularRange(
  value: number,
  start: number,
  end: number
): number {
  const width = end - start;
  const offsetValue = value - start; // value relative to 0

  return offsetValue - Math.floor(offsetValue / width) * width + start;
  // + start to reset back to start of original range
}
