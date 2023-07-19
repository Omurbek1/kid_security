import React, { FunctionComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ViewStyle,
  ImageProps,
  ImageStyle,
  ImageBackground,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from './';

const { width, height } = Dimensions.get('window');
const { BLACK_COLOR, ORANGE_COLOR_1, PINK_COLOR_1 } = NewColorScheme;

interface SwiperSlideProps {
  gradientStyle?: ViewStyle;
  isFeature1Available: boolean;
  isFeature2Available: boolean;
  isPremiumSlide?: boolean;
  mainIcon?: ImageProps;
  mainIconStyle?: ImageStyle;
  title1Text: string;
  title2Text: string;
  dailyPriceText: string;
  monthlyPriceText: string;
  onAllFeaturesPress: () => void;
  onSwiperPress: () => void;
  backgroundColor: string;
  isRussia: boolean;
}

const SwiperSlide: FunctionComponent<SwiperSlideProps> = (props) => {
  const {
    gradientStyle,
    isFeature1Available,
    isFeature2Available,
    isPremiumSlide = false,
    mainIcon,
    mainIconStyle,
    title1Text,
    title2Text,
    dailyPriceText,
    monthlyPriceText,
    onAllFeaturesPress,
    onSwiperPress,
    backgroundColor,
    isRussia,
  } = props;
  const {
    featureTitle1,
    featureTitle2,
    check,
    cross,
    slideContainer,
    gradient,
    title1,
    title2,
    footer,
    alignRow,
    alignCenter,
    priceWrapper,
    dailyPrice,
    monthlyPrice,
    premiumIcon1,
    premiumIcon2,
    popularIcon,
    popularText,
    connectBtn,
    priceContainer,
    featuresWrapper,
  } = styles;
  const feature1ImgSrc = isFeature1Available ? require('../img/check_green.png') : require('../img/close_red.png');
  const feature2ImgSrc = isFeature2Available ? require('../img/check_green.png') : require('../img/close_red.png');
  const titleColor = !isPremiumSlide && { color: PINK_COLOR_1 };
  const monthlyColor = !isPremiumSlide && { color: BLACK_COLOR };

  return (
    <View style={slideContainer}>
      <Shadow distance={2} containerViewStyle={{ marginTop: 15 }}>
        <TouchableOpacity style={[gradient, gradientStyle, { backgroundColor }]} onPress={onSwiperPress}>
          {isPremiumSlide && (
            <ImageBackground source={require('../img/popular_choice.png')} style={popularIcon}>
              <Text style={popularText}>{L('most_popular').toUpperCase()}!</Text>
            </ImageBackground>
          )}
          <View style={[alignCenter, { flex: 1 }]}>
            {isPremiumSlide ? (
              <View style={alignRow}>
                <Image source={require('../img/premium_white.png')} style={premiumIcon1} />
                <Image source={require('../img/sound_white.png')} style={premiumIcon2} />
              </View>
            ) : (
              <Image source={mainIcon} style={mainIconStyle} />
            )}
            <Text style={[title1, titleColor]}>{title1Text}</Text>
            <Text style={[title2, titleColor]}>{title2Text}</Text>
          </View>
          <View style={[alignCenter, priceContainer]}>
            <View style={priceWrapper}>
              <Text style={dailyPrice}>{isRussia ? dailyPriceText : monthlyPriceText}</Text>
            </View>
            {isRussia && <Text style={[monthlyPrice, monthlyColor]}>{monthlyPriceText}</Text>}
          </View>
        </TouchableOpacity>
      </Shadow>
      <View style={footer}>
        <View style={featuresWrapper}>
          <View style={alignRow}>
            <Image source={feature1ImgSrc} style={isFeature1Available ? check : cross} />
            <Text onPress={onAllFeaturesPress} style={featureTitle1}>
              {L('premuim_full')}
            </Text>
          </View>
          <View style={alignRow}>
            <Image source={feature2ImgSrc} style={isFeature2Available ? check : cross} />
            <Text style={featureTitle2}>{L('full_listen')}</Text>
          </View>
        </View>
        <GradientButton title={L('connect_promo')} onPress={onSwiperPress} gradientStyle={connectBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featureTitle1: {
    fontSize: width / 29.5,
    fontWeight: '500',
    color: ORANGE_COLOR_1,
    textDecorationLine: 'underline',
  },
  featureTitle2: {
    fontSize: width / 29.5,
    fontWeight: '400',
    color: BLACK_COLOR,
  },
  check: {
    width: 14,
    height: 10,
    marginTop: 5,
    marginRight: 12,
  },
  cross: {
    width: 10,
    height: 10,
    marginTop: 5,
    marginRight: 12,
  },
  slideContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: width / 1.7,
    height: height / 3.2,
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    borderRadius: 12,
    paddingVertical: 20,
  },
  title1: {
    fontSize: width / 19,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 11,
  },
  title2: {
    fontSize: width / 23,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    flex: 0.75,
    width: width / 1.8,
    justifyContent: 'space-between',
    marginTop: 14,
  },
  alignRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  priceWrapper: {
    width: '100%',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: width / 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyPrice: {
    textAlign: 'center',
    fontSize: width / 17.5,
    fontWeight: '700',
    color: PINK_COLOR_1,
  },
  monthlyPrice: {
    fontSize: width / 26,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  premiumIcon1: {
    width: width / 13,
    height: height / 30,
  },
  premiumIcon2: {
    width: width / 11.5,
    height: height / 29,
    marginLeft: 15,
  },
  popularIcon: {
    width: 194,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    zIndex: 1,
    position: 'absolute',
    top: -30,
    left: -40,
  },
  popularText: {
    fontSize: width / 34.5,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  connectBtn: {
    width: '80%',
    alignSelf: 'center',
  },
  priceContainer: {
    flex: 0.4,
    width: '100%',
    justifyContent: 'space-between',
  },
  featuresWrapper: {
    flex: 0.7,
    justifyContent: 'space-between',
  },
});

export default SwiperSlide;
