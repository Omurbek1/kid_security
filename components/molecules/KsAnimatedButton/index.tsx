import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface KsAnimatedButtonProps {
  autoPlay?: boolean;
}

const KsAnimatedButton: React.FC<KsAnimatedButtonProps> = (props) => {
  return (
    <Image
      style={styles.img}
      source={require('../../../img/ic_blue_plus.gif')}
    />
  );
};

export default KsAnimatedButton;

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
  }
});
