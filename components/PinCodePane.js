import React, { Component } from 'react';
import Rest from '../Rest';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ActivityIndicator } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { controlActionCreators } from '../reducers/controlRedux';
import CodeInput from './molecules/CodeInput';
import UserPrefs from '../UserPrefs';
import { L } from '@lang';

const defaultProps = {
  visible: false,
  phoneNumber: '',
};

class PinCodePane extends Component {
  state = { code: '', error: false, success: false, isLoading: false };

  sendPinToBackend = async (code) => {
    const { redeemOssPin, ossMsisdn, ossPinToken, setShowPinCodePane, setPremiumValid } = this.props;

    this.setState({ isLoading: true });

    redeemOssPin({ token: ossPinToken, pin: code, msisdn: ossMsisdn.replace('+', '') }, (pr, packet) => {
      const { data } = packet;
      Rest.get().debug({ OSS: 'redeemOssPin', data });

      if (0 === data.result) {
        console.log('redeemOssToken: data success', data);
        this.setState({ error: false, isLoading: false, success: true });
        setTimeout(() => {
          setShowPinCodePane(false);
          UserPrefs.setUcellAuthPassed(true);
          UserPrefs.setCachedPremiumPurchased(true);
          setPremiumValid({ PREMIUM_PURCHASED: true, WIRE_PURCHASED: null }, null);
        }, 1000);
      } else {
        this.setState({ error: true, isLoading: false, code: '' });
      }
    });
  };

  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.pinCodePane}>
        <View style={styles.pinCodePaneContent}>
          <Text style={styles.text2}>{L('pin_uz')}</Text>
          <CodeInput
            cellStyle={styles.cellStyle}
            cellStyleFilled={{}}
            cellStyleFocused={styles.cellStyleFocused}
            containerStyle={{ alignSelf: 'center' }}
            codeLength={4}
            textStyle={{ color: '#000000', fontSize: 20 }}
            textContentType={'oneTimeCode'}
            value={this.state.code}
            onTextChange={(text) => this.setState({ code: text })}
            onFulfill={(text) => {
              this.sendPinToBackend(text);
            }}
          />
          <Text style={styles.errorText}>{this.state.error ? L('pin_uz_wrong') : ''}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              color="white"
              style={[styles.button, { backgroundColor: this.state.success ? 'green' : '#ef4c77' }]}
              onPress={() => {
                this.sendPinToBackend(this.state.code);
              }}>
              {!this.state.isLoading ? <Text style={styles.button_text}>OK</Text> : <ActivityIndicator color="#fff" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { ossPinToken, ossMsisdn, ossPin } = state.controlReducer;
  return {
    ossPinToken,
    ossMsisdn,
    ossPin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redeemOssPin: bindActionCreators(controlActionCreators.redeemOssPin, dispatch),
    setShowPinCodePane: bindActionCreators(controlActionCreators.setShowPinCodePane, dispatch),
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PinCodePane);

const styles = StyleSheet.create({
  pinCodePane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pinCodePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    borderRadius: 20,
    padding: 40,
    height: 250,
    width: '95%',
  },
  image: {
    width: 120,
    height: 120,
  },
  text1: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  text2: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '75%',
    borderRadius: 20,
    backgroundColor: '#ef4c77',
  },
  button_text: {
    fontSize: 16,
    color: 'white',
    fontWeight: '800',
  },
  errorText: { color: 'red', textAlign: 'center', fontSize: 16, marginVertical: 10 },
  cellStyle: {
    borderBottomWidth: 2,
    borderColor: '#D4D4D4',
  },

  cellStyleFocused: {
    borderBottomColor: '#ef4c77',
  },
});
