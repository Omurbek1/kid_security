import React, { useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { L } from '../../../../lang/Lang';
import Slide from '../Slide';
import ProgressBar from '../ProgressBar';
import { slideTypes } from '../types';
import styles from './style';
import { firebaseAnalitycsLogEvent } from '../../../../analytics/firebase/firebase';

const { width, height } = Dimensions.get('window');

const LoadingPage = ({ setContext }) => {
  useEffect(() => {
    firebaseAnalitycsLogEvent(
      'open_slide',
      {
        screen_name: 'onboardingGamification',
        slide_name: 'onboardingProgressBar',
      },
      true
    );
  }, []);
  const SlideData = {
    id: 1,
    skip: false,
    centerView: (
      <View style={styles.container}>
        <Text style={styles.title}>{L('best_app_forparent')}</Text>
        <Text style={styles.subtitle}>{L('wait')}</Text>
        <ProgressBar onComplete={() => setContext((prev) => ({ ...prev, type: slideTypes.COMPLETE }))} />
      </View>
    ),
  };

  return <Slide node={{ item: SlideData }} width={width} height={height} page="loading" />;
};

export default LoadingPage;

