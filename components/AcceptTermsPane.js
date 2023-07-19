import React, { Component } from 'react';
import { View, Text, Image, TextInput, Modal } from 'react-native';
import { Button, CheckBox, FormValidationMessage } from 'react-native-elements';
import { StyleSheet, Linking } from 'react-native';
import Const from '../Const';
import { L } from '@lang';

import LangPhoneInput from './LangPhoneInput';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import * as Metrica from '../analytics/Analytics';
import { soundBalanceToStr } from '../Utils';
import UserPrefs from '../UserPrefs';
import { APIService } from '../Api';

const defaultProps = {
  title: 'Title',
  image: require('../img/ic_wiretap.png'),
  onAccept: null,
  disabled: false,
  visible: true,
};

class AcceptTermsPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      phone: '+',
      email: '',
      emailOk: true,
      alternativeReg: null,
      selectedCountry: null,
    };
    this.countryList = [
      //{ name: 'Canada', smsNumber: 3339, smsText: 'Kid Security регистрация' },
      { name: 'Belarus', smsNumber: 3339, smsText: 'Kid Security регистрация' },
      //{ name: 'Kazakhstan', smsNumber: 3339, smsText: 'Kid Security регистрация' },
    ];
  }

  componentDidMount() {
    this.props.visible && !this.props.premiumReallyPaid
      ? this.reqUserIpData()
      : this.setState({ alternativeReg: false });
  }

  reqUserIpData = () => {
    const country = UserPrefs.all.userLocationCountry;
    const matchingCountry = this.countryList.filter((item) => item.name === country);

    if (matchingCountry.length > 0) {
      this.setState({ alternativeReg: true, selectedCountry: matchingCountry });
    } else {
      this.setState({ alternativeReg: false });
    }
  };

  onPhoneChanged(phone) {
    if (this.props.onPhoneChanged) {
      this.props.onPhoneChanged(phone);
    }
  }

  processOssToken() {
    const { ossToken, redeemOssToken, setPremiumValid } = this.props;

    if (!ossToken) {
      return;
    }

    redeemOssToken({ ossToken }, (pr, packet) => {
      const { data } = packet;
      if (0 === data.result) {
        Metrica.event('oss_token_redeemed', { dontShow: this.state.checked });
        UserPrefs.setCachedPremiumPurchased(true);
        setPremiumValid({ PREMIUM_PURCHASED: true, WIRE_PURCHASED: null }, null);
      } else {
        Metrica.event('oss_token_failed', { data });
      }
    });
  }
  onEmailChanged = (email) => {
    this.setState({ email });
    if (this.props.onEmailChanged) {
      this.props.onEmailChanged(email);
    }
  };

  validateEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(String(email).toLowerCase());
  }

  canOpen(url) {
    Linking.canOpenURL(url)
      .then((supported) =>
        supported
          ? Linking.openURL(url)
          : Alert.alert('Error', 'There was an error attempting to opening the location.')
      )
      .catch(() => Alert.alert('Error', 'There was an error attempting to opening the location.'));
  }
  openUrl(url) {
    return Linking.openURL(url);
  }
  openSmsUrl(phone, body) {
    return this.openUrl(`sms:${phone}${Platform.OS === 'ios' ? '&' : '?'}body=${body}`);
  }

  render() {
    const props = { ...defaultProps, ...this.props };
    const { emailOk } = this.state; //this.state.phone.length >= 9;
    const phoneOk = true; //this.state.phone.length >= 9;

    return props.visible && this.state.alternativeReg != null ? (
      <Modal visible={props.visible} transparent={true}>
        <View style={styles.accept_terms}>
          <View style={styles.accept_terms_content}>
            <Text style={[styles.title, { marginVertical: !this.state.alternativeReg ? 40 : 10 }]}>
              {L('menu_registration')}
            </Text>
            {!this.state.alternativeReg && (
              <View style={[styles.email_container, emailOk ? {} : styles.email_alert]}>
                <TextInput
                  style={[styles.email_input]}
                  value={this.state.email}
                  placeholder="E-mail"
                  autoCapitalize="none"
                  placeholderTextColor="#9f9f9f"
                  returnKeyType="done"
                  underlineColorAndroid="transparent"
                  keyboardType="email-address"
                  onChangeText={this.onEmailChanged}
                />
              </View>
            )}
            <Text style={[styles.phone_alert, phoneOk ? styles.phone_alert_hidden : {}]}>
              {L('check_phone_number_input')}
            </Text>
            <LangPhoneInput
              style={styles.lang_phone_input}
              onSelect={props.onLanguageSelect}
              onPhoneChanged={this.onPhoneChanged.bind(this)}
            />
            <Text style={styles.text}>
              {this.state.alternativeReg ? L('input_number_belarus') : L('pick_a_language_and_type_phone_number')}
            </Text>

            <View style={styles.checkbox_outer}>
              <CheckBox
                containerStyle={styles.checkbox}
                iconType="ionicon"
                checkedIcon="ios-checkbox"
                uncheckedIcon="ios-square-outline"
                checkedColor="#FF666F"
                size={32}
                checked={this.state.checked}
                onPress={() => this.setState({ checked: !this.state.checked })}></CheckBox>
              <View style={styles.terms_links}>
                <View style={styles.terms_row}>
                  <Text style={styles.info_text}>{L('policy_i_accept')}</Text>
                  <Text style={[styles.info_text, styles.link]} onPress={() => Linking.openURL(L('terms_of_use_url'))}>
                    {L('policy_terms_of_use')}
                  </Text>
                </View>
                <View style={styles.terms_row}>
                  <Text style={styles.info_text}>{L('policy_and')}</Text>
                  <Text style={[styles.info_text, styles.link]} onPress={() => Linking.openURL(L('policy_url'))}>
                    {L('policy_privacy')}
                  </Text>
                </View>
              </View>
            </View>
            <Button
              onPress={() => {
                if (this.validateEmail(this.state.email) || this.state.email === '') {
                  this.state.alternativeReg &&
                    this.openSmsUrl(this.state.selectedCountry[0]?.smsNumber, this.state.selectedCountry[0]?.smsText);
                  setTimeout(() => {
                    props.onAccept();
                  }, 500);
                } else {
                  this.setState({ emailOk: false });
                }
              }}
              buttonStyle={styles.button}
              title={this.state.alternativeReg ? L('continue') : L('accept_terms')}
              color="white"
            />
            {this.state.alternativeReg && (
              <View style={{ width: '90%' }}>
                <Text style={{ textAlign: 'center' }}>{L('sms_belaruc')}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { ossToken, premiumReallyPaid } = state.controlReducer;
  return {
    ossToken,
    premiumReallyPaid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redeemOssToken: bindActionCreators(controlActionCreators.redeemOssToken, dispatch),
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcceptTermsPane);

const styles = StyleSheet.create({
  accept_terms: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accept_terms_content: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    marginTop: 25,
    marginBottom: 15,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  text: {
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 16,
    color: '#000',
  },
  phone_alert: {
    paddingBottom: 5,
    color: 'red',
    fontSize: 11,
  },
  phone_alert_hidden: {
    opacity: 0,
  },
  email_alert: {
    borderWidth: 4,
    borderColor: 'red',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tou: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
  },
  email_container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 6,
    borderColor: '#FF666F',
    borderWidth: 2,
    height: 50,
    paddingHorizontal: 20,
  },
  email_input: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    fontSize: 18,
  },
  lang_phone_input: {},
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    maxWidth: 45,
    padding: 0,
    margin: 0,
  },
  checkbox_outer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  terms_links: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  info_text: {
    textAlign: 'justify',
    fontSize: 10,
    color: '#000',
  },
  link: {
    textDecorationLine: 'underline',
    color: '#24a2e6',
  },
  terms_row: {
    flexDirection: 'row',
  },
});
