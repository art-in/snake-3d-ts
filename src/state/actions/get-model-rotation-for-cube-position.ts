import {cubeSidePartRotationMatrix} from '../../drawers/scene/geometry/cube-side-part-rotation-matrix';
import {radToDeg} from '../../helpers';
import clone from '../../helpers/clone';
import normalizeDegrees from '../../helpers/normalize-degrees';
import {ICubePosition} from '../../state/models/IGridPosition';
import IModelRotationDeg from '../../state/models/IModelRotationDeg';
import Grid from '../models/Grid';
import getCubeSidePartForCubePosition from './get-cube-side-part-for-cube-position';
import {getPosition3dForCubePosition} from './get-position-3d-for-cube-position';

export default function getModelRotationForCubePosition(
  pos: ICubePosition,
  grid: Grid
): IModelRotationDeg {
  // const cubeSidePart = getCubeSidePartForCubePosition(pos, grid);
  // const rotation = clone(
  //   cubeSidePartRotationMatrix[pos.cubeSide][cubeSidePart]
  // );

  const pos3d = getPosition3dForCubePosition(pos, grid);

  // calculate angle around X axis
  const xVector = {x: pos3d.x, y: 0, z: pos3d.z};

  const xDotProduct =
    pos3d.x * xVector.x + pos3d.y * xVector.y + pos3d.z * xVector.z;
  const xLengthMult =
    Math.sqrt(pos3d.x * pos3d.x + pos3d.y * pos3d.y + pos3d.z * pos3d.z) *
    Math.sqrt(
      xVector.x * xVector.x + xVector.y * xVector.y + xVector.z * xVector.z
    );

  const xCosAngleRatio = xDotProduct / xLengthMult;
  const xAngleRad = Math.sign(pos3d.y) * Math.acos(xCosAngleRatio);

  // calculate angle around Y axis
  const yVector = {x: 0, y: pos3d.y, z: pos3d.z};

  const yDotProduct =
    pos3d.x * yVector.x + pos3d.y * yVector.y + pos3d.z * yVector.z;
  const yLengthMult =
    Math.sqrt(pos3d.x * pos3d.x + pos3d.y * pos3d.y + pos3d.z * pos3d.z) *
    Math.sqrt(
      yVector.x * yVector.x + yVector.y * yVector.y + yVector.z * yVector.z
    );

  const yCosAngleRatio = yDotProduct / yLengthMult;
  let yAngleRad = -Math.sign(pos3d.x) * Math.acos(yCosAngleRatio);
  yAngleRad = pos3d.z < 0 ? Math.PI - yAngleRad : yAngleRad;

  return {
    x: Math.round(normalizeDegrees(radToDeg(xAngleRad))),
    y: Math.round(normalizeDegrees(radToDeg(yAngleRad))),
  };
}
