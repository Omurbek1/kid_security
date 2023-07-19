import { ActivityIndicator } from 'react-native';
import React, { Component } from 'react';

export default class MyActivityIndicator extends Component {
  render() {
    return <ActivityIndicator color="#FF666F" {...this.props} />;
  }
}
