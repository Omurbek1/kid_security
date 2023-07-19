import React, { useEffect, useRef, useState } from 'react';
import SimpleGradientProgressbarView from 'react-native-simple-gradient-progressbar-view';
import { NewColorScheme } from '../../../../shared/colorScheme';
import styles from './style';

const { PINK_COLOR_1, ORANGE_COLOR_1 } = NewColorScheme;

export default function ProgressBar({ max = 100, min = 0, time = 3000, onComplete = () => { } }) {
  let [state, setState] = useState({ complete: false, current: 0, max, min, time });
  let timer = useRef(null);

  const setProgress = () => {
    setState(prev => ({ ...prev, current: prev.current + 1 }));
  };

  useEffect(() => {
    if (state.current >= state.max) {
      setState(prev => ({ ...prev, complete: true }));
    };
  }, [state.current]);

  useEffect(() => {
    if (state.complete) onComplete();
  }, [state.complete]);

  useEffect(() => {
    if (!state.complete) {
      if (state.current < state.max) {
        timer.current = setTimeout(() => {
          setProgress()
        }, state.time / state.max);
      };
    };

    return () => clearTimeout(timer.current);
  });

  return <SimpleGradientProgressbarView
    style={styles.box}
    fromColor={PINK_COLOR_1}
    toColor={ORANGE_COLOR_1}
    progress={state.current / 100}
    maskedCorners={[1, 1, 1, 1]}
    cornerRadius={7} />
};
