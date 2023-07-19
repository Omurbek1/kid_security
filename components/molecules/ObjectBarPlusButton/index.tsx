import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import KsAnimatedButton from '../KsAnimatedButton';

const imageSourceStub = require('../../../img/ic_stub_photo.png');

const defaultProps = {
  title: 'Unnamed',
  titleStyle: {},
  style: {},
  active: false,
  imageSource: imageSourceStub,
  loadingIndicatorSource: imageSourceStub,
  pulse: false,
};

export default class ObjectBarPlusButton extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    const { active } = props;

    return (
      <View style={styles.mainContainer}>
        {props.pulse ? (
          <Icon
            containerStyle={styles.icon}
            type="font-awesome"
            name="caret-down"
            color="white"
            size={50} />
        ) : null}
        <View>
          <View style={[styles.container, props.style]}>
            {props.pulse ?
              <View style={[styles.circle, active ? styles.activeCircle : {}]}>
                <KsAnimatedButton />
              </View>
              : <View style={[styles.circle, active ? styles.activeCircle : {}]}>
                <Image
                  style={styles.img}
                  loadingIndicatorSource={props.loadingIndicatorSource}
                  resizeMode="cover"
                  source={props.imageSource ? props.imageSource : imageSourceStub} />
              </View>}
            <View style={[styles.title, active ? styles.activeTitle : {}]}>
              <Text
                style={[props.titleStyle, styles.titleText, active ? styles.activeTitleText : {}]}
                numberOfLines={1}>
                {props.title}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 80,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 100,
    paddingLeft: 2,
    paddingRight: 2,
    paddingBottom: 2,
  },
  titleText: {
    fontSize: 10,
    color: '#555',
  },
  activeTitle: {
    backgroundColor: '#FF666F',
  },
  activeTitleText: {
    color: 'white',
  },
  activeCircle: {
    borderColor: '#FF666F',
  },
  mainContainer: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    top: -23,
    paddingRight: 5,
  },
  img: {
    width: 30,
    height: 30,
    opacity: 0.5,
  },
});
