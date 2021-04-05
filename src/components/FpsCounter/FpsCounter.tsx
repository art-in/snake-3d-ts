import React, {memo} from 'react';
import useFpsCounter from './hooks/useFpsCounter';
import classes from './FpsCounter.css';

function FpsCounter() {
  const fps = useFpsCounter();

  return (
    <div className={classes.root}>
      <span>{fps}</span>
    </div>
  );
}

export default memo(FpsCounter);
