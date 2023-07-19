import React, { Component } from 'react';
import { View, Text, Image, Share } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';

import { getKidAppUrl } from '../Utils';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import MyActivityIndicator from './MyActivityIndicator';
import { Icon } from 'react-native-elements';
import * as Metrica from '../analytics/Analytics';
import Clipboard from '@react-native-clipboard/clipboard';
const defaultProps = {
  title: 'Title',
  image: require('../img/ic_wiretap.png'),
  onPress: null,
  disabled: false,
  visible: true,
};

class _AddPhonePane extends Component {
  freshEvent = true;

  onShareLink = () => {
    const { addPhoneCode } = this.props;
    Metrica.event('funnel_share_code', { code: addPhoneCode });

    Share.share(
      {
        message: L('please_install_app_to_kid_phone', [getKidAppUrl(), addPhoneCode]),
      },
      {}
    );
  };
  onCopy = () => {
    const { addPhoneCode, visible } = this.props;
    Clipboard.setString(addPhoneCode);
  };
  render() {
    const props = { ...defaultProps, ...this.props };
    const { addPhoneCode } = this.props;

    if (addPhoneCode && this.freshEvent && props.visible) {
      this.freshEvent = false;
      Metrica.event('funnel_add_child_code', { code: addPhoneCode });
    }

    return props.visible ? (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.page_header}>
            <LinearGradient
              style={styles.gradient}
              colors={['#ef4c77', '#fe6f5f', '#ff8048']}
              start={[0, 1]}
              end={[1, 0]}
              locations={[0, 0.5, 1.0]}></LinearGradient>
            <View style={styles.image_outer}>
              <Image source={require('../img/ic_kids.png')} style={styles.hdr_image} />
            </View>
            <Text style={styles.hdr_big}>{L('add_child_1')}</Text>
            <Text style={styles.hdr_small}>{L('add_child_2')}</Text>
          </View>

          <View style={styles.code_outer}>
            <View style={styles.code_arrow}>
              <Icon name="md-arrow-down" type="ionicon" color="black" size={28} />
              
            </View>
            <View style={styles.code_content}>
              <Text style={styles.add_text}>{L('and_type_code')}</Text>
              <TouchableOpacity onPress={this.onCopy}>
                {addPhoneCode ? <Text style={[styles.bigText]}>{addPhoneCode}</Text> : null}
                {addPhoneCode ? null : <MyActivityIndicator size="large" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.button_outer}>
            <TouchableOpacity color="white" style={styles.button} onPress={this.onShareLink.bind(this)}>
              <View style={styles.button_inner}>
                <Text style={styles.button_text}>{L('menu_add_child')}</Text>
                <Icon name="md-share" type="ionicon" color="white" size={22} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { addPhoneCode } = state.controlReducer;

  return {
    addPhoneCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const AddPhonePane = connect(mapStateToProps, mapDispatchToProps)(_AddPhonePane);
export default AddPhonePane;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  demo_container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  text: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  share_hint: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 5,
    textAlign: 'center',
  },
  bigText: {
    paddingTop: 0,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    backgroundColor: 'white',
    color: '#ff4663',
    width: '100%',
  },
  logo: {
    marginTop: 20,
    maxWidth: 120,
    maxHeight: 120,
  },
  share_button: {
    marginTop: 5,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  try_button: {
    marginBottom: 0,
    backgroundColor: '#eb6f6f',
    borderRadius: 6,
  },

  whatsappLogo: {
    width: 50,
    height: 50,
    marginLeft: 250,
    marginTop: -42,
  },

  whatsAppTouch: {
    width: 320,
    height: 60,
    backgroundColor: '#FF666F',
    borderRadius: 6,
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
  },
  textDiv: {
    width: 200,
    marginLeft: -60,
    marginTop: 10,
    textAlign: 'center',
  },
  page_header: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: 50,
    paddingBottom: 15,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  hdr_big: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  hdr_small: {
    marginTop: 10,
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
  },
  hdr_image: {
    maxWidth: 200,
    resizeMode: 'contain',
    marginLeft: -25,
  },
  image_outer: {
    margin: 20,
    borderRadius: 75,
    width: 150,
    height: 150,
    backgroundColor: '#ffffff2f',
  },
  button: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 45,
    backgroundColor: '#e04881',
    borderRadius: 23,
  },
  button_text: {
    color: 'white',
    paddingRight: 10,
  },
  button_outer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#f9f6f6',
  },
  code_outer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  button_inner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  code_arrow: {
    paddingRight: 20,
  },
  code_content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderLeftWidth: 1,
    borderLeftColor: '#e6e6e6',
    paddingLeft: 20,
  },
  add_text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
