import EGameStatus from './EGameStatus';
import ICubePosition from './ICubePosition';
import Scene from './Scene';
import Snake from './Snake';

export default class GameState {
  scene = new Scene();

  snake = new Snake();
  apples: ICubePosition[] = [];
  stones: ICubePosition[] = [];

  status = EGameStatus.Welcome;
}
