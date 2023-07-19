import Constants from 'expo-constants';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from 'react-navigation';
import { L } from '../../../lang/Lang';
import UserPrefs from '../../../UserPrefs';
const HEADER_HEIGHT = Header.HEIGHT;

const defaultProps = {
  visible: false,
};
export default class PromoBadge extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const lang = UserPrefs.all.language;
    const { title } = props.promoData;
    const saleTitle = title[lang] || title['en'];
    return props.visible ? (
      <TouchableOpacity style={styles.promoBadge} onPress={props.onPress}>
        <View style={styles.promoContent}>
          <Text style={styles.promoText}>{saleTitle}</Text>
          <View style={styles.promoButton}>
            <Text style={styles.promoButtonText}>{L('purchase')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  }
}

const styles = StyleSheet.create({
  promoBadge: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    minHeight: HEADER_HEIGHT,
    backgroundColor: '#ef4c77',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: Constants.statusBarHeight,
  },
  promoContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  promoText: {
    color: '#fff',
    maxWidth: '65%',
    fontSize: 14,
  },
  promoButtonText: {
    color: '#000',
  },
  promoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffd600',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
