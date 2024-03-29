import React, {useState} from 'react';
import ECubeSide from '../../models/ECubeSide';
import GameState from '../../models/GameState';
import DebugCubeSide from '../DebugCubeSide';
import DebugPanel from '../DebugPanel/DebugPanel';
import Scene from '../Scene';
import FpsCounter from '../FpsCounter';
import classes from './App.css';

const SHOW_DEBUG_CUBE_SIDES = false;
const SHOW_DEBUG_PANEL = false;

export default function App(): JSX.Element {
  const [state] = useState(new GameState());

  return (
    <div className={classes.root}>
      <Scene state={state} />
      <FpsCounter />
      {SHOW_DEBUG_PANEL && <DebugPanel state={state} />}
      {SHOW_DEBUG_CUBE_SIDES && (
        <>
          <DebugCubeSide state={state} side={ECubeSide.Front} />
          <DebugCubeSide state={state} side={ECubeSide.Back} />
        </>
      )}
    </div>
  );
}
