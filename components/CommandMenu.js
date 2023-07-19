import React, { Component } from 'react';
import { View, Animated, Easing, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, Dimensions, Linking, Platform } from 'react-native';
import CommandButton from '../components/CommandButton';
import { controlActionCreators } from '../reducers/controlRedux';
import * as Utils from '../Utils';
import { L } from '@lang';

import { isIphoneX } from './slider/AppIntroSlider 3';
import NavigationService from "../navigation/NavigationService";
import {isDeviceFirmware, isDeviceOS, isIosDevice} from "../Utils";

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
let hiddenY = 160;

class CommandMenu extends Component {
  state = {
    visible: false,
    y: new Animated.Value(hiddenY),
    alpha: new Animated.Value(0.0),
    shadow: true,
  };

  show() {
    this.setState({ visible: true });
    Animated.parallel([
      Animated.timing(this.state.y, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.state.alpha, {
        fromValue: 0.5,
        toValue: 1.0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }

  hide() {
    Animated.parallel([
      Animated.timing(this.state.y, {
        toValue: hiddenY,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.state.alpha, {
        toValue: 0.0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ visible: false, shadow: true });
    });
    this.setState({ shadow: false });
  }

  toggle() {
    const visible = this.state.visible;
    visible ? this.hide() : this.show();
    return !visible;
  }

  render() {
    const { objects, oid } = this.props;

    let activeObject = {
      states: {
        ussdBalance: null,
      },
    };
    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    let { ussdBalance } = activeObject.states;
    let balance = '0.00';
    let balance_ts = '';



    // TODO: release OTA after Apple review
    const isIOS = false; // Utils.isDeviceFirmware(objects,oid,'ios');

    const iosChatObject = Utils.isIosChatObject(activeObject);
    try {
      const b = JSON.parse(ussdBalance);
      if (b.balance) {
        balance = b.balance;
      }
      if (b.currency) {
        balance += ' ' + b.currency;
      }
      if (b.ts) {
        balance_ts = Utils.makeElapsedDate(new Date(b.ts));
      }
    } catch (e) {}

    return this.state.visible ? (
      <Animated.View
        opacity={this.state.alpha}
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: this.state.y,
              },
            ],
          },
        ]}>
        <View style={styles.commands}>
          <View style={styles.commandRow1}>
            {!isIOS&&<CommandButton
              shadow={this.state.shadow}
              image={require ('../img/ic_wiretap.png')}
              title={L ('menu_sound_around')}
              // locked={featureLocked && limits.callback}
              onPress={this.props.onWiretappingClick}
            />}
            <CommandButton
              shadow={this.state.shadow}
              image={require('../img/ic_geofences.png')}
              title={L('setup_place_on_the_map')}
              onPress={this.props.onPlacesClick}
            />
            <CommandButton
              shadow={this.state.shadow}
              image={require('../img/ic_movements.png')}
              title={L('menu_movement_history')}
              // locked={featureLocked && limits.movementHistory}
              onPress={this.props.onTrackHistoryClick}
            />
          </View>
          <View style={styles.commandRow2}>
            <CommandButton
              shadow={this.state.shadow}
              image={require('../img/ic_bell.png')}
              title={L('menu_buzzer')}
              // locked={featureLocked && limits.buzzer}
              onPress={this.props.onBuzzerClick}
            />
            {!isIOS?iosChatObject ? null : (
              <CommandButton
                shadow={this.state.shadow}
                image={require('../img/ic_list.png')}
                title={L('menu_stats')}
                // locked={featureLocked && limits.stats}
                onPress={this.props.onStatsClick}
              />
            ):null}
            <CommandButton
              shadow={this.state.shadow}
              image={require('../img/ic_goal.png')}
              title={L('menu_achievments')}
              onPress={this.props.onAchievementsClick}
              badge={this.props.counters.unconfirmedAllTaskCount + this.props.counters.unprocessedDaydreamCount}
            />
          </View>
          {/*<View style={styles.commandRow2}>
            <CommandButton
              shadow={this.state.shadow}
              image={require('../img/ic_bell.png')}
              title={L('menu_buzzer')}
              // locked={featureLocked && limits.buzzer}
              onPress={()=>{
                NavigationService.navigate('FreeMinutes', { });
              }}
            />
          </View>*/}
        </View>
      </Animated.View>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { premium } = state.authReducer;
  const { premiumValid, objects } = state.controlReducer;
  const { counters } = state.achievementReducer;
  return {
    premium,
    premiumValid,
    objects,
    counters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeObjectCard: bindActionCreators(controlActionCreators.changeObjectCard, dispatch),
    fetchCounters: dispatch({ type: 'FETCH_COUNTERS_REQUESTED' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(CommandMenu);

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    padding: 10,
    width: '100%',
    position: 'absolute',
    bottom: isIphoneX ? 100 : 90,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    height: 300,
  },
  commands: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width: '90%',
    borderRadius: 20,
    marginLeft: '5%',
  },
  commandRow1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  commandRow2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  rating_pane: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  rating_text: {
    opacity: 0.5,
    fontSize: 10,
  },
  balance_pane: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  refresh_button: {
    marginLeft: 10,
  },
  setup_button: {
    marginLeft: 30,
  },
  rateStyle: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  ratingButtons: {
    width: 45,
    height: 45,
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
  },
});
