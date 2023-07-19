import React, { FC } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';

import { NewColorScheme } from 'shared/colorScheme';
import { L } from '@lang';
import { GradientButton } from '@components';

import useOnboardingSlider from './useOnboardingSlider';
import useSwipe from 'utils/view/useSwipe';

const { width } = Dimensions.get('window');

const { GREY_COLOR_2, BLACK_COLOR, PINK_COLOR_1 } = NewColorScheme;

const OnboardingSlider: FC = ({ setContext, context }) => {
  const {
    activeIndex,
    steps,
    isAnimationVisible,
    animations,
    currentAnimationIndex,
    onAnimationFinish,
    onNextPopup,
    onSkipPress,
    onImageTap,
    onTextTap,
    onVideoTap,
    firebaseOnSwipeEvent,
  } = useOnboardingSlider(setContext, context);

  const { onTouchEnd, onTouchStart } = useSwipe({
    onSwipeLeft: firebaseOnSwipeEvent,
    onSwipeRight: firebaseOnSwipeEvent,
    onSwipeDown: firebaseOnSwipeEvent,
    onSwipeUp: firebaseOnSwipeEvent,
  });

  const { stepImg, stepTitle, buttonText } = steps[activeIndex];

  return (
    <ImageBackground style={styles.backImage} source={require('@img/animation_back.png')} resizeMode="cover">
      {isAnimationVisible ? (
        <View style={styles.animBackground}>
          <TouchableWithoutFeedback onPress={onVideoTap}>
            <AnimatedLottieView
              source={animations[currentAnimationIndex]}
              autoPlay
              loop={false}
              onAnimationFinish={onAnimationFinish}
            />
          </TouchableWithoutFeedback>
        </View>
      ) : (
        <View style={styles.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <View style={styles.innerContainer}>
            <View style={styles.scipWrap}>
              <Text onPress={onSkipPress} style={styles.skipBtn}>
                {L('skip')}
              </Text>
            </View>
            <View style={styles.contentWrap}>
              <TouchableWithoutFeedback onPress={onImageTap}>
                <Image source={stepImg} style={styles.img} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={onTextTap}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{stepTitle()}</Text>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.content}>
                <View style={styles.buttonContainer}>
                  <GradientButton title={buttonText()} onPress={onNextPopup} />
                </View>
                <View style={styles.dotContainer}>
                  <View style={styles.dotWrap}>
                    {steps.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          {
                            backgroundColor: index === activeIndex ? PINK_COLOR_1 : 'rgba(243, 105, 137, 0.3)',
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  innerContainer: {
    height: '80%',
    maxHeight: 616,
    width: '100%',
    paddingHorizontal: 36,
    paddingBottom: 34,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  img: {
    width: 267,
    height: 267,
    marginBottom: 24,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: width / 23,
    fontWeight: '400',
    color: BLACK_COLOR,
    textAlign: 'center',
    lineHeight: 24,
  },
  scipWrap: {
    display: 'flex',
    marginHorizontal: -12,
  },
  skipBtn: {
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: 12,
    color: '#7D7D7D',
    alignSelf: 'flex-end',
  },
  buttonContainer: { marginBottom: 24, width: '100%' },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotWrap: {
    flexDirection: 'row',
    width: 80,
    justifyContent: 'space-between',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  animBackground: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  contentWrap: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingSlider;
