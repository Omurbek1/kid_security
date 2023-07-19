import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '../../../lang/Lang';

const defaultProps = {
  timerLabel: '23:59:59',
  visible: true,
  onPress: null,
  price: 'KZT 10',
};

class TryPremiumLabel2 extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const { timerLabel, visible, onPress, price } = props;

    return visible ? (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image style={styles.image} source={require('../../../img/ic_gift_box_sm.png')} />
        <View style={styles.labels}>
          <Text style={styles.timer}>{L('try_premium2_header')}</Text>
          <Text style={styles.text}>
            {L('try_premium2_subheader')} - {timerLabel}
          </Text>
        </View>
      </TouchableOpacity>
    ) : null;
  }
}

export default TryPremiumLabel2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'yellow',
    overflow: 'hidden',
    borderRadius: 10,
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  labels: {
    flexDirection: 'column',
  },
  image: {
    width: 28,
    height: 28,
    marginRight: 5,
  },
  timer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  text: {
    fontSize: 12,
    color: '#000',
  },
});
