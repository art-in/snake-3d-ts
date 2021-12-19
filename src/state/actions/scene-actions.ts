import GameState from '../models/GameState';
import * as cubeActions from './cube-actions';

export function updateSceneCycle(state: GameState): void {
  cubeActions.autoRotateCycle(state);
}
