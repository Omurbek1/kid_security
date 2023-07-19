import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ViewStyle, KeyboardAvoidingView } from 'react-native';

interface RoundedPaneProps {
  style?: ViewStyle[] | ViewStyle;
}

export const RoundedPane: React.FC<RoundedPaneProps> = ({ style, children }) => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView style={[styles.container, style]} behavior="height">
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 100,
    backgroundColor: 'white',
  },
});
