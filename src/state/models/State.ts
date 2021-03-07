import Apple from './Apple';
import Scene from './Scene';
import Snake from './Snake';

export default class State {
  scene = new Scene();

  snake = new Snake();
  apples: Apple[] = [];
}
