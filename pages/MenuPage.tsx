import React, { Component } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { AnyAction, Dispatch, bindActionCreators } from 'redux';
import NavigationService from '../navigation/NavigationService';
import { popupActionCreators } from '../reducers/popupRedux';
import UserPrefs from '../UserPrefs';
import Const from '../Const';
import { getRegionForZoom } from '../Utils';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import NeedPremiumPane from '../components/NeedPremiumPane';
import { NewMenuItem, PremiumModal, PurchaseStateModals } from '../components';
import {
  firebaseAnalitycsForOpenModal,
  firebaseAnalitycsLogEvent,
  mappingRouteAndScreenName,
  menu_screen_name,
} from '../analytics/firebase/firebase';

const { width } = Dimensions.get('window');
const { BLACK_COLOR, ORANGE_COLOR_2 } = NewColorScheme;

interface MenuPageProps {
  activeOid: number;
  premium: {};
  objects: {};
  iapItemsError: boolean;
  isPremiumModalVisible: boolean;
  showPremiumModal: (isPremiumModalVisible: boolean) => void;
  showSuccessfulSubscriptionModal: (isSuccessfulSubscriptionModalVisible: boolean) => void;
  showAlert: (
    isVisible: boolean,
    title: string,
    subtitle: string,
    isSupportVisible?: boolean,
    supportText?: string,
    actionTitle?: string,
    actions?: []
  ) => void;
  premiumReallyPaid: boolean;
}

interface MenuPageState {
  isNeedPremiumVisible: boolean;
  country: string;
}

class MenuPage extends Component<MenuPageProps, MenuPageState> {
  state = {
    isNeedPremiumVisible: false,
    country: '',
  };

  region = null;
  zoom = null;

