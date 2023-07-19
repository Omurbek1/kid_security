import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { L } from '@lang';


const defaultProps = {
  batteryPercent: '0%',
  demo: false,
  muted: false,
};

export default class MapTopBar extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return (
      <View style={styles.container}>
        <View style={styles.cell_container}>
          <View style={styles.cell}>
            <Icon type="font-awesome" name="battery-half" color="white" size={16} />
            <Text style={styles.title}>{props.batteryPercent + '%'}</Text>
          </View>
          <View style={styles.cell}>
            <TouchableOpacity onPress={props.onSpeakerPress}>
              {props.muted ? (
                <Icon type="material-community" name="volume-mute" color="white" size={20} />
              ) : (
                <Icon type="material-community" name="volume-high" color="white" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {props.demo ? (
          <TouchableOpacity style={styles.demo_pane} onPress={props.onPress}>
            <Text style={styles.demo}>{L('demo_mode_tap_to_exit')}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',

    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },

  cell_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    backgroundColor: '#FF666F',
    height: 25,
    maxHeight: 25,
  },
  title: {
    color: 'white',
    marginLeft: 5,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'stretch',
  },
  demo_pane: {
    padding: 10,
    backgroundColor: 'red',
  },
  demo: {
    textAlign: 'center',
    color: 'white',
    width: '100%',
  },
});
