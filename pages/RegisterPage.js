import React from 'react';
import {
  Text,
  Alert,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthInput from '../components/AuthInput';
import { authActionCreators } from '../reducers/authRedux';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar } from '../Utils';
import Rest from '../Rest';
import { L } from '../lang/Lang';
import { ColorScheme } from '../shared/colorScheme';

const ios = 'ios' === Platform.OS;

class RegisterPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  backToAuth = () => {
    this.NavigationService.back();
  };

  onRegister() {
    const { registerUsername, setRegistrationInProgress, navigation } = this.props;
    const username = registerUsername ? registerUsername.trim() : '';
    if (username.length < 12 || 0 !== username.indexOf('+')) {
      Alert.alert(L('error'), L('check_phone_number_input'), [{ text: 'OK' }], { cancelable: true });
      return;
    }

    setRegistrationInProgress(true);
    const jumpReg = navigation.getParam('jumpReg');
    Rest.get().registerNewUser(
      username,
      'ru',
      (data) => {
        console.log(data);
        Alert.alert(L('thanks_for_signup'), L('password_sent_in_sms'), [{ text: 'OK' }], { cancelable: true });
        jumpReg ? NavigationService.forceReplace('Auth') : NavigationService.back();
      },
      (data) => {
        console.log(data);
        var message = L('failed_to_register');
        if (data) {
          var code = data.code;
          switch (code) {
            case 4003:
              message = L('user_already_registered');
              break;
          }
        }
        setRegistrationInProgress(false);
        Alert.alert(L('error'), message, [{ text: 'OK' }], { cancelable: true });
      }
    );
  }

  componentDidMount() {}

  render() {
    const { registerUsername, registrationInProgress, setRegisterUsername, navigation } = this.props;

    const jumpReg = navigation.getParam('jumpReg');

    return (
      <ImageBackground source={require('../img/ic_sirius_back.jpg')} style={{ width: '100%', height: '100%', flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.mainContainer}>
            <Text style={styles.registerText}>{L('menu_registration')}</Text>
            <View style={styles.whiteBox}>
              <View style={styles.container}>
                <Text style={styles.hint}>{L('specify_phone_to_register')}</Text>
                <AuthInput
                  style={styles.auth_input}
                  icon="user"
                  hint={L('hint_phone_number_starts_with_7')}
                  keyboardType="phone-pad"
                  editable={!registrationInProgress}
                  value={registerUsername}
                  iconColor="grey"
                  backgroundColor="#d8d8d8"
                  palceholderTextColor="rgba(0,0,0,0.5)"
                  selectionColor="blue"
                  textColor="black"
                  onChangeText={(text) => {
                    setRegisterUsername(text);
                  }}
                />
                <Button
                  loading={registrationInProgress}
                  containerViewStyle={{ width: 250 }}
                  buttonStyle={{ height: 45 }}
                  backgroundColor="#FF666F"
                  borderRadius={20}
                  title={registrationInProgress ? L('registering') : L('do_register')}
                  onPress={this.onRegister.bind(this)}
                />
                <Button
                  loading={registrationInProgress}
                  containerViewStyle={{ width: 250 }}
                  buttonStyle={{ height: 45, marginTop: 10 }}
                  backgroundColor={ColorScheme.blue}
                  borderRadius={20}
                  title={L('already_registered')}
                  onPress={() => (jumpReg ? NavigationService.forceReplace('Auth') : NavigationService.back())}
                />

                <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  const { registerUsername, registrationInProgress } = state.authReducer;

  return {
    registerUsername,
    registrationInProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRegisterUsername: bindActionCreators(authActionCreators.setRegisterUsername, dispatch),
    setRegistrationInProgress: bindActionCreators(authActionCreators.setRegistrationInProgress, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  buttonDelete: {
    marginTop: 50,
    backgroundColor: 'white',
    borderColor: 'gray',
  },
  auth_input: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 20,
    width: 250,
    backgroundColor: '#d8d8d8',
  },
  register_button: {
    padding: 0,
    margin: 0,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#6F93DF',
    marginTop: 50,
  },
  whiteBox: {
    height: 340,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  hint: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 17,
    color: 'grey',
  },
  registerText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
});
