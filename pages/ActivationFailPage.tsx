import React from 'react';
import { Text, StyleSheet, View, ScrollView, Image, ImageBackground, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { L } from '../lang/Lang';
import CustomHeader from '../components/molecules/CustomHeader';
import { getHeader } from '../shared/getHeader';
import KsButton from '../components/atom/KsButton';
import Const from '../Const';

class ActivationFailPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_activation'), noBackground: true }),
    };
  };

  callSupport(secret, userId, errorCode) {
    const template = `Данные приложения (secret=${secret}, userId=${userId}, errorCode=${errorCode})`;
    const url = Const.getActivationSupportUrl() + encodeURIComponent(template);
    Linking.canOpenURL(url)
      .then((supported) => {
        return Linking.openURL(url);
      })
      .catch((err) => console.warn('An error occurred', err));
  }

  render() {
    const { navigation, userId } = this.props;
    const secret = navigation.getParam('secret');
    const errorCode = navigation.getParam('errorCode');
    let reason = '';
    switch (errorCode) {
      case 8005:
        reason = L('code_not_found');
        break;
      case 8007:
        reason = L('code_expired');
        break;
      case 6200:
        reason = L('code_already_redeemed');
        break;
    }

    return (
      <View style={styles.container}>
        <CustomHeader
          style={{ paddingBottom: 40, borderBottomLeftRadius: 100, borderBottomRightRadius: 40 }}
          backgroundColor="white">
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground
              resizeMode={'contain'}
              style={{ width: 150, height: 150, justifyContent: 'flex-end', alignItems: 'center' }}
              source={require('../img/ic_settings_gear.png')}>
              <View style={{ position: 'relative', top: 40, alignItems: 'center' }}>
                <Image
                  source={require('../img/setting_header_child.png')}
                  style={{ width: 100, height: 100, resizeMode: 'contain', zIndex: 1 }}
                />
                <View
                  style={[
                    {
                      width: 22,
                      height: 22,
                      borderRadius: 22 / 2,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      position: 'relative',
                      bottom: 10,
                    },
                    { transform: [{ scaleX: 3 }] },
                  ]}
                />
              </View>
            </ImageBackground>
          </View>
        </CustomHeader>

        <ScrollView>
          <View style={styles.middle}>
            <Text style={styles.text}>{L('activation_failed', [secret, userId, errorCode + ' ' + reason])}</Text>

            <Icon
              containerStyle={styles.checkmark}
              type="ionicon"
              name="ios-close-circle-outline"
              color="red"
              size={100}
            />
          </View>

          <KsButton
            onPress={() => this.callSupport(secret, userId, errorCode)}
            title={L('contact_support')}
            style={{ padding: 15, marginHorizontal: 20, marginVertical: 5 }}
            titleStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;

  const { userId, userProps } = state.authReducer;

  return {
    objects,
    userProps,
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivationFailPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  middle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },
  text: {
    fontSize: 18,
  },
  checkmark: {
    paddingTop: 10,
  },
});
