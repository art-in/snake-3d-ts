import React from 'react';
import {observer} from 'mobx-react-lite';
import GameState from '../../models/GameState';
import classes from './DebugPanel.css';

interface DebugPanelProps {
  state: GameState;
}

function DebugPanel(props: DebugPanelProps): JSX.Element {
  const {cube} = props.state.scene;

  return (
    <div className={classes.root}>
      <div>
        model current rotation (deg):
        <span className={classes.number}>
          x= {cube.currentRotation.x.toFixed(0)}
        </span>
        <span className={classes.number}>
          y= {cube.currentRotation.y.toFixed(0)}
        </span>
      </div>

      <div>
        model target rotation (deg):
        <span className={classes.number}>
          x= {cube.targetRotation.x.toFixed(0)}
        </span>
        <span className={classes.number}>
          y= {cube.targetRotation.y.toFixed(0)}
        </span>
      </div>
    </div>
  );
}

export default observer(DebugPanel);
