import Apple from './Apple';
import EGameStatus from './EGameStatus';
import Scene from './Scene';
import Snake from './Snake';
import Stone from './Stone';

export default class State {
  scene = new Scene();

  snake = new Snake();
  apples: Apple[] = [];
  stones: Stone[] = [];

  status: EGameStatus = EGameStatus.Welcome;
}
