import React from 'react';
import {
  SafeAreaView,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Constants from 'expo-constants';
import { L } from '../../../../lang/Lang';
import SkipButton from '../SkipButton';
import { GradientButton } from '../../../';
import { NewColorScheme } from '../../../../shared/colorScheme';
import styles from './style';

const { PINK_COLOR_1 } = NewColorScheme;

function Slide({ width, height, node, ref = null, page }) {
  let render = true;
  let slide = node.item;
  slide?.require?.map((item) => {
    switch (typeof item) {
      case 'boolean':
        if (!item) {
          render = false;
        };
        break;
      default:
        if (item === '') {
          render = false;
        };
        break;
    };
  });

  if (!render) return null;

  const getBackgroundColor = (index) =>
    slide?.activeIndex === index ? PINK_COLOR_1 : 'rgba(243, 105, 137, 0.3)';

  const isPurchasePage = page === 'purchase';
  const skipViewStyle = {
    paddingRight: 22,
    marginTop: Platform.OS !== 'ios' ? Constants.statusBarHeight : 47,
  };

  const renderSlide = (
    <KeyboardAvoidingView style={styles.centeredView} behavior='position'>
      <View style={styles.header}>
        {slide?.skip &&
          <View style={[styles.skipView, isPurchasePage && skipViewStyle]}>
            <SkipButton
              label={L('skip')}
              onPress={slide?.skip} />
          </View>}
      </View>
      <View style={styles.centeredView}>
        {slide?.centerView}
      </View>
      {slide.bottomButton &&
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: getBackgroundColor(0) }]} />
          <View style={[styles.dot, { backgroundColor: getBackgroundColor(1), marginLeft: 14 }]} />
          <View style={[styles.dot, { backgroundColor: getBackgroundColor(2), marginLeft: 14 }]} />
          <View style={[styles.dot, { backgroundColor: getBackgroundColor(3), marginLeft: 14 }]} />
        </View>}
      {slide.bottomButton &&
        <GradientButton
          title={slide?.bottomButton?.title}
          onPress={slide?.bottomButton?.onPress}
          gradientStyle={{ width: width / 1.1 }} />}
    </KeyboardAvoidingView>
  );

  return (isPurchasePage
    ? <>
      {renderSlide}
    </>
    : <SafeAreaView style={[{ width, height, backgroundColor: '#FFFFFF', paddingVertical: 22 },
    Platform.OS !== 'ios' && { paddingVertical: Constants.statusBarHeight }]}>
      <View style={styles.slideView}>
        {renderSlide}
      </View>
    </SafeAreaView>
  );
};

export default Slide;
