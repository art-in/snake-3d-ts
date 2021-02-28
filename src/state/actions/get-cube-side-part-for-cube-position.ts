import {cubeSideAxisPartMatrix} from '../../drawers/scene/geometry/cube-side-axis-part-matrix';
import assertNotEmpty from '../../helpers/assertNotEmpty';
import {EAxisPart} from '../models/EAxisPart';
import {ECubeSidePart} from '../models/ECubeSidePart';
import Grid from '../models/Grid';
import {ICubePosition} from '../models/IGridPosition';

export default function getCubeSidePartForCubePosition(
  pos: ICubePosition,
  grid: Grid
): ECubeSidePart {
  const horiz = getSidePartByAxis(pos.gridCol, grid.colsCount);
  const vert = getSidePartByAxis(pos.gridRow, grid.rowsCount);

  const entry = cubeSideAxisPartMatrix.find(
    ([[h, v]]) => h === horiz && v === vert
  );

  assertNotEmpty(entry);

  return entry[1];
}

function getSidePartByAxis(axisPos: number, axisLength: number): EAxisPart {
  const ratio = axisPos / (axisLength - 1);

  if (ratio < 1 / 3) {
    return EAxisPart.Start;
  }

  if (ratio < 2 / 3) {
    return EAxisPart.Center;
  }

  return EAxisPart.End;
}
