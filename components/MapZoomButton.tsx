import React, { Component } from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';

interface MapZoomButtonProps {
  src: ImageSourcePropType;
  onPress: () => void;
  type?: string
};

interface MapZoomButtonState {
  pressed: boolean;
};

class MapZoomButton extends Component<MapZoomButtonProps, MapZoomButtonState> {
  constructor(props) {
    super(props);
  };

  state = {
    pressed: false,
  };

  render() {
    const { src, onPress, type } = this.props;
    const { pressed } = this.state;
    const { icon, refreshIcon, btn, pressedBtn } = styles;

    return (
      <TouchableHighlight
        activeOpacity={1}
        onHideUnderlay={() => this.setState({ pressed: false })}
        onShowUnderlay={() => this.setState({ pressed: true })}
        underlayColor='white'
        onPress={onPress}
        style={[btn, pressed && pressedBtn]}>
        <Image
          source={src}
          style={type === 'refresh' ? refreshIcon : icon} />
      </TouchableHighlight>
    );
  };
};

const styles = StyleSheet.create({
  icon: {
    width: 27,
    height: 27,
  },
  refreshIcon: {
    width: 22,
    height: 22,
  },
  btn: {
    backgroundColor: '#FFFFFF',
    height: 44,
    width: 44,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pressedBtn: {
    borderWidth: 3,
    borderColor: '#fe6f5f',
  },
});

export default MapZoomButton;
