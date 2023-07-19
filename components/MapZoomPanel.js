import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Header } from 'react-navigation';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import Constants from 'expo-constants';
import MapZoomButton from './MapZoomButton';
import UserPrefs from '../UserPrefs';
import { L } from '@lang';

import KsAlign from './atom/KsAlign';
import RoundedDialogBottom from './molecules/RoundedDialogBottom';
import { MapOptionItem } from './molecules/MapOptionItem';


const { height } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const HEADER_HEIGHT = Header.HEIGHT;
const defaultProps = {
  options: 'OpenStreetMap',
  onZoomIn: null,
  onZoomOut: null,
  onRefresh: null,
  marginBottom: 0,
  isMapPage: false,
  trialBadgeShown: false,
  promoBadgeShown: false,
};

@connectActionSheet
export default class MapZoomPanel extends Component {
  state = {
    pickMapDialogVisible: false,
  };

  options = [L('map'), L('satellite'), 'OpenStreetMap', L('twogis')];

  onMapLayer() {
    const props = { ...defaultProps, ...this.props };

    const options = [L('map'), L('satellite'), 'OpenStreetMap', L('twogis')];
    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex != cancelButtonIndex) {
          console.log('value:', buttonIndex);
          props.onMapLayer(buttonIndex);
          UserPrefs.setMapLayer(buttonIndex);
        }
      }
    );
  }

  render() {
    const activeMapIndex = UserPrefs.all.mapLayer;
    const props = { ...defaultProps, ...this.props };
    const { marginBottom, isMapPage, trialBadgeShown, promoBadgeShown, onMapLayer, onZoomIn, onZoomOut, onRefresh } =
      props;
    const top = isMapPage
      ? trialBadgeShown && promoBadgeShown
        ? 144 + HEADER_HEIGHT + STATUS_BAR_HEIGHT
        : trialBadgeShown || promoBadgeShown
        ? 79 + HEADER_HEIGHT + height / 26
        : 49 + STATUS_BAR_HEIGHT + height / 26
      : 49 + STATUS_BAR_HEIGHT + height / 26;

    return (
      <KsAlign elementsGap={10} style={[styles.container, { marginBottom, top }]} pointerEvents="box-none">
        <RoundedDialogBottom
          title={L('layer')}
          visible={this.state.pickMapDialogVisible}
          onTouchOutside={() => this.setState({ pickMapDialogVisible: false })}>
          <View>
            {this.options.map((option, index) => (
              <MapOptionItem
                active={index === activeMapIndex}
                title={option}
                number={index + 1}
                key={index}
                value={index}
                onPress={(mapIndex) => {
                  console.log('value:', mapIndex);

                  onMapLayer(mapIndex);
                  UserPrefs.setMapLayer(mapIndex);
                  this.setState({ pickMapDialogVisible: false });
                }}></MapOptionItem>
            ))}
          </View>
        </RoundedDialogBottom>
        <MapZoomButton
          src={require('../img/map_layers.png')}
          onPress={() => {
            this.setState({ pickMapDialogVisible: true });
          }}
        />
        <MapZoomButton src={require('../img/map_plus.png')} onPress={onZoomIn} />
        <MapZoomButton src={require('../img/map_minus.png')} onPress={onZoomOut} />
        {onRefresh ? (
          <MapZoomButton src={require('../img/map_refresh.png')} onPress={onRefresh} type="refresh" />
        ) : null}
      </KsAlign>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    position: 'absolute',
    right: 10,
    width: 50,
  },
});
