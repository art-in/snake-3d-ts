import IPoint3D from '../models/IPoint3D';

export default function getAngleBetweenVectors(
  a: IPoint3D,
  b: IPoint3D
): Radians {
  const dotProduct = a.x * b.x + a.y * b.y + a.z * b.z;

  const aLength = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  const bLength = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
  const lengthMult = aLength * bLength;

  const angleCos = dotProduct / lengthMult;

  return Math.acos(angleCos);
}
