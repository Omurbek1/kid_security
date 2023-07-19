import React, { Component } from 'react';
import { View, Text, Image, Share } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';


const defaultProps = {
  percent: 40,
  showPercent: false,
  title: '',
  height: 10,
  maxWidth: 200,
  color: '#52ac62',
};

export default class PraiseParentPane extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const title = props.title + (props.showPercent ? props.percent + '%' : '');
    return (
      <View style={[styles.progress, { height: props.height, maxWidth: props.maxWidth, borderColor: props.color }]}>
        <View style={[styles.progress_fill, { width: props.percent + '%', backgroundColor: props.color }]}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progress: {
    backgroundColor: 'white',
    borderColor: '#52ac62',
    borderRadius: 15,
    borderWidth: 2,
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progress_fill: {
    backgroundColor: '#52ac62',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 8,
  },
});
