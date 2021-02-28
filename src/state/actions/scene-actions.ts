import assertNotEmpty from '../../helpers/assertNotEmpty';
import normalizeDegrees from '../../helpers/normalize-degrees';
import projectToRange from '../../helpers/projectToRange';
import State from '../models/State';
import {initCubeSideState} from './cube-side-actions';
import {moveSnakeCycle} from './snake-actions';

const AUTO_ROTATION_STEP_MIN = 1;
const AUTO_ROTATION_STEP_MAX = 10;
const AUTO_ROTATION_STEP_RANGE: [number, number] = [
  AUTO_ROTATION_STEP_MIN,
  AUTO_ROTATION_STEP_MAX,
];
const AUTO_ROTATION_ANGLE_RANGE: [number, number] = [0, 180];

export function initSceneState(state: State, canvas: HTMLCanvasElement): void {
  const {scene} = state;

  scene.canvas = canvas;

  state.scene.cube.sides.forEach((side) => {
    initCubeSideState(state, side.side);
  });

  const ctx = canvas.getContext('webgl');
  assertNotEmpty(ctx, 'Failed to get webgl context');
  state.scene.ctx = ctx;
}

export function updateSceneCycle(state: State): void {
  autoRotateCycle(state);
  // moveSnakeCycle(state);
}

function autoRotateCycle(state: State) {
  const {scene} = state;
  const {currentRotationDeg, targetRotationDeg} = scene;

  if (currentRotationDeg.x !== targetRotationDeg.x) {
    currentRotationDeg.x = makeRotationStep(
      currentRotationDeg.x,
      targetRotationDeg.x
    );
  }

  if (currentRotationDeg.y !== targetRotationDeg.y) {
    currentRotationDeg.y = makeRotationStep(
      currentRotationDeg.y,
      targetRotationDeg.y
    );
  }
}

function makeRotationStep(
  currentRotation: number,
  targetRotation: number
): number {
  const diff = Math.min(
    Math.abs(currentRotation - targetRotation),
    Math.abs(currentRotation - targetRotation - 360),
    Math.abs(currentRotation - targetRotation + 360)
  );

  if (diff < AUTO_ROTATION_STEP_MIN) {
    return targetRotation;
  } else {
    const rotationStep = projectToRange(
      diff,
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
