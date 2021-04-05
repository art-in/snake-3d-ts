type Range = [number, number];

// projects number from range A to range B linearly
export default function projectToRange(
  a: number,
  rangeA: Range,
  rangeB: Range
): number {
  const da = rangeA[1] - rangeA[0];
  const dn = a - rangeA[0];
  const ratio = dn / da;

  const db = rangeB[1] - rangeB[0];
  const b = rangeB[0] + db * ratio;

  return b;
}
