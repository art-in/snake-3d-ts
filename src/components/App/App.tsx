import React, {useState} from 'react';
import State from '../../state/models/State';
import Scene from '../Scene';
import classes from './App.css';

export default function App(): JSX.Element {
  const [state] = useState(new State());

  return (
    <div className={classes.root}>
      <Scene state={state} />
    </div>
  );
}
