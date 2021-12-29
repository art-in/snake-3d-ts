import React, {useCallback, useEffect, useRef, useState} from 'react';
import {action} from 'mobx';
import assertNotEmpty from '../../helpers/assert-not-empty';
import resizeCanvas from '../../helpers/resize-canvas';
import ISize from '../../models/ISize';
import GameState from '../../models/GameState';
import * as gameActions from '../../actions/game-actions';
import * as controlActions from '../../actions/control-actions';
import * as sceneDrawer from '../../drawers/scene-drawer';

interface ISceneProps {
  state: GameState;
}

export default function Scene({state}: ISceneProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const init = useCallback(() => {
    if (isInitialized) {
      // refresh entire page instead of hot reload, to correctly redraw
      // cube sides
      location.reload();
    }

    assertNotEmpty(canvasRef.current, 'Failed to get canvas element');
    const canvas = canvasRef.current;

    gameActions.initGameState(state);
    sceneDrawer.initSceneDrawer(state, canvas);

    setIsInitialized(true);
  }, []);

  const onResize = useCallback(() => {
    const canvas = canvasRef.current;
    assertNotEmpty(canvas, 'Failed to get canvas element');

    const windowSize: ISize = {
      width: window.document.body.clientWidth,
      height: window.document.body.clientHeight,
    };
    resizeCanvas(canvas, windowSize, devicePixelRatio);
  }, []);

  const subscribe = useCallback(() => {
    window.addEventListener('resize', onResize);
    window.addEventListener(
      'keydown',
      action((event) => controlActions.onKeyDown(state, event.code))
    );
    window.addEventListener(
      'mousedown',
      action(() => controlActions.onMouseDown(state))
    );
    window.addEventListener(
      'mouseup',
      action(() => controlActions.onMouseUp(state))
    );
    window.addEventListener(
      'mousemove',
      action((event) =>
        controlActions.onMouseMove(state, {
          x: event.clientX,
          y: event.clientY,
        })
      )
    );
  }, []);

  const loop = useCallback(
    action(() => {
      gameActions.updateGameStateLoop(state);
      sceneDrawer.drawSceneLoop(state);

      requestAnimationFrame(loop);
    }),
    []
  );

  useEffect(() => {
    init();
    onResize();
    subscribe();
  }, []);

  useEffect(loop, []);

  return <canvas ref={canvasRef} />;
}
