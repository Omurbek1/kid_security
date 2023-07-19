import React, { Component } from 'react';
import { View, Animated, Easing, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, Dimensions, Linking, Platform } from 'react-native';
import CommandButton from '../components/CommandButton';
import { controlActionCreators } from '../reducers/controlRedux';
import * as Utils from '../Utils';
import { L } from '@lang';


let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
let hiddenY = 460;

class CommandMenu extends Component {
  state = {
    visible: false,
    y: new Animated.Value(hiddenY),
    thanksVisible: false,
  };
  visible = false;

  show() {
    // this.updateRating();
    Animated.timing(this.state.y, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      this.setState({ visible: true });
    });
    this.setState({ thanksVisible: false });
  }

  hide() {
    Animated.timing(this.state.y, {
      toValue: hiddenY,
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      this.setState({ visible: false });
    });
  }

  toggle() {
    this.state.visible ? this.hide() : this.show();
  }

  ratingCompleted(rating) {
    const { changeObjectCard, oid } = this.props;
    this.setState({ thanksVisible: true });

    const card = {
      accuracyRating: rating,
    };
    changeObjectCard(oid, card);
  }

  // updateRating() {
  //     const {
  //         objects,
  //         oid,
  //     } = this.props
  //     let activeObject = {
  //         props: {
  //             accuracyRating: '0',
  //         }
  //     };

  //     const obj = objects[oid + ''];
  //     activeObject = obj ? obj : activeObject;
  //     const accuracyRating = parseInt(activeObject.props.accuracyRating, 10);
  //     this.ratingElement.setCurrentRating(accuracyRating);
  // }

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

    return (
      <Animated.View
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
        <ScrollView containerStyle={styles.content}>
          <View style={styles.commands}>
            <View style={styles.commandRow1}>
              <CommandButton
                image={require('../img/ic_wiretap.png')}
                title={L('menu_sound_around')}
                // locked={featureLocked && limits.callback}
                onPress={this.props.onWiretappingClick}
              />
              <CommandButton
                image={require('../img/ic_geofences.png')}
                title={L('setup_place_on_the_map')}
                onPress={this.props.onPlacesClick}
              />
              <CommandButton
                image={require('../img/ic_movements.png')}
                title={L('menu_movement_history')}
                // locked={featureLocked && limits.movementHistory}
                onPress={this.props.onTrackHistoryClick}
              />
            </View>
            <View style={styles.commandRow2}>
              <CommandButton
                image={require('../img/ic_bell.png')}
                title={L('menu_buzzer')}
                // locked={featureLocked && limits.buzzer}
                onPress={this.props.onBuzzerClick}
              />
              {iosChatObject ? (
                <CommandButton
                  image={require('../img/ic_list.png')}
                  title={L('menu_stats')}
                  // locked={featureLocked && limits.stats}
                  onPress={this.props.onStatsClick}
                />
              ) : null}

              <CommandButton
                image={require('../img/ic_goal.png')}
                title={L('menu_achievments')}
                onPress={this.props.onAchievementsClick}
                badge={this.props.counters.unconfirmedAllTaskCount + this.props.counters.unprocessedDaydreamCount}
              />
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    );
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
    zIndex: 9999,
    padding: 10,
    width: '100%',
    position: 'absolute',
    bottom: 105,
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
    width: '80%',
    borderRadius: 20,
    marginLeft: '10%',
  },
  commandRow1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
