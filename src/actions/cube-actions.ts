import getCubeRotationForPosition from '../helpers/get-cube-rotation-for-position';
import normalizeDegrees from '../helpers/normalize-degrees';
import projectToRange from '../helpers/project-to-range';
import ECameraMode from '../models/ECameraMode';
import GameState from '../models/GameState';

const AUTO_ROTATION_STEP_RANGE: [number, number] = [0.5, 10];
const AUTO_ROTATION_ANGLE_RANGE: [number, number] = [0, 180];

export function autoRotateLoop(state: GameState): void {
  const {scene} = state;
  const {cube} = scene;

  const {currentRotation, targetRotation} = cube;

  if (cube.cameraMode === ECameraMode.Overview) {
    targetRotation.y = normalizeDegrees(targetRotation.y - 0.3);
  }

  if (cube.cameraMode === ECameraMode.FollowSnake) {
    const head = state.snake.parts[0];
    cube.targetRotation = getCubeRotationForPosition(head, cube.grid);
  }

  if (
    cube.currentRotation.x !== cube.targetRotation.x ||
    cube.currentRotation.y !== cube.targetRotation.y
  ) {
    cube.needsRedraw = true;
  }

  if (currentRotation.x !== targetRotation.x) {
    currentRotation.x = makeRotationStep(currentRotation.x, targetRotation.x);
  }

  if (currentRotation.y !== targetRotation.y) {
    currentRotation.y = makeRotationStep(currentRotation.y, targetRotation.y);
  }
}

function makeRotationStep(
  currentAngle: Degrees,
  targetAngle: Degrees
): Degrees {
  const angleDiff = Math.min(
    Math.abs(currentAngle - targetAngle),
    Math.abs(currentAngle - targetAngle - 360),
    Math.abs(currentAngle - targetAngle + 360)
  );

  if (angleDiff < AUTO_ROTATION_STEP_RANGE[0]) {
    return targetAngle;
  }

  const rotationStep = projectToRange(
    angleDiff,
    AUTO_ROTATION_ANGLE_RANGE,
    AUTO_ROTATION_STEP_RANGE
  );
  const nextCurrentRotation =
    currentAngle +
    rotationStep * getRotationDirection(currentAngle, targetAngle);
  return normalizeDegrees(nextCurrentRotation);
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

  throw Error('unreachable');
}
