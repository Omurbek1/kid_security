import React, { Fragment, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  BackHandler,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import { CustomProgressBar } from '../Utils';
import * as Utils from '../Utils';
import { L } from '../lang/Lang';
import { getHeader } from '../shared/getHeader';
import CustomHeader from '../components/molecules/CustomHeader';
import { AppColorScheme } from '../shared/colorScheme';
import AlertPane from '../components/AlertPane';
import NavigationService from '../navigation/NavigationService';
import Dialog from 'react-native-popup-dialog';
import DatePicker from 'react-native-date-picker';
import SyncStorage from 'sync-storage';
import { APIService } from '../Api';
import { Header } from 'react-navigation';
import { RestAPIService } from '../RestApi';

const stylesTimePicker = StyleSheet.create({
  open_button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 0,
  },
  open_button_image: {
    width: 20,
    height: 20,
  },
  button_ok: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    backgroundColor: '#FF666F',
    borderRadius: 15,
    width: 200,
  },
  button_cancel: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    backgroundColor: '#FF666F',
    borderRadius: 15,
    marginBottom: 5,
  },
  button_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  cancel_button: {
    right: 0,
    marginTop: 0,
    marginRight: 0,
  },
  time_picker: { height: 130 },
});

function TimePickerPopup({ value, onChange }) {
  let [state, setState] = useState({
    show: false,
    from: new Date(),
    to: new Date(),
    ...value,
  });

  return (
    <Fragment>
      <TouchableOpacity
        style={stylesTimePicker.open_button}
        onPress={() => setState((prev) => ({ ...prev, show: true }))}>
        <Image source={require('../img/pen.png')} style={stylesTimePicker.open_button_image} />
      </TouchableOpacity>
      <Dialog
        visible={state.show}
        containerStyle={{ padding: 0 }}
        onTouchOutside={() => setState((prev) => ({ ...prev, show: false }))}
        onHardwareBackPress={() => setState((prev) => ({ ...prev, show: false }))}>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            style={stylesTimePicker.cancel_button}
            onPress={() => setState((prev) => ({ ...prev, show: false }))}>
            <Icon iconColor="black" name="ios-close-circle-outline" type="ionicon" size={32} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 0 }}>
          <Text style={stylesTimePicker.text}>{L('show_stats')}</Text>
          <DatePicker
            style={stylesTimePicker.time_picker}
            //androidVariant={"nativeAndroid"}
            date={state.from}
            onDateChange={(e) => setState((prev) => ({ ...prev, from: e }))}
            mode={'time'}
          />
          <Text style={stylesTimePicker.text}>{L('do')}</Text>
          <DatePicker
            style={stylesTimePicker.time_picker}
            //androidVariant={"nativeAndroid"}
            date={state.to}
            onDateChange={(e) => setState((prev) => ({ ...prev, to: e }))}
            mode={'time'}
          />
        </View>
        <View style={{ margin: 15, alignItems: 'center' }}>
          <TouchableOpacity
            style={stylesTimePicker.button_ok}
            onPress={() => {
              setState((prev) => ({ ...prev, show: false }));
              onChange(state);
            }}>
            <Text style={stylesTimePicker.button_text}>{L('apply')}</Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    </Fragment>
  );
}

const stylesActivationFrame = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  text: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  button_activation: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 35,
    backgroundColor: '#FF666F',
    borderRadius: 15,
    marginBottom: 5,
  },
  button_activation_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

