import normalizeDegrees from '../../helpers/normalize-degrees';
import projectToRange from '../../helpers/projectToRange';
import State from '../models/State';

const AUTO_ROTATION_STEP_MIN = 0.5;
const AUTO_ROTATION_STEP_MAX = 10;
const AUTO_ROTATION_STEP_RANGE: [number, number] = [
  AUTO_ROTATION_STEP_MIN,
  AUTO_ROTATION_STEP_MAX,
];
const AUTO_ROTATION_ANGLE_RANGE: [number, number] = [0, 180];

export function autoRotateCycle(state: State): void {
  const {scene} = state;
  const {cube} = scene;

  const {currentRotation, targetRotation} = scene.cube;

  if (currentRotation.x !== targetRotation.x) {
    currentRotation.x = makeRotationStep(currentRotation.x, targetRotation.x);
  }

  if (currentRotation.y !== targetRotation.y) {
    currentRotation.y = makeRotationStep(currentRotation.y, targetRotation.y);
  }

  if (
    cube.currentRotation.x !== cube.targetRotation.x ||
    cube.currentRotation.y !== cube.targetRotation.y
  ) {
    cube.needsRedraw = true;
  }
}

function makeRotationStep(
  currentRotation: number,
  targetRotation: number
): number {
  const angleDiff = Math.min(
    Math.abs(currentRotation - targetRotation),
    Math.abs(currentRotation - targetRotation - 360),
    Math.abs(currentRotation - targetRotation + 360)
  );

  if (angleDiff < AUTO_ROTATION_STEP_MIN) {
    return targetRotation;
  } else {
    const rotationStep = projectToRange(
      angleDiff,
      AUTO_ROTATION_ANGLE_RANGE,
      AUTO_ROTATION_STEP_RANGE
    );
    const nextCurrentRotation =
      currentRotation +
      rotationStep * getRotationDirection(currentRotation, targetRotation);
    return normalizeDegrees(nextCurrentRotation);
  }
}

function getRotationDirection(fromDeg: number, toDeg: number): number {
  if (fromDeg === toDeg) {
    return 0;
  }

  if (fromDeg >= 0 && toDeg >= 0) {
    return fromDeg > toDeg ? -1 : 1;
  }

  if (fromDeg <= 0 && toDeg <= 0) {
    return fromDeg > toDeg ? -1 : 1;
  }

  if (fromDeg >= 0 && toDeg <= 0) {
    return fromDeg - toDeg <= 180 ? -1 : 1;
  }

  if (fromDeg <= 0 && toDeg >= 0) {
    return -fromDeg + toDeg < 180 ? 1 : -1;
  }

  throw Error('Should not be here');
}
