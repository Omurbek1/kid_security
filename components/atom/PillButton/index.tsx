import React from 'react';
import KsAlign from '../KsAlign/index';
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const PillButton = ({ text, icon, onPress, styleProp }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
      <KsAlign axis="horizontal" elementsGap={10} style={[styles.pill, styleProp]}>
        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={icon} style={{ maxHeight: 20, maxWidth: 20, resizeMode: 'contain' }}></Image>
        </View>

        <Text style={{ color: '#000' }}>{text}</Text>
      </KsAlign>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    backgroundColor: 'white',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingRight: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default PillButton;
