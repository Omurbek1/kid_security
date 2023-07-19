import React from 'react';
import {
  Text,
  Alert,
  Linking,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Image,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthInput from '../components/AuthInput';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { ActionCreators as WsActionCreators } from '../wire/WsMiddleware';
import AppIntroSlider from 'react-native-app-intro-slider';
import NavigationService from '../navigation/NavigationService';
import { underConstruction, CustomProgressBar, makeElapsedDate } from '../Utils';
import BusinessModel from '../BusinessModel';
import { L } from '../lang/Lang';
import MyActivityIndicator from '../components/MyActivityIndicator';

const EVENTS_FILTER = [120, 302, 1601, 1701, 1901];
const MAX_EVENTS = 30;

class EventsPage extends React.Component {
  static navigationOptions = () => {
    return {
      title: L('menu_events'),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
  };

  UNSAFE_componentWillMount() {
    const { clearObjectEventList } = this.props;
    clearObjectEventList();
  }

  componentDidMount() {
    this.reloadEvents();
  }

  reloadEvents() {
    const { navigation, getObjectEvents, setObjectEventList } = this.props;
    const oid = navigation.getParam('oid');
    getObjectEvents(oid, 0, 'backward', 30, false, EVENTS_FILTER, (pr, packet) => {
      const { data } = packet;
      const filtered = [];
      if (0 === data.result) {
        for (let i in data.events) {
          const ev = data.events[i];
          if (BusinessModel.getAllowedEvent(ev)) {
            filtered.push(ev);
            if (filtered.length >= MAX_EVENTS) {
              break;
            }
          }
        }
      }
      setObjectEventList(oid, filtered);
    });
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  getEventText(ev, allowed) {
    let text = L(allowed.text);
    if (1701 == ev.code) {
      text += ' «' + ev.geozoneName + '»';
    }
    return text;
  }

  render() {
    const { navigation, objectEvents, objectEventsLoaded } = this.props;
    const oid = navigation.getParam('oid');
    let firstBar = true;

    return !objectEventsLoaded ? (
      <View style={styles.pageProgress}>
        <MyActivityIndicator size="large" />
      </View>
    ) : (
      <ScrollView containerStyle={styles.container} contentContainerStyle={{ padding: 20 }}>
        {objectEvents.map((ev) => {
          const allowed = BusinessModel.getAllowedEvent(ev);
          const wasFirstBar = firstBar;
          firstBar = false;
          return (
            <View key={ev.id} style={styles.event}>
              {wasFirstBar ? null : <View style={styles.bar} />}
              <View style={styles.eventContent}>
                <View style={styles.imageContainer}>
                  <View style={[styles.circle, { backgroundColor: allowed.backgroundColor }]}>
                    <Image style={styles.image} source={allowed.img} />
                  </View>
                </View>
                <View style={styles.rightText}>
                  <Text style={styles.text}>{this.getEventText(ev, allowed)}</Text>
                  <Text style={styles.textSmall}>{makeElapsedDate(new Date(ev.ts))}</Text>
                </View>
              </View>
            </View>
          );
        })}
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, objectEvents, objectEventsLoaded } = state.controlReducer;

  return {
    objects,
    objectEvents,
    objectEventsLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectEvents: bindActionCreators(controlActionCreators.getObjectEvents, dispatch),
    setObjectEventList: bindActionCreators(controlActionCreators.setObjectEventList, dispatch),
    clearObjectEventList: bindActionCreators(controlActionCreators.clearObjectEventList, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  event: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'column',
    //backgroundColor: 'green',
    width: '100%',
  },
  eventContent: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 32,
    height: 32,
  },
  rightText: {
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  text: {},
  textSmall: {
    fontSize: 12,
    color: '#999',
  },
  imageContainer: {},
  circle: {
    width: 64,
    height: 64,
    backgroundColor: 'red',
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  bar: {
    marginLeft: 30,
    width: 4,
    height: 40,
    backgroundColor: '#bbb',
  },
  pageProgress: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