  componentDidMount() {
    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });
  }

  UNSAFE_componentWillMount() {
    const { all } = UserPrefs;

    this.zoom = all.zoom;

    if (!this.zoom) {
      this.zoom = Const.DEFAULT_ZOOM;
    }

    this.region = all.mapRegion;

    if (!this.region) {
      this.region = getRegionForZoom(Const.DEFAULT_LAT, Const.DEFAULT_LON, Const.DEFAULT_ZOOM);
    }
  }

  renderMenuItem = (item: {}) => {
    const { title, iconSrc, iconStyle, onPress } = item.item;

    return <NewMenuItem title={title} iconSrc={iconSrc} iconStyle={iconStyle} onPress={onPress} />;
  };

  keyExtractor = (_: any, index: number): string => `${index}`;

  onShowHidePremiumModal = () => {
    const { iapItemsError, isPremiumModalVisible, showPremiumModal, showAlert } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      showPremiumModal(!isPremiumModalVisible);
    }
  };

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  firebaseOpenMenuItemAnalytics = (menuItemName: string) => {
    firebaseAnalitycsLogEvent(
      'menu_icon',
      {
        function: mappingRouteAndScreenName[menuItemName] as menu_screen_name,
      },
      true
    );
  };
  render() {
    const { activeOid, premium, premiumReallyPaid, objects, isPremiumModalVisible } = this.props;
    const locked = !premiumReallyPaid && !premium.overriden;
    const { isNeedPremiumVisible } = this.state;
    const { title, container } = styles;

    const MENU_ITEMS = [
      {
        title: L('menu_sound_around'),
        iconSrc: require('../img/menu_sound_around.png'),
        iconStyle: { width: 69, height: 67 },
        onPress: () => {
          this.firebaseOpenMenuItemAnalytics('Wiretapping');
          NavigationService.navigate('Wiretapping', { oid: activeOid });
        },
      },
      {
        title: L('online_voice'),
        iconSrc: require('../img/menu_online_sound_around.png'),
        iconStyle: { width: 65, height: 64 },
        onPress: () => {
          this.firebaseOpenMenuItemAnalytics('OnlineSoundInitial');
          NavigationService.navigate('OnlineSoundInitial', { oid: activeOid });
        },
      },
      {
        title: L('chats_control'),
        iconSrc: require('../img/menu_chats_control.png'),
        iconStyle: { width: 51, height: 51 },
        onPress: () => {
          this.firebaseOpenMenuItemAnalytics('ChildChats');
          NavigationService.navigate('ChildChats');
        },
      },
      {
        title: L('mesta'),
        iconSrc: require('../img/menu_places_on_map.png'),
        iconStyle: { width: 56, height: 57 },
        onPress: () => {
          this.firebaseOpenMenuItemAnalytics('Places');
          NavigationService.navigate('Places', { oid: activeOid, region: this.region, zoom: this.zoom });
        },
      },
      {
        title: L('menu_movement_history'),
        iconSrc: require('../img/menu_movement_history.png'),
        iconStyle: { width: 51, height: 41 },
        onPress: () => {
          if (locked) {
            firebaseAnalitycsForOpenModal('premiumNeededForFunction', false, {
              function: 'historyMove',
            });
            this.setState({ isNeedPremiumVisible: true });
            return;
          }

          let object = objects[activeOid + ''];

          if (!object) {
            object = { photoUrl: null };
          }
          this.firebaseOpenMenuItemAnalytics('TrackHistory');
          NavigationService.navigate('TrackHistory', { oid: activeOid, photoUrl: object.photoUrl });
        },
      },
      {
        title: L('menu_stats'),
        iconSrc: require('../img/menu_app_statistics.png'),
        iconStyle: { width: 45, height: 50 },
        onPress: () => {
          if (locked) {
            firebaseAnalitycsForOpenModal('premiumNeededForFunction', false, {
              function: 'appsStats',
            });
            this.setState({ isNeedPremiumVisible: true });
            return;
          }

          this.firebaseOpenMenuItemAnalytics('Stats');
          NavigationService.navigate('Stats', { oid: activeOid });
        },
      },
      {
        title: L('menu_achievments'),
        iconSrc: require('../img/menu_achievements.png'),
        iconStyle: { width: 41.5, height: 42 },
        onPress: async () => {
          if (!UserPrefs.all.achievementFeaturesShown) {
            const isAchShown = await UserPrefs.isAchievementFeaturesShown();

            if (!isAchShown) {
              this.firebaseOpenMenuItemAnalytics('AchievementFeatures');
              NavigationService.navigate('AchievementFeatures');
              return;
            }
          }
          this.firebaseOpenMenuItemAnalytics('ChildAchievements');
          NavigationService.navigate('ChildAchievements');
        },
      },
      {
        title: L('loud_signal'),
        iconSrc: require('../img/menu_loud_signal.png'),
        iconStyle: { width: 35, height: 41 },
        onPress: () => {
          if (locked) {
            firebaseAnalitycsForOpenModal('premiumNeededForFunction', false, {
              function: 'loudSignal',
            });
            this.setState({ isNeedPremiumVisible: true });
            return;
          }

          this.firebaseOpenMenuItemAnalytics('Buzzer');
          NavigationService.navigate('Buzzer', { oid: activeOid });
        },
      },
    ];

    return (
      <SafeAreaView style={container}>
        <Text style={title}>{L('menu')}</Text>
        <FlatList
          data={MENU_ITEMS}
          renderItem={this.renderMenuItem}
          keyExtractor={this.keyExtractor}
          numColumns={3}
          columnWrapperStyle={{ marginTop: width / 10 }}
        />
        <NeedPremiumPane
          visible={isNeedPremiumVisible}
          onPressSubscribe={() => this.setState({ isNeedPremiumVisible: false })}
          onPressCancel={() => this.setState({ isNeedPremiumVisible: false })}
          showHidePremiumModal={this.onShowHidePremiumModal}
        />
        {isPremiumModalVisible && (
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={(productId: any) =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'Main' })
            }
            onPayWithIFree={(productId: any, kind: any) =>
              NavigationService.navigate('PaymentMethod', {
                productId,
                kind,
                backTo: 'Main',
                onHide: () => this.onShowHidePremiumModal,
                isSubscription: true,
              })
            }
            onSuccess={this.onShowSuccessfulSubscriptionModal}
          />
        )}
        <PurchaseStateModals />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: width / 14,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    marginTop: 34,
    marginLeft: 21,
  },
  container: {
    flex: 1,
    backgroundColor: ORANGE_COLOR_2,
  },
});

const mapStateToProps = (state: { controlReducer: any; authReducer: any; popupReducer: any; }) => {
  const { controlReducer, authReducer, popupReducer } = state;
  const { activeOid, objects, iapItemsError, premiumReallyPaid } = controlReducer;
  const { premium } = authReducer;
  const { isPremiumModalVisible } = popupReducer;

  return {
    activeOid,
    objects,
    premium,
    iapItemsError,
    isPremiumModalVisible,
    premiumReallyPaid,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);
