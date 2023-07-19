import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { StyleSheet, TouchableOpacity } from 'react-native';

const defaultProps = {
  icon: 'envelope',
  type: 'evilicon',
  color: 'white',
  onPress: null,
  disabled: false,
  badge: null,
  active: false,
};

export default class BottomTabButton extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return (
      <View style={styles.wrapper}>
        <TouchableOpacity onPressIn={ () => setTimeout(props.onPress, 0) }>
          <View style={[styles.container, { opacity: props.disabled ? 0.5 : 1.0 }]}>
            {props.title ? <Text style={[styles.title, { color: props.color }]}>{props.title}</Text> : null}
            <View
              style={{
                borderRadius: 100,
                backgroundColor: props.active ? '#fe6f5f' : '#ef4c77',
                width: '100%',
                width: 40,
                height: 40,
                maxHeight: 40,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Icon iconStyle={{ color: props.color }} name={props.icon} type={props.type} size={24} />
              {null == props.badge || 0 === props.badge ? null : (
                <View style={styles.badge}>
                  <Text style={styles.badge_text}>{props.badge}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'stretch',
    height: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'stretch',
  },
  title: {
    color: 'white',
    fontSize: 10,
  },
  badge_text: {
    fontSize: 10,
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    position: 'absolute',
    right: -5,
    top: 0,
    borderRadius: 25,
    backgroundColor: 'yellow',
    color: 'black',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    overflow: 'hidden',
  },
});
