import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

interface KsAnimatedButtonProps {
  autoPlay?: boolean;
}

const KsAnimatedButton: React.FC<KsAnimatedButtonProps> = (props) => {
  return (
    <LottieView
      source={require('./pulse_animation.json')}
      autoPlay
      style={{ height: 40 }}
      // OR find more Lottie files @ https://lottiefiles.com/featured
      // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
    />
  );
};

export default KsAnimatedButton;

const styles = StyleSheet.create({});
