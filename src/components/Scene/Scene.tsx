import {action} from 'mobx';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as gameActions from '../../state/actions/game-actions';
import * as sceneDrawer from '../../drawers/scene-drawer';
import ISize from '../../state/models/ISize';
import assertNotEmpty from '../../helpers/assert-not-empty';
import GameState from '../../state/models/GameState';
import resizeCanvas from '../../helpers/resize-canvas';
import {subscribeToControlEvents} from './control-events';

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
    assertNotEmpty(canvasRef.current, 'Failed to get canvas element');
    const canvas = canvasRef.current;

    const windowSize: ISize = {
      width: window.document.body.clientWidth,
      height: window.document.body.clientHeight,
    };
    resizeCanvas(canvas, windowSize, devicePixelRatio);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();
    init();
    subscribeToControlEvents(state, window);
  }, []);

  const renderCycle = useCallback(
    action(() => {
      gameActions.updateGameStateCycle(state);
      sceneDrawer.drawSceneCycle(state);

      requestAnimationFrame(renderCycle);
    }),
    []
  );

  useEffect(renderCycle, []);

  return <canvas ref={canvasRef} />;
}
