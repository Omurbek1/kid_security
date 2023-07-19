import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { needPremiumDialog } from '../Utils';

const defaultProps = {
  title: 'Title',
  image: require('../img/ic_wiretap.png'),
  onPress: null,
  disabled: false,
  locked: false,
  visible: true,
  shadow: true,
};

const renderBadge = (points) => {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 3,
        borderRadius: 50,
        top: 5,
        right: 20,
        padding: 2,
        width: 20,
        backgroundColor: 'yellow',
      }}>
      <Text style={{ textAlign: 'center', fontSize: 12 }}>{points}</Text>
    </View>
  );
};

export default class CommandButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    };
  }
  onLockedClick() {
    needPremiumDialog();
  }

  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View
        style={[
          styles.wrapper,
          this.props.shadow ? styles.shadow : {},
          this.state.pressed ? { borderColor: '#fe6f5f' } : {},
        ]}>
        {props.badge && props.badge > 0 ? renderBadge(props.badge) : null}
        <TouchableHighlight
          onHideUnderlay={() => {
            this.setState({ pressed: false });
          }}
          onShowUnderlay={() => {
            this.setState({ pressed: true });
          }}
          activeOpacity={1}
          underlayColor="transparent"
          onPress={props.locked ? this.onLockedClick.bind(this) : props.onPress}>
          <View style={[styles.commandCell, { opacity: props.disabled ? 0.5 : 1.0 }]}>
            <Image style={styles.icon} source={props.image} />
            <Text style={styles.commandTitle}>{props.title}</Text>
          </View>
        </TouchableHighlight>
      </View>
    ) : null;
  }
}

// borderColor: '#fe6f5f',
// borderWidth: 2,

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.0,

    elevation: 5,
  },
  wrapper: {
    flex: 1,
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 2,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    maxWidth: 100,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    flex: 1,
  },
  commandCell: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
  },
  commandTitle: {
    flex: 1,
    color: 'gray',
    fontSize: 10,
    marginTop: 5,
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#000',
  },
});
