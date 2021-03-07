import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as sceneActions from '../../state/actions/scene-actions';
import * as sceneDrawer from '../../drawers/scene-drawer';
import ISize from '../../state/models/ISize';
import assertNotEmpty from '../../helpers/assertNotEmpty';
import State from '../../state/models/State';
import {subscribeToControlEvents} from './events-manager';
import resizeCanvas from '../../helpers/resizeCanvas';
import {action} from 'mobx';

interface ISceneProps {
  state: State;
}

export default function Scene({state}: ISceneProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const init = useCallback(() => {
    if (isInitialized) {
      // refresh entire page instead of hot reload
      location.reload();
    }

    assertNotEmpty(canvasRef.current, 'Failed to get canvas element');
    const canvas = canvasRef.current;

    sceneActions.initSceneState(state, canvas);
    sceneDrawer.initSceneDrawer(state);

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
      sceneActions.updateSceneCycle(state);
      sceneDrawer.drawSceneCycle(state);

      requestAnimationFrame(renderCycle);
    }),
    []
  );

  useEffect(renderCycle, []);

  return <canvas ref={canvasRef} />;
}
