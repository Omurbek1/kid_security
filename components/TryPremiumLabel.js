import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { PINK_COLOR_1, ORANGE_COLOR_1 } = NewColorScheme;
const defaultProps = {
  timerLabel: '23:59:59',
  visible: true,
  onPress: null,
};

class TryPremiumLabel extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const { timerLabel, visible, onPress } = props;
    const { gradient, container, image, text, shadowedView } = styles;

    return visible
      ? <View style={shadowedView}>
        <LinearGradient
          colors={[PINK_COLOR_1, ORANGE_COLOR_1]}
          start={[0, 0]}
          end={[1, 0]}
          locations={[0, 1.0]}
          style={gradient}>
          <TouchableOpacity
            onPress={onPress}
            style={container}>
            <Image
              source={require('../img/free_trial.png')}
              style={image} />
            <View style={{ marginLeft: 10 }}>
              <Text style={text}>{L('try_free_on')}</Text>
              <Text style={text}>{timerLabel}</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      : null;
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  image: {
    width: 22,
    height: 22,
  },
  text: {
    fontSize: width / 29.5,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: 'white',
  },
  gradient: {
    borderRadius: 25,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowedView: {
    borderRadius: 25,
    height: 45,
    backgroundColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginLeft: 25,
  },
});

export default TryPremiumLabel;
