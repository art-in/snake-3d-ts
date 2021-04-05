import React, {useEffect, useRef} from 'react';
import cn from 'classnames';
import assertNotEmpty from '../../helpers/assert-not-empty';
import {ECubeSide} from '../../state/models/ECubeSide';
import State from '../../state/models/State';
import classes from './DebugCubeSide.css';

interface ICubeSideProps {
  state: State;
  side: ECubeSide;
}

export default function DebugCubeSide(props: ICubeSideProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const cubeSide = props.state.scene.cube[props.side];

  useEffect(() => {
    assertNotEmpty(containerRef.current);
    const container = containerRef.current;

    if (cubeSide.canvas) {
      container.innerText = '';
      container.appendChild(cubeSide.canvas);
    }
  }, [cubeSide.canvas]);

  const classNames = cn(classes.root, {
    [classes.front]: props.side === ECubeSide.Front,
    [classes.back]: props.side === ECubeSide.Back,
  });

  return <div className={classNames} ref={containerRef} />;
}
