import React from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { L } from '../lang/Lang';
import CustomHeader from '../components/molecules/CustomHeader';
import { getHeader } from '../shared/getHeader';

class ActivationSuccessPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_activation'), noBackground: true }),
    };
  };

  render() {
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
                  ]}></View>
              </View>
            </ImageBackground>
          </View>
        </CustomHeader>

        <View style={styles.middle}>
          <Text style={styles.text}>{L('activation_successfull')}</Text>

          <Icon
            containerStyle={styles.checkmark}
            type='ionicon'
            name='ios-checkmark-circle-outline'
            color='green'
            size={100}
          />
        </View>

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

export default connect(mapStateToProps, mapDispatchToProps)(ActivationSuccessPage);

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
    flex: 1,
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
  }
});
