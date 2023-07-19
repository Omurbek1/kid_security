import React, { FunctionComponent } from 'react';
import {
  SafeAreaView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const BottomTab: FunctionComponent = props => {
  const { children, indexTrigger } = props;
  const isIOS = Platform.OS === 'ios';
  const tabBarHeight = height / 10;

  return <SafeAreaView style={[
    styles.container,
    isIOS && indexTrigger && { zIndex: 2 },
    { bottom: tabBarHeight + 10 }]}>
    {children}
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // height: width / 5,
    position: 'absolute',
  },
});

export default BottomTab;