function ActivationFrame(props) {
  const { onShowHidePremiumModal } = props;

  return (
    <View style={stylesActivationFrame.wrapper}>
      <Text style={stylesActivationFrame.text}>{L('active_stats')}</Text>
      <TouchableOpacity
        style={stylesActivationFrame.button_activation}
        onPress={onShowHidePremiumModal}>
        <Text style={stylesActivationFrame.button_activation_text}>{L('active_on')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function updateDiapasonTitle(node) {
  return {
    ...node,
    title: L('app_usage_period_header', [
      Utils.getTime(node?.from || new Date()),
      Utils.getTime(node?.to || new Date()),
    ]),
  };
}

type diapasonType = {};

class StatsPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_stats'), noBackground: true }),
    };
  };

  setTime = (h = 0, m = 0, s = 0, ms = 0) => {
    return new Date().setHours(h, m, s, ms);
  };

  createDiapason = (prefix, id, from = new Date(), to = new Date(), title = undefined, apps = []) => {
    return { [prefix + '_' + id]: { id, from, to, title, apps } };
  };

  //installApp = InstalledApps.getApps();

  initDiapasons = {
    ...this.createDiapason('range', 1, new Date(this.setTime(8)), new Date(this.setTime(13))),
    ...this.createDiapason('range', 2, new Date(this.setTime(13)), new Date(this.setTime(18))),
    ...this.createDiapason('range', 3, new Date(this.setTime(18)), new Date(this.setTime(24))),
  };

  state = {
    diapasons: SyncStorage.get('userDiapasons') || this.initDiapasons,
    isProgress: false,
    progressTitle: null,
    showAlert: false,
    showTimePicker: false,
    apps: [],
    applicationStats: null,
    loading: true,
    noData: null,
    asyncItems: [],
    initItems: [],
    timeOut: 0,
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  minutesToHumanReadable(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (0 === hours) {
      return mins + ' ' + L('stats_min');
    }
    if (0 === mins) {
      return hours + ' ' + L('stats_hour');
    }
    return hours + ' ' + L('stats_hour') + ' ' + mins + ' ' + L('stats_min');
  }

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  onShowHidePremiumModal = () => {
    const { isPremiumModalVisible, showPremiumModal } = this.props;

    showPremiumModal(!isPremiumModalVisible);
  };

  RenderItem({ item, maxDuration, titleEdit = false }) {
    const { premiumReallyPaid, premium } = this.props;
    const data = item?.item;
    const itemData = item?.item?.item ? item?.item?.item : item?.item;
    const isFullStats = premiumReallyPaid || premium.overriden;

    if (data?.type === 'title') {
      let diapason = Object.entries(this.state.diapasons).find(([key, value]) => value.id === data.id);
      return (
        <Fragment>
          <View style={[styles.row, styles.row_header]}>
            <Text style={styles.row_header_text}>{data.title}</Text>
            {titleEdit === true ? (
              <TimePickerPopup
                value={diapason[1]}
                onChange={(e) => {
                  let newDiapasons = { ...this.state.diapasons };
                  newDiapasons[diapason[0]] = { ...newDiapasons[diapason[0]], from: e.from, to: e.to };
                  newDiapasons[diapason[0]] = this.updateDiapasonTitle(newDiapasons[diapason[0]]);
                  SyncStorage.set('userDiapasons', newDiapasons);
                  this.setState({ diapasons: { ...newDiapasons } });
                }}
              />
            ) : null}
          </View>
          {data.notYet && (
            <Fragment>
              {!isFullStats && item.index == 0 &&
                <ActivationFrame onShowHidePremiumModal={this.onShowHidePremiumModal} />}
              <View style={[styles.row, styles.early_time]}>
                <Text style={styles.early_time_text}>{L('app_usage_notyet_collected')}</Text>
              </View>
            </Fragment>
          )}
        </Fragment>
      );
    }

    let getIcon = (bundle) => {
      let iconType = 'material-community';
      return { name: 'earth', type: 'material-community' };
    };

    //return null
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View
          style={{
            backgroundColor: 'white',
            marginBottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            elevation: 5,
          }}>
          <View style={{ padding: 10, borderRightWidth: 1, borderRightColor: AppColorScheme.passiveAccent }}>
            {itemData?.image_url && (
              <Image
                style={{ width: 31, height: 31, borderRightWidth: 0 }}
                source={{ uri: `${itemData?.image_url}` }}
              />
            )}
            {!itemData?.image_url && (
              <Icon name={getIcon(itemData?.bundle)?.name} type={getIcon(itemData?.bundle)?.type} />
            )}
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text>{itemData?.name || itemData?.bundle || '-'}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {isFullStats ? (
              <Text style={styles.duration}>{this.minutesToHumanReadable(itemData?.minutes)}</Text>
            ) : (
              <View
                style={{
                  backgroundColor: AppColorScheme.passive,
                }}>
                <Text style={styles.duration}>--:--:--</Text>
              </View>
            )}
          </View>
        </View>
        {!isFullStats && item.index == 1 &&
          <ActivationFrame onShowHidePremiumModal={this.onShowHidePremiumModal} />}
      </View>
    );
  }

  getFormattedList(nodes) {
    let newNodes = [];
    let noData = true;
    if (nodes) {
      let newPeriods = [...nodes.periods];
      let count = 0;
      let appCount = 0;
      newPeriods.forEach((item) => {
        const notYet = item.list.length < 1
        if (!notYet) { noData = false }
        const periodTitle = updateDiapasonTitle({ from: new Date(item.from), to: new Date(item.to) })
        newNodes = [...newNodes, {
          id: 'item_' + count,
          key: count++,
          type: "title",
          title: periodTitle?.title,
          notYet
        }]
        item.list.sort(function (a, b) {
          return b.minutes - a.minutes;
        }).forEach(item => {
          count = count + 1;
          newNodes = [...newNodes, {
            key: count++,
            type: "item",
            item: { ...item, index: appCount++ }
          }]
        })
      })
    }
    return noData ? [] : newNodes;
  }

  async componentDidMount() {
    const { navigation, objects }: any = this.props;
    const oid = navigation.getParam('oid');
    RestAPIService.clarify(oid).catch(err => console.log('Error clarifying object', err));
    const object = objects[oid + ''];
    let itemsToRender = [];

    let stats = JSON.parse(object?.states?.appStats || '{}');
    const userLanguage = object?.props?.language || 'en';

    if (object?.states?.appStats) {
      itemsToRender = this.getFormattedList(stats);
    }

    this.setState({ initItems: itemsToRender });
    const doesHaveImageUrl =
      this.props.childTrackingApps
        .filter((item) => item.type === 'item')
        .filter(function (e) {
          return e?.item?.image_url;
        }).length > 0;

    //Check if there is no child object
    if (!object) {
      this.setState({ showAlert: true });
    }

    const grabData = async (item) => {
      try {
        let data = {};
        await APIService.getAppStats(item.item.bundle, userLanguage)
          .then(item => data = item);

        return {
          item: {
            ...item.item,
            image_url: data.image_url,
            name: item.name ? item.name : data?.app_name,
          },
          key: item.key,
          type: item.type,
        };
      } catch (err) {
        console.log('Error getting app statistics', err);
        return item;
      };
    };

    if (!this.state.applicationStats) {
      this.setState({
        applicationStats: stats,
      });
    }

    //Checking wether we need to fetch data or not
    if (
      itemsToRender?.length !== 0 &&
      itemsToRender?.length === this.props.childTrackingApps?.length &&
      doesHaveImageUrl
    ) {
      //Updating times if arrays are similar
      const updatedMinutes = this.props.childTrackingApps.map((item, index) => {
        if (item.type === 'title') {
          return item;
        } else {
          return {
            item: { ...item?.item, minutes: itemsToRender[index]?.item?.minutes },
            key: item?.key,
            type: item?.type,
          };
        }
      });
      this.setState({
        loading: false,
        applicationStats: stats,
      });
      this.props.setChildTrackingApps([...updatedMinutes]);
    } else {
      //Requesting and collecting promises to resolve at once after fetch complete
      Promise.all(itemsToRender.map((item) => grabData.bind(this)(item))).then((newItems) => {
        return (
          this.setState({
            applicationStats: stats,
            loading: false,
          }),
          this.props.setChildTrackingApps([...newItems])
        );
      });
    }

    this.timeOut = setTimeout(() => {
      if (this.state.loading === true) {
        this.setState({
          loading: false,
          timeOut: 0,
        });
        this.props.setChildTrackingApps(
          this.state.childTrackingApps?.length > 0 ? [...this.state.childTrackingApps] : [...itemsToRender]
        );
      }
    }, 5000);
    StatusBar.setBarStyle('light-content');
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);

  }
  componentWillUnmount() {
    clearTimeout(this.timeOut);
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    NavigationService.back();
    return true;
  };

  render() {
    const { objects, navigation, childTrackingApps } = this.props;
    const oid = navigation.getParam('oid');
    const object = objects[oid + ''];
    let appStats = this.state.applicationStats;
    let maxDuration = 1;
    let noData = childTrackingApps?.length == 0 && this.state.initItems?.length == 0 ? true : false;
    const iosChatObject = Utils.isIosChatObject(object);
    const itemsForRender = childTrackingApps;

    let period = L('ts_unknown');
    let tsUpdate = L('ts_unknown');
    if (appStats) {
      switch (appStats.period) {
        case 'week':
          period = L('stats_week');
          break;
        case 'day':
          period = L('stats_day');
          break;
        case 'month':
          period = L('stats_month');
          break;
      }
      tsUpdate = Utils.makeElapsedDate(new Date(appStats.ts));
    }

    return (
      <View style={styles.container}>
        <Modal animationType="fade" transparent={true} visible={this.state.loading}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <ActivityIndicator size="large" color="#00A944" />
            </View>
          </View>
        </Modal>
        {noData && !this.state.loading ? (
          <View style={{ flex: 1 }}>
            <CustomHeader style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingBottom: 20, paddingTop: Header.HEIGHT + 20 }} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.nodata_text}>{L(iosChatObject ? 'no_stats_for_ios' : 'stats_not_available')}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.list_outer}>
            <CustomHeader style={{ borderBottomLeftRadius: 60, borderBottomRightRadius: 40, paddingTop: Header.HEIGHT + 20 }}>
              <View style={styles.subheader_wrapper}>
                <View style={styles.subheader_wrapper_text_1}>
                  <Text style={styles.info_text}>{!this.state.applicationStats ? '' : period}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.info_text_small}>
                    {!this.state.applicationStats ? '' : L('updated') + ':' + tsUpdate}
                  </Text>
                </View>
              </View>
            </CustomHeader>
            <FlatList
              data={itemsForRender}
              extraData={objects}
              keyExtractor={(item) => item.key.toString()}
              renderItem={(item) => this.RenderItem({ item, maxDuration })}
            />
          </View>
        )}
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        <AlertPane
          visible={this.state.showAlert}
          titleText={L('add_stats_child')}
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

