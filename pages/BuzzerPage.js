import React from 'react';
import {
  Text,
  Platform,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import NavigationService from '../navigation/NavigationService';
import { getTime } from '../Utils';
import { L } from '../lang/Lang';
import * as Utils from '../Utils';
import { AppColorScheme } from '../shared/colorScheme';
import CustomHeader from '../components/molecules/CustomHeader';
import KsButton from '../components/atom/KsButton';
import { getHeader } from '../shared/getHeader';
import AlertPane from '../components/AlertPane';

const ios = 'ios' === Platform.OS;

class BuzzerPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_buzzer'), noBackground: true }),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    oid: null,
    signalSentTs: '',
    signalSetTime: '',
    signalDeliveredTime: '',
    signalDeliveredTs: '',
    alertText: '',
    showAlert: false,
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  onBackButtonPress = () => {
    NavigationService.back();
    return true;
  };

  UNSAFE_componentWillMount = () => {
    const { navigation } = this.props;
    this.setState({ oid: navigation.getParam('oid') });
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onBuzzerPress(enable) {
    const { objects, enableObjectFindZummer, showAlert } = this.props;
    const { oid } = this.state;

    this.openProgressbar(enable ? L('enabling_buzzer') : L('disabling_buzzer'));
    const hideProgressbar = this.hideProgressbar;

    var obj = objects[oid + ''];
    if (!obj) {
      obj = { states: {} };
      this.setState({ alertText: L('add_loud_signal'), showAlert: true });

      return;
    }
    const buzzerRcvdTs = obj.states.buzzerRcvdTs;

    enableObjectFindZummer(oid, (pr, packet) => {
      const { data } = packet;
      hideProgressbar();
      if (0 === data.result) {
        this.setState({
          signalSentTs: L('signal_was_sent_at') + getTime(new Date()),
          signalSetTime: getTime(new Date()),
          signalDeliveredTs: L('buzzer_not_yet_delivered'),
          buzzerRcvdTs,
        });

        return;
      } else if (oid === 1) {
        this.setState({ alertText: L('add_loud_signal'), showAlert: true });
        return;
      } else {
        this.setState({ signalSentTs: '', signalSetTime: null, signalDeliveredTs: '', signalDeliveredTime: null });
      }

      const message = enable ? L('enable') : L('disable');
      setTimeout(() => {
        showAlert(
          true,
          L('error'),
          L('failed_to_control_buzzer', [message, data.error]),
        );
      }, 300);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { objects } = this.props;
    const { oid, signalSentTs, buzzerRcvdTs } = this.state;

    if (!nextProps.objects) {
      return;
    }

    var obj = nextProps.objects[oid + ''];
    if (!obj) {
      obj = { states: { buzzerRcvdTs } };
    }
    const newBuzzerRcvdTs = obj.states.buzzerRcvdTs;

    if ('' !== signalSentTs && newBuzzerRcvdTs && buzzerRcvdTs !== newBuzzerRcvdTs) {
      let ts = parseInt(newBuzzerRcvdTs);
      if (ts < new Date().getTime()) {
        ts = new Date();
      } else {
        ts = new Date(ts);
      }
      setTimeout(() => {
        this.setState({
          signalDeliveredTs: L('buzzer_has_been_delivered', [Utils.getTime(ts)]),
          signalDeliveredTime: Utils.getTime(ts),

          buzzerRcvdTs: newBuzzerRcvdTs,
        });
      }, 0);
    }
  }

  render() {
    const { objects } = this.props;
    const { oid } = this.state;

    let activeObject = {
      props: {
        buzzerEnabled: '0',
      },
    };

    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    const buzzerEnabled = '1' === activeObject.props.buzzerEnabled;
    const image = require('../img/enable_sound.png'); //buzzerEnabled ? require('../img/disable_sound.png') : require('../img/enable_sound.png');
    const { signalSentTs, signalSetTime, signalDeliveredTs } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <CustomHeader
          style={{
            paddingBottom: 40,
            borderBottomLeftRadius: 100,
            borderBottomRightRadius: 40,
          }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground
              resizeMode={'contain'}
              style={[{ width: 150, height: 150, justifyContent: 'flex-end', alignItems: 'center' }, ,]}
              source={require('../img/ic_megaphone2.png')}>
              <View style={[{ position: 'relative', top: 40, alignItems: 'center' }]}>
                <Image
                  source={require('../img/buzzer_header_child.png')}
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
        <ScrollView style={{ backgroundColor: '#fafafa' }}>
          <View
            style={[
              {
                alignItems: 'center',
                borderBottomColor: AppColorScheme.passiveAccent,
                borderBottomWidth: 1,
                backgroundColor: 'white',
              },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 30 }}>
              <View style={{ flex: 2 }}>
                <Icon name="alert-circle-outline" type="material-community" color={AppColorScheme.accent}></Icon>
              </View>
              <View style={{ flex: 5 }}>
                <Text style={{ width: '100%', fontSize: 16, color: '#000' }}>{L('send_loud_signal_desc')}</Text>
              </View>
            </View>
          </View>
          {signalSetTime ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
              <Text style={{ fontSize: 16, color: AppColorScheme.passive }}>{L('signal_was_sent_at')}:</Text>
              <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{signalSetTime}</Text>
              <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 10 }}>{signalDeliveredTs}</Text>
            </View>
          ) : null}
          <View style={{ paddingVertical: 20, backgroundColor: '#fafafa' }}>
            <KsButton
              onPress={() => this.onBuzzerPress(true)}
              icon={{ name: 'bell-ring', type: 'material-community', color: 'white' }}
              title={L('enable_buzzer')}
              style={{ padding: 15, marginHorizontal: 20, marginVertical: 10 }}
              titleStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', alignItems: 'center' }}></KsButton>
            <KsButton
              outlined
              onPress={() => NavigationService.back()}
              title={L('move_backward')}
              style={{ padding: 15, marginHorizontal: 20 }}
              titleStyle={{ fontWeight: 'bold', fontSize: 16 }}></KsButton>
          </View>
        </ScrollView>
        <AlertPane
          visible={this.state.showAlert}
          titleText={this.state.alertText}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
        // cancelButtonText={L('cancel')}
        // onPressCancel={() => this.setState({ needPremiumVisible: false })}
        />
      </View>
    );
  }
}

