import ICubePosition from '../models/ICubePosition';
import IModelRotation from '../models/IModelRotation';
import IGrid from '../models/IGrid';
import getPosition3dForCubePosition from './get-position-3d-for-cube-position';
import getAngleBetweenVectors from './get-angle-between-vectors';
import normalizeDegrees from './normalize-degrees';
import {radToDeg} from './rad-to-deg';

export default function getCubeRotationForPosition(
  pos: ICubePosition,
  grid: IGrid
): IModelRotation {
  const pos3d = getPosition3dForCubePosition(pos, grid);

  // angle around X axis
  const xVector = {...pos3d, y: 0};
  const xAngleRad = Math.sign(pos3d.y) * getAngleBetweenVectors(pos3d, xVector);

  // angle around Y axis
  const yVector = {...pos3d, x: 0};
  let yAngleRad = -Math.sign(pos3d.x) * getAngleBetweenVectors(pos3d, yVector);
  yAngleRad = pos3d.z < 0 ? Math.PI - yAngleRad : yAngleRad;

  return {
    x: Math.round(normalizeDegrees(radToDeg(xAngleRad))),
    y: Math.round(normalizeDegrees(radToDeg(yAngleRad))),
  };
}
