import React, {useCallback, useEffect, useState} from 'react';
import State from '../../state/models/State';
import classes from './DebugPanel.css';

interface DebugPanelProps {
  state: State;
}

export default function DebugPanel(props: DebugPanelProps): JSX.Element {
  const {scene} = props.state;

  const [currentRotationDegX, setCurrentRotationDegX] = useState(0);
  const [currentRotationDegY, setCurrentRotationDegY] = useState(0);

  const [targetRotationDegX, setTargetRotationDegX] = useState(0);
  const [targetRotationDegY, setTargetRotationDegY] = useState(0);

  const update = useCallback(() => {
    setCurrentRotationDegX(scene.currentRotationDeg.x);
    setCurrentRotationDegY(scene.currentRotationDeg.y);

    setTargetRotationDegX(scene.targetRotationDeg.x);
    setTargetRotationDegY(scene.targetRotationDeg.y);

    requestAnimationFrame(update);
  }, []);

  useEffect(update, []);

  return (
    <div className={classes.root}>
      <div>
        model current rotation (deg):
        <span className={classes.number}>
          x= {currentRotationDegX.toFixed(0)}
        </span>
        <span className={classes.number}>
          y= {currentRotationDegY.toFixed(0)}
        </span>
      </div>

      <div>
        model target rotation (deg):
        <span className={classes.number}>
          x= {targetRotationDegX.toFixed(0)}
        </span>
        <span className={classes.number}>
          y= {targetRotationDegY.toFixed(0)}
        </span>
      </div>
    </div>
  );
}
