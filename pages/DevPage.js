import React from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import UserPrefs from '../UserPrefs';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { connect } from 'react-redux';
import { ActionCreators as WsActionCreators } from '../wire/WsMiddleware';
import NavigationService from '../navigation/NavigationService';
import Const from '../Const';
import * as Permissions from 'expo-permissions';
import { getHeader } from '../shared/getHeader';

class DevPage extends React.Component {
  state = {
    devHost: '',
    useDevHost: false,
    useDevDomain: false,
  };

  static _onSave = null;

  static navigationOptions = () => {
    return {
      ...getHeader({ title: 'Dev' }),
      headerRight: (
        <TouchableOpacity onPress={() => _onSave()}>
          <Text style={styles.btnSave}>Save</Text>
        </TouchableOpacity>
      ),
    };
  };

  UNSAFE_componentWillMount() { }

  componentWillUnmount() { }

  async componentDidMount() {
    _onSave = this.onSave.bind(this);
    this.setState({
      devHost: UserPrefs.all.devHost,
      useDevHost: UserPrefs.all.useDevHost,
      useDevDomain: UserPrefs.all.useDevDomain,
    });

    Permissions.askAsync('localNetwork');
  }

  onChangeHost(host) {
    let devHost = host.trim();
    this.setState({ devHost });
  }

  onSave() {
    const { useDevHost, devHost, useDevDomain } = this.state;
    UserPrefs.setUseDevHost(useDevHost);
    UserPrefs.setUseDevDomain(useDevDomain);
    UserPrefs.setDevHost(devHost);
    if (useDevHost) {
      UserPrefs.setTermsOfUseAccepted(false);
      UserPrefs.setIntroShown(false);
    }
    Const.updateHost(useDevHost, devHost, useDevDomain);
    NavigationService.back();
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          value={this.state.devHost}
          style={styles.input_field}
          placeholder="Dev host"
          onChangeText={this.onChangeHost.bind(this)}
        />

        <View style={styles.checkbox_outer}>
          <CheckBox
            containerStyle={styles.checkbox}
            iconType="ionicon"
            checkedIcon="ios-checkbox"
            uncheckedIcon="ios-square-outline"
            checkedColor="#FF666F"
            size={32}
            checked={this.state.useDevDomain}
            onPress={() => this.setState({ useDevDomain: !this.state.useDevDomain })}></CheckBox>
          <Text>public domain name specified</Text>
        </View>

        <View style={styles.checkbox_outer}>
          <CheckBox
            containerStyle={styles.checkbox}
            iconType="ionicon"
            checkedIcon="ios-checkbox"
            uncheckedIcon="ios-square-outline"
            checkedColor="#FF666F"
            size={32}
            checked={this.state.useDevHost}
            onPress={() => this.setState({ useDevHost: !this.state.useDevHost })}></CheckBox>
          <Text>use dev host</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { demo, authorized } = state.authReducer;
  return {
    demo,
    authorized,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveOid: bindActionCreators(controlActionCreators.setActiveOid, dispatch),
    setUsername: bindActionCreators(authActionCreators.setUsername, dispatch),
    setPassword: bindActionCreators(authActionCreators.setPassword, dispatch),
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPrices: bindActionCreators(controlActionCreators.setPrices, dispatch),
    setProducts: bindActionCreators(controlActionCreators.setProducts, dispatch),
    storeSubscriptionInfo: bindActionCreators(controlActionCreators.storeSubscriptionInfo, dispatch),
    setIAPReady: bindActionCreators(controlActionCreators.setIAPReady, dispatch),
    connect: bindActionCreators(WsActionCreators.connect, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevPage);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  input_field: {
    flexGrow: 1,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  checkbox_outer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    maxWidth: 45,
    padding: 0,
    margin: 0,
  },
  checkbox_text_outer: {},
  checkbox_text: {},
  btnSave: {
    paddingRight: 10,
    color: 'white',
  },
});
