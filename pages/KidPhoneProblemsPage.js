import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image, SafeAreaView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import { L } from '../lang/Lang';
import ProblemItem from '../components/ProblemItem';
import * as Utils from '../Utils';
import { Icon } from 'react-native-elements';
import UserPrefs from '../UserPrefs';

class KidPhoneProblemsPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };
  contactViaChat = async () => {
    const {
      objects,
      userId,
    } = this.props;

    const url = Const.compileSupportUrl(userId, objects);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          const instructionsUrl = L('instructions_url');
          Linking.openURL(instructionsUrl);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.warn('An error occurred', err));
  };
  UNSAFE_componentWillMount() { }

  componentDidMount() { }

  render() {
    const { navigation, objects } = this.props;
    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    const alerts = Utils.getConfigurationAlets(obj);

    //const langIgnore = ['ro','hy','nl','pt'];
    //const ignoreLang = !!langIgnore.find(item=>item===UserPrefs.all.language);

    return (
      //return !ignoreLang&&(
      <SafeAreaView style={styles.container}>
        {alerts.hasAlert ? (
          <View style={styles.issues}>
            {/*<Image style={styles.big_alert} source={require('../img/ic_circle_alert_256.png')} />*/}
            <Icon style={styles.no_issues_icon} type="evilicon" name="exclamation" color="red" size={150} />
            <Text style={styles.big_alert_text}>{L('kid_phone_is_not_configured')}</Text>
            {/* <Text style={styles.hint}>{L('configure_kid_app_properly')}</Text> */}
            <View style={{ borderColor: '#000', borderBottomWidth: 1 }} />
            <View style={styles.problems}>
              <Text style={styles.medium_text}>{L('kids_phone_has')}</Text>
              <ProblemItem text={L('problem_gps_disabled')} visible={alerts.gpsAlert} />
              <ProblemItem text={L('problem_no_mic_permission')} visible={alerts.micPermissionAlert} />
              <ProblemItem text={L('problem_no_gps_permission')} visible={alerts.gpsPermissionAlert} />
              <ProblemItem text={L('problem_powersaving_enabled')} visible={alerts.powersavingAlert} />
              <ProblemItem text={L('problem_mobile_data_disabled')} visible={alerts.mobileDataAlert} />
              <ProblemItem text={L('problem_offline_alert')} visible={alerts.offlineAlert} />
              <ProblemItem text={L('background_mode_alert')} visible={alerts.backgroundModeAlert} />
              <ProblemItem text={L('background_permission_alert')} visible={alerts.backgroundPermissionAlert} />
              <ProblemItem text={L('admin_disabled_alert')} visible={alerts.adminDisabledAlert} />
              <ProblemItem text={L('turn_off_push_permission')} visible={alerts.readMessagesDisabledAlert} />
            </View>
          </View>
        ) : (
          <View style={styles.issues}>
            <Icon style={styles.no_issues_icon} type="evilicon" name="check" color="green" size={150} />
            <Text style={styles.big_green_text}>{L('no_issues_found')}</Text>
          </View>
        )}
        <TouchableOpacity
          color="white"
          style={[styles.button, alerts.hasAlert ? {} : { backgroundColor: 'green' }]}
          onPress={() => {
            NavigationService.navigate(Object.keys(objects).length > 0 ? 'Map' : 'DemoMap');
            //navigation.popToTop()
          }}>
          <View style={styles.button_inner}>
            <Text style={styles.button_text}>{L('i_understood')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'white', marginVertical: 10 }}
          onPress={() => this.contactViaChat()}>
          <Text style={styles.support_text}>{L('contact_support_via_chat')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;
  const { userId, userProps } = state.authReducer;

  return {
    objects,
    userId,
    userProps,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectEvents: bindActionCreators(controlActionCreators.getObjectEvents, dispatch),
    setObjectEventList: bindActionCreators(controlActionCreators.setObjectEventList, dispatch),
    clearObjectEventList: bindActionCreators(controlActionCreators.clearObjectEventList, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KidPhoneProblemsPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 30,
  },
  issues: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 23,
  },
  button_text: {
    color: '#fff',
    paddingRight: 10,
  },
  support_text: {
    color: '#000',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  button_inner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  big_alert: {
    width: 90,
    height: 90,
  },
  big_alert_text: {
    padding: 10,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    fontSize: 28,
  },
  medium_text: {
    textAlign: 'left',
    color: '#000',
    fontSize: 18,
    paddingBottom: 20,
  },
  big_green_text: {
    padding: 10,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    fontSize: 28,
  },
  hint: {
    textAlign: 'center',
    padding: 5,
  },
  problems: {
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '80%',
    padding: 10,
  },
});
