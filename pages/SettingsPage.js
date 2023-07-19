import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Image,
  ImageBackground,
  StatusBar,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { ActionCreators as controlMiddlewareActionCreators } from '../wire/ControlMiddleware';
import { authActionCreators } from '../reducers/authRedux';
import NavigationService from '../navigation/NavigationService';
import { underConstruction, CustomProgressBar, shareApp } from '../Utils';
import { L } from '../lang/Lang';
import KsListItem from '../components/atom/KsListItem';
import { getHeader } from '../shared/getHeader';
import CustomHeader from '../components/molecules/CustomHeader';
import { AppColorScheme } from '../shared/colorScheme';
import KsButton from '../components/atom/KsButton';
import UserPrefs from '../UserPrefs';
import { popupActionCreators } from '../reducers/popupRedux';
import { HeaderBackButton } from 'react-navigation';
import { PremiumModal } from '../components';
import Const from '../Const';


class SettingsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...getHeader({ title: L('menu_settings'), noBackground: true }),
      headerLeft: <HeaderBackButton tintColor="white" onPress={() => NavigationService.back()} />,
    };
  };
  state = {
    isProgress: false,
    progressTitle: null,
    country: '',
  };

  componentDidMount() {
    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });
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

  onLanguage() {
    underConstruction();
  }

  performDelete() {
    const {
      navigation,
      deleteObject,
      removeObjectFromList,
      objects,
      showAlert,
    } = this.props;
    let objectCount = Object.keys(objects).length;
    const oid = navigation.getParam('oid');
    const setActiveOidAndCenter = navigation.getParam('setActiveOidAndCenter');

    console.log('perform deletion oid: ' + oid);
    this.openProgressbar(L('deleting_device'));
    const hideProgressbar = this.hideProgressbar;
    deleteObject(oid, (pr, packet) => {
      const { data } = packet;

      if (0 === data.result) {
        removeObjectFromList(oid);
        showAlert(false, '', '');

        if (objectCount > 1) {
          for (let i in objects) {
            if (i !== oid) {
              setActiveOidAndCenter(i);
              hideProgressbar();
              return NavigationService.forceReplace('Main');
            }
          }
        } else {
          hideProgressbar();
          return NavigationService.forceReplace('Main', { isAfterDeletion: true });
        }
      }

      hideProgressbar();
      showAlert(true, L('error'), L('failed_to_delete_device', [data.error]));
    });
  }

  onDelete() {
    const { objects, navigation, showAlert } = this.props;
    const oid = navigation.getParam('oid');
    const object = objects[oid + ''];
    if (!object) {
      return;
    }

    showAlert(
      true,
      L('disconnecting'),
      L('delete_device_confirmation', [object.name]),
      false,
      '',
      L('disconnect'),
      [this.performDelete.bind(this)],
    );
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onShare = () => {
    shareApp();
  };
  onAddPhone = () => {
    const { navigation } = this.props;
    const setActiveOidAndCenter = navigation.getParam('setActiveOidAndCenter');
    NavigationService.navigate('AddPhone', {
      backTo: 'Main',
      setActiveOidAndCenter,
      forceReplace: true,
      disableBackButton: true,
    });
  };

  onAbout() {
    NavigationService.navigate('About');
  }

  async onPremiumAccount() {
    const { iapItemsError, showAlert } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      if (!UserPrefs.all.premiumFeaturesShown) {
        const isPremShowed = await UserPrefs.isPremiumFeaturesShown();

        if (!isPremShowed) {
          NavigationService.navigate('PremiumFeatures', { backTo: 'Settings' });
          return;
        }

        NavigationService.navigate('PremiumFeatures', { backTo: 'Settings' });
        return;
      }

      this.onShowHidePremiumModal();
    }
  }

  onShowHidePremiumModal = () => {
    const { isPremiumModalVisible, showPremiumModal } = this.props;

    showPremiumModal(!isPremiumModalVisible);
  };

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  onChatWithTechSupport = async () => {
    const { objects, userId } = this.props;

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
      .catch((err) => console.warn('Error opening chat with tech support', err));
  };

  render() {
    const {
      navigation,
      setUserProperty,
      modifyUserProperty,
      userProps,
      togglePinCodeDialog,
      togglePinCodeHintDialog,
      objects,
      isYooKassaSubscriptionExists,
      isPremiumModalVisible,
    } = this.props;
    const { country } = this.state;
    const oid = navigation.getParam('oid');
    const { placeEventsDisabled } = userProps;
    const phoneModel = objects[oid]?.states?.deviceModel?.split(' ')[0];
    const placeEventsSwitch =
      null === placeEventsDisabled || undefined === placeEventsDisabled ? true : '0' === placeEventsDisabled;
    /*those items interacts with oid to prevent any errors in runtime we shoul conditionaly render them
      only if we have valid oid
    */
    let parentPinCode = objects?.[oid]?.states?.parentPinCode || undefined;
    const oidRequiredItems = (
      <React.Fragment>
        <KsListItem
          index={2}
          containerStyle={styles.itemContainer}
          title={L('menu_setup_name_and_photo')}
          onPress={() =>
            NavigationService.navigate('ObjectName', { oid: navigation.getParam('oid'), backTo: 'Settings' })
          }
        />
        <KsListItem
          index={3}
          containerStyle={styles.itemContainer}
          title={L('menu_location_rate')}
          onPress={() => NavigationService.navigate('LocationRate', { oid: oid })}
        />
      </React.Fragment>
    );

    return (
      <View style={{ flex: 1 }}>
        <CustomHeader
          style={{ paddingBottom: 40, borderBottomLeftRadius: 100, borderBottomRightRadius: 40 }}
          backgroundColor="white">
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground
              resizeMode={'contain'}
              style={{ width: 150, height: 150, justifyContent: 'flex-end', alignItems: 'center' }}
              source={require('../img/ic_settings_gear.png')}>
              <View style={{ position: 'relative', top: 40, alignItems: 'center' }}>
                <Image
                  source={require('../img/setting_header_child.png')}
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
        <ScrollView style={{ backgroundColor: 'white' }}>
          <KsListItem
            index={1}
            containerStyle={[styles.itemContainer, { paddingTop: 20 }]}
            title={L('menu_add_child')}
            onPress={this.onAddPhone.bind(this)}
          />
          {oid ? oidRequiredItems : null}
          <KsListItem
            inactive
            index={4}
            containerStyle={styles.itemContainer}
            title={L('notify_places_events')}
            withSwitch
            switchOptions={{
              value: placeEventsSwitch,
              onSwitch: (value) => {
                const val = value ? '0' : '1';
                modifyUserProperty('placeEventsDisabled', val);
                setUserProperty('placeEventsDisabled', val, (pr, d) => {
                  const data = d.data;
                  if (0 === data.result) {
                    modifyUserProperty('placeEventsDisabled', val);
                  }
                });
              },
            }}
            withSeparator={false}
          />
          <KsListItem
            index={5}
            containerStyle={[styles.itemContainer, { backgroundColor: '#FFE600' }]}
            title={L('menu_premium')}
            onPress={this.onPremiumAccount.bind(this)}
            withSeparator={false}
          />
          {country === 'Russia' && isYooKassaSubscriptionExists && (
            <KsListItem
              containerStyle={styles.itemContainer}
              title={L('upravlenie')}
              onPress={() => Linking.openURL('https://yoo.kidsecurity.ru')}
              showArrow={false}
            />
          )}
          <KsListItem
            index={6}
            containerStyle={styles.itemContainer}
            title={L('menu_about')}
            onPress={this.onAbout.bind(this)}
          />
          <KsListItem
            index={7}
            containerStyle={styles.itemContainer}
            title={L('menu_language')}
            onPress={() => NavigationService.navigate('Language')}
          />
          {phoneModel !== 'Apple' && (
            <KsListItem
              icon={{ name: 'account-multiple', color: AppColorScheme.accent }}
              containerStyle={styles.itemContainer}
              titleStyle={{ color: AppColorScheme.icon }}
              title={parentPinCode ? L('see_pin') : L('pin_setur')}
              onPress={() => {
                if (parentPinCode) {
                  togglePinCodeDialog();
                } else {
                  togglePinCodeHintDialog();
                }
              }}
            //onPress={() => togglePinCodeHintDialog()}
            />
          )}
          <KsListItem
            containerStyle={styles.itemContainer}
            title={L('menu_chat_support')}
            onPress={this.onChatWithTechSupport} />
          <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
            <KsButton
              title={L('menu_delete_device')}
              style={{ padding: 20 }}
              titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
              onPress={this.onDelete.bind(this)}
            />
          </View>
          <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={(productId) =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'Settings' })
            }
            onPayWithIFree={(productId, kind) =>
              NavigationService.navigate('PaymentMethod', {
                productId,
                kind,
                backTo: 'Settings',
                onHide: () => this.onShowHidePremiumModal,
                isSubscription: true,
              })
            }
            onSuccess={this.onShowSuccessfulSubscriptionModal}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects, iapItemsError, isYooKassaSubscriptionExists } = state.controlReducer;
  const { userProps, userId } = state.authReducer;
  const { isPremiumModalVisible } = state.popupReducer;

  return {
    objects,
    userProps,
    iapItemsError,
    isYooKassaSubscriptionExists,
    userId,
    isPremiumModalVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteObject: bindActionCreators(controlActionCreators.deleteObject, dispatch),
    removeObjectFromList: bindActionCreators(controlActionCreators.removeObjectFromList, dispatch),
    setUserProperty: bindActionCreators(controlMiddlewareActionCreators.setUserProperty, dispatch),
    modifyUserProperty: bindActionCreators(authActionCreators.modifyUserProperty, dispatch),
    togglePinCodeDialog: bindActionCreators(popupActionCreators.togglePinCodeDialog, dispatch),
    togglePinCodeHintDialog: bindActionCreators(popupActionCreators.togglePinCodeHintDialog, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  image_outer: {
    margin: 20,
    borderRadius: 75,
    width: 150,
    height: 150,
    backgroundColor: '#ffffff2f',
  },
  listContainer: {
    marginTop: 0,
  },
  buttonDelete: {
    marginTop: 15,
    marginBottom: 25,
    backgroundColor: 'white',
    borderColor: 'red',
  },
  itemContainer: {
    backgroundColor: 'white',
  },
});