//<ImageBackground source={require('../img/ic_sirius_back.jpg')} style={{ flex: 1 }}>
//   <View style={styles.mainContainer}>
//     <Text style={styles.title}>{L('menu_enable_buzzer')}</Text>
//     <View style={styles.whiteBox}>
//       <Text style={styles.text1}>{L('send_a_loud_signal')}</Text>
//       <Text style={styles.text2}>{L('if_dont_hear')}</Text>
//       <Text style={styles.text3}>{L('event_in_silent_mode')}</Text>
//       <TouchableOpacity style={styles.buzzer_button} onPress={() => this.onBuzzerPress(true)}>
//         <Text style={styles.buzzer_text}>{L('enable_buzzer')}</Text>
//       </TouchableOpacity>
//       <Text style={styles.success_text}>{signalSentTs}</Text>
//       <Text style={styles.delivered_text}>{signalDeliveredTs}</Text>
//       <Button
//         containerViewStyle={{ width: 250 }}
//         buttonStyle={{ height: 45, marginTop: 10 }}
//         backgroundColor={ColorScheme.blue}
//         borderRadius={20}
//         title={L('move_backward')}
//         onPress={() => NavigationService.navigate('Map')}
//       />
//     </View>
//     <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
//   </View>
// </ImageBackground></ImageBackground>
const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;

  return {
    objects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enableObjectFindZummer: bindActionCreators(controlActionCreators.enableObjectFindZummer, dispatch),
    disableObjectFindZummer: bindActionCreators(controlActionCreators.disableObjectFindZummer, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuzzerPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  success_text: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 11,
    textAlign: 'center',
  },
  delivered_text: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 11,
    textAlign: 'center',
  },
  whiteBox: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 30,
  },
  hint: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 17,
    color: 'grey',
  },
  title: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'center',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
  },
  scroll: {},
  scrollContainer: {},
  text1: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  text2: {
    fontSize: 16,
    textAlign: 'center',
  },
  text3: {
    fontSize: 14,
    textAlign: 'center',
  },
  buzzer_button: {
    backgroundColor: '#6F93DF',
    borderRadius: 20,
    width: 130,
    height: 130,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  buzzer_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
