import React, { FunctionComponent } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { ORANGE_COLOR_1 } = NewColorScheme;

interface AddChildComponentProps {
  onPress: () => void;
  isMapPage?: boolean;
  isHandTapAnimationVisible?: boolean;
}

const AddChildComponent: FunctionComponent<AddChildComponentProps> = (props) => {
  const { onPress, isMapPage, isHandTapAnimationVisible } = props;
  const { icon, btnWithText, text } = styles;

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={onPress}>
        {!isMapPage && !isHandTapAnimationVisible && (
          <Image source={require('../img/hand_tap.gif')} style={styles.handTapGif} />
        )}
        <Image source={require('../img/add_child_orange.png')} style={icon} />
        
      </TouchableOpacity>
      {!isMapPage && (
        <TouchableOpacity onPress={onPress} style={btnWithText}>
          <Text style={text}>{L('add')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 51,
    height: 51,
  },
  btnWithText: {
    paddingVertical: 6,
    paddingHorizontal: 21,
    borderRadius: 10,
    marginTop: 7,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: width / 34.5,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
    color: ORANGE_COLOR_1,
  },
  handTapGif: {
    position: 'absolute',
    zIndex: 1,
    width: 60,
    height: 60,
    left: 8,
    top: 5,
  },
});

export default AddChildComponent;