const mapStateToProps = (state) => {
  const { controlReducer, authReducer, popupReducer } = state;
  const {
    objects,
    premiumValid,
    wireValid,
    premiumReallyPaid,
    childTrackingApps,
  } = controlReducer;
  const { premium } = authReducer;
  const { isPremiumModalVisible } = popupReducer;

  return {
    objects,
    premiumValid,
    wireValid,
    premiumReallyPaid,
    premium,
    childTrackingApps,
    isPremiumModalVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setChildTrackingApps: bindActionCreators(controlActionCreators.setChildTrackingApps, dispatch),
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatsPage);

const styles = StyleSheet.create({
  subheader_wrapper: {
    borderTopColor: AppColorScheme.passiveAccent,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    padding: 20,
    marginVertical: 10,
  },
  subheader_wrapper_text_1: {
    alignItems: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: AppColorScheme.passiveAccent,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  nodata: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  nodata_text: {
    textAlign: 'center',
    opacity: 0.5,
    margin: 30,
  },
  list_outer: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  row_header: {
    alignItems: 'flex-start',
    alignContent: 'center',
  },
  row_header_text: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColorScheme.passive,
  },
  appname: {
    fontSize: 20,
  },
  bundle: {
    fontSize: 12,
    color: AppColorScheme.passive,
  },
  progress: {
    width: '100%',
    height: 6,
  },
  progress_fill: {
    width: '50%',
    height: '100%',
  },
  bundle_and_duration: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 12,
    color: AppColorScheme.passive,
  },
  duration_premium: {
    fontSize: 12,
    color: AppColorScheme.passive,
  },
  info: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
  info_text: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  info_text_small: {
    fontSize: 12,
    color: 'white',
  },
  early_time: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  early_time_text: {
    fontSize: 13,
    opacity: 0.4,
  },
});
