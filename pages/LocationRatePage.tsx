import React from 'react';
import { Text, StyleSheet, View, SafeAreaView } from 'react-native';
import { Slider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import NavigationService from '../navigation/NavigationService';
import * as Metrica from '../analytics/Analytics';
import { L } from '../lang/Lang';
import CustomHeader from '../components/molecules/CustomHeader';
import { AppColorScheme } from '../shared/colorScheme';
import KsButton from '../components/atom/KsButton';
import { getHeader } from '../shared/getHeader';
import KsAlign from '../components/atom/KsAlign/index';
import AlertPane from '../components/AlertPane';

class LocationRatePage extends React.Component {
  state = {
    checkinPeriod: 1,
    isProgress: false,
    progressTitle: null,
    oid: null,
    showAlert: false,
  };

  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('location_rate'), noBackground: true }),
    };
  };

  componentWillUnmount = () => { };

  componentWillMount = () => {
    const { navigation, objects } = this.props;

    let activeObject = {
      props: {
        checkinPeriod: '60',
      },
    };

    const oid = navigation.getParam('oid');
    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    let { checkinPeriod } = activeObject.props;

    if (checkinPeriod) {
      try {
        checkinPeriod = Math.floor(parseInt(checkinPeriod) / 60);
      } catch (e) {
        checkinPeriod = 1;
      }
    } else {
      checkinPeriod = 1;
    }

    this.setState({ oid, checkinPeriod });
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onPeriodChanged(checkinPeriod) {
    this.setState({ checkinPeriod });
  }

  onSave() {
    const { setObjectCheckinPeriod, objects, showAlert } = this.props;
    const { oid } = this.state;

    var obj = objects[oid + ''];

    if (!obj) {
      this.setState({ showAlert: true });
      return;
    }

    this.openProgressbar(L('saving_settings'));
    const hideProgressbar = this.hideProgressbar;
    const seconds = this.state.checkinPeriod * 60;
    const enableEcoMode = true;
    setObjectCheckinPeriod({ oid, seconds, enableEcoMode }, (pr, packet) => {
      hideProgressbar();
      const { data } = packet;
      if (data.result === 0) {
        NavigationService.back();
      } else {
        showAlert(true, L('error'), L('failed_to_save_settings', [data.error]));
      }
    });

    Metrica.event('set_refresh_rate', { seconds: seconds });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <CustomHeader style={{ paddingBottom: 15, borderBottomLeftRadius: 100, borderBottomRightRadius: 40 }}>
          <KsAlign elementsGap={10} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <View style={{ flex: 2 }}>
                <Icon name="gesture-tap" type="material-community" color="white" size={50} />
              </View>
              <View style={{ flex: 5 }}>
                <Text style={{ width: '100%', fontSize: 14, color: 'white', fontWeight: '600' }}>
                  {L('pick_location_rate')}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: 1,
                width: wp('80%'),
                marginVertical: 10,
                backgroundColor: AppColorScheme.passiveAccent,
                alignSelf: 'flex-end',
                position: 'relative',
                left: 30,
              }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30 }}>
              <View style={{ flex: 2 }}>
                <Icon name="alert-circle-outline" type="material-community" color="white" size={32} />
              </View>
              <View style={{ flex: 5 }}>
                <Text style={{ width: '100%', fontSize: 14, color: 'white', fontWeight: '600' }}>
                  {L('location_rate_battery_warning')}
                </Text>
              </View>
            </View>
          </KsAlign>
        </CustomHeader>
        <View style={{ backgroundColor: '#fafafa' }}>
          <View
            style={[
              {
                borderBottomColor: AppColorScheme.passiveAccent,
                borderBottomWidth: 1,
                backgroundColor: 'white',
              },
            ]}>
            <View style={{ borderBottomColor: AppColorScheme.passiveAccent, borderBottomWidth: 1, padding: 20 }}>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={60}
                  value={this.state.checkinPeriod}
                  step={1}
                  thumbTintColor={AppColorScheme.accent}
                  maximumTrackTintColor={AppColorScheme.active}
                  minimumTrackTintColor={AppColorScheme.active}
                  trackStyle={styles.track}
                  thumbStyle={{ height: 25, width: 25, borderRadius: 60 }}
                  onValueChange={this.onPeriodChanged.bind(this)}
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.textPeriod}>{this.state.checkinPeriod + ' ' + L('stats_min')}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 14, color: '#000' }}>{L('hint')}</Text>
              <View>
                <Text style={{ fontSize: 12, color: AppColorScheme.passive }}>{L('location_rate_hint_1')}</Text>
                <Text style={{ fontSize: 12, color: AppColorScheme.passive }}>{L('location_rate_hint_2')}</Text>
              </View>
            </View>
          </View>
          <SafeAreaView style={{ paddingVertical: 10, backgroundColor: '#fafafa' }}>
            <KsButton
              loading={this.state.isProgress}
              onPress={this.onSave.bind(this)}
              title={L('apply')}
              style={{ padding: 15, marginHorizontal: 20, marginVertical: 5 }}
              titleStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}
            />
          </SafeAreaView>
        </View>
        <AlertPane
          visible={this.state.showAlert}
          titleText={L('add_photo_name')}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
        />
        
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;
  return {
    objects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setObjectCheckinPeriod: bindActionCreators(controlActionCreators.setObjectCheckinPeriod, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationRatePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
  },
  text: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  bigText: {
    paddingTop: 0,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 10,
  },
  logo: {
    maxWidth: 120,
    maxHeight: 120,
  },
  slider: {},
  track: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    padding: 3,
    borderColor: AppColorScheme.active,
    borderRadius: 50,
  },
  sliderContainer: {
    width: '100%',
  },
  trackGradient: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 4,
    top: '50%',
    marginTop: -2,
  },
  textPeriod: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    borderBottomColor: AppColorScheme.passive,
    borderBottomWidth: 1,
    fontWeight: 'bold',
  },
  textHintHdr: {
    marginTop: 40,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.5)',
  },
  textSmall: {
    fontSize: 12,
    textAlign: 'justify',
    color: 'rgba(0,0,0,0.5)',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
});
