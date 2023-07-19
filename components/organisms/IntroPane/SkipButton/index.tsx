import React from 'react';
import { Text } from 'react-native';
import styles from './style';

const SkipButton = ({ label = 'Action', onPress = () => { } }) => {
  return <Text
    style={styles.text}
    onPress={onPress}>
    {label}
  </Text>
};

export default SkipButton;
