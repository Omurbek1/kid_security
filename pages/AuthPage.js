import React from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Image,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  BackHandler,
  TextInput,
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthInput from '../components/AuthInput';
import { authActionCreators } from '../reducers/authRedux';
import { ActionCreators as WsActionCreators } from '../wire/WsMiddleware';
import NavigationService from '../navigation/NavigationService';
import Const from '../Const';
import { L } from '../lang/Lang';
import * as Utils from '../Utils';

class AuthPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    const { username, password, connect, loggedOut } = this.props;

    if (username && password && username.length > 1 && password.length > 1 && !loggedOut) {
      connect(Utils.getServerUrl(), this.onConnectionFailed.bind(this));
    }
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  handleBackButton() {
    const pageName = NavigationService.currentPageName();
    if ('Auth' === pageName) {
      return true;
    } else {
      return false;
    }
  }

  onConnectionFailed() {
    console.log('connection failed');
    Alert.alert(L('error'), L('unable_to_connect_to_server'), [{ text: 'OK' }], { cancelable: true });
  }

  render() {
    const {
      setUsername,
      setPassword,
      connect,
      username,
      password,
      connectingAndAuthorizingInProgress,
      authorized,
    } = this.props;

    return (
      <ImageBackground source={require('../img/ic_sirius_back.jpg')} style={{ width: '100%', height: '100%', flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>
            <StatusBar backgroundColor="white" barStyle="light-content" translucent={true} />
            <Text style={styles.text}>{L('sign_in')}</Text>
            <View style={styles.whiteBox}>
              <Image source={require('../img/ic_sirius_logo.png')} style={styles.logo} />
              <AuthInput
                style={styles.auth_input}
                icon="user"
                hint={L('hint_phone_number_starts_with_7')}
                keyboardType="phone-pad"
                editable={!connectingAndAuthorizingInProgress}
                value={username}
                textColor="black"
                iconColor="grey"
                onChangeText={(text) => {
                  setUsername(Utils.extractPhone(text));
                }}
              />

              <AuthInput
                style={styles.auth_input}
                icon="lock"
                hint={L('hint_password')}
                textColor="black"
                iconColor="grey"
                hintColor="black"
                securedColor="black"
                secured={true}
                editable={!connectingAndAuthorizingInProgress}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />

              <Button
                style={styles.login_button}
                loading={connectingAndAuthorizingInProgress || authorized}
                buttonStyle={{ height: 45, width: 250, marginTop: 10 }}
                //backgroundColor='#ed7ad790'
                backgroundColor="#FF666F"
                borderRadius={20}
                title={connectingAndAuthorizingInProgress || authorized ? L('authorizing') : L('signin')}
                onPress={() => {
                  connect(Utils.getServerUrl(), this.onConnectionFailed.bind(this));
                }}
              />
            </View>
            <Button
              buttonStyle={(style = { marginTop: 20 })}
              transparent={true}
              title={L('menu_registration')}
              onPress={() => NavigationService.navigate('Register')}
            />
            <Button
              buttonStyle={styles.forgot_password}
              transparent={true}
              title={L('menu_forgot_password')}
              onPress={() => NavigationService.navigate('Recover')}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={{ padding: 0, margin: 0, backgroundColor: '#ffffff15' }}>
          <Button
            containerViewStyle={{ margin: 0 }}
            color="#ffffff90"
            buttonStyle={{ height: 50, margin: 0, padding: 0 }}
            backgroundColor="transparent"
            title={Const.HOMEPAGE_TEXT}
            onPress={() => Linking.openURL(Const.HOMEPAGE)}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  const { username, password, connectingAndAuthorizingInProgress, authorized } = state.authReducer;
  return {
    username,
    password,
    connectingAndAuthorizingInProgress,
    authorized,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUsername: bindActionCreators(authActionCreators.setUsername, dispatch),
    setPassword: bindActionCreators(authActionCreators.setPassword, dispatch),
    connect: bindActionCreators(WsActionCreators.connect, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
  },
  auth_input: {
    marginBottom: 10,
    backgroundColor: '#d8d8d8',
    borderRadius: 20,
    width: 250,
  },
  logo: {
    marginTop: 50,
    marginBottom: 50,
    width: 120,
    height: 120,
  },
  forgot_password: {
    marginTop: 5,
  },
  login_button: {
    padding: 0,
    margin: 0,
    width: 250,
  },
  website_button: {},
  whiteBox: {
    height: 420,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  text: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
});
