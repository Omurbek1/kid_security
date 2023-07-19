import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  Animated,
  Easing,
  ImageBackground,
  Modal,
  StatusBar,
  Platform,
  TouchableOpacity,
  Linking,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Constants from 'expo-constants';
import _ from 'lodash';
import NavigationService from '../navigation/NavigationService';
import { popupActionCreators } from '../reducers/popupRedux';
import { getHeader } from '../shared/getHeader';
import { ChatItem, ActivatePremiumView, MessengerItem, PremiumModal, PurchaseStateModals } from '../components';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import { APIService } from '../Api';
import { tsToDateConverter } from '../Utils';
import UserPrefs from '../UserPrefs';
import MyActivityIndicator from '../components/MyActivityIndicator';
import Const from '../Const';

const { PINK_COLOR_1, ORANGE_COLOR_1, ORANGE_COLOR_2_RGB, BLACK_COLOR, RED_COLOR } = NewColorScheme;

interface ChildChatsPageProps {
  premiumReallyPaid: boolean;
  premium: {};
  objects: {};
  activeOid: number;
  userId: number;
  showSuccessfulSubscriptionModal: (isSuccessfulSubscriptionModalVisible: boolean) => void;
  iapItemsError: boolean;
  isPremiumModalVisible: boolean;
  showPremiumModal: (isPremiumModalVisible: boolean) => void;
  showAlert: (
    isVisible: boolean,
    title: string,
    subtitle: string,
    isSupportVisible?: boolean,
    supportText?: string,
    actionTitle?: string,
    actions?: [],
  ) => void;
};

interface ChildChatsPageState {
  activeMessengerId: number;
  opacity: Animated.Value;
  childMessengerList: [];
  gradientColors: string[];
  messengerChatList: [];
  messengerId: number;
  isProgressBarVisible: boolean;
  isRefreshing: boolean;
  isPremiumViewVisible: boolean;
  isErrorGettingChats: boolean;
  isPremiumModalVisible: boolean;
  country: string;
}

const MESSENGER_LIST = [
  {
    name: 'whatsapp',
    image: require('../img/messengers/whatsapp.png'),
  },
  {
    name: 'viber',
    image: require('../img/messengers/viber.png'),
  },
  {
    name: 'vkontakte',
    image: require('../img/messengers/vk.png'),
  },
  {
    name: 'instagram',
    image: require('../img/messengers/instagram.png'),
  },
  {
    name: 'telegram',
    image: require('../img/messengers/telegram.png'),
  },
];

class ChildChatsPage extends React.Component<ChildChatsPageProps, ChildChatsPageState> {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('control_chats'), isOldHeader: false }),
      headerRight: null,
    };
  };

  state = {
    activeMessengerId: 0,
    opacity: new Animated.Value(1),
    childMessengerList: MESSENGER_LIST,
    gradientColors: [PINK_COLOR_1, ORANGE_COLOR_1],
    messengerChatList: null,
    messengerId: 0,
    isProgressBarVisible: false,
    isRefreshing: false,
    isPremiumViewVisible: false,
    isErrorGettingChats: false,
    country: '',
  };

  componentDidMount() {
    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });

    this.getChildChats();
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

  getChildChats = () => {
    this.setState({ isProgressBarVisible: true, isErrorGettingChats: false });

    const { activeOid } = this.props;

    APIService.getMessengersList(activeOid)
      .then((res) => {
        const { messengerList } = res;
        const { childMessengerList } = this.state;

        let j = 0;
        let list = [...childMessengerList];

        for (let i in messengerList) {
          j = 0;

          while (j < childMessengerList.length) {
            if (messengerList[i].bundleId.includes(childMessengerList[j].name)) {
              list[j] = { ...list[j], ...messengerList[i] };
            }

            j++;
          }
        }

        this.setState({ childMessengerList: list });
        this.getMessengerChats();
      })
      .catch((err) => {
        console.log("Error getting child's chat list", err);
        this.setState({ isProgressBarVisible: false, isErrorGettingChats: true });
      });
  };

  getMessengerChats = (messengerId: number = 0) => {
    this.setState({ isRefreshing: true });

    const { activeOid } = this.props;
    const { childMessengerList } = this.state;

    APIService.getMessengerChats(activeOid, childMessengerList[messengerId].id)
      .then((res) => {
        const { roomList } = res;

        let messengerChatList = roomList.filter((item) => item.lastMessage !== undefined);
        messengerChatList = _.sortBy(messengerChatList, 'lastMessage.ts').reverse();

        this.setState({
          messengerChatList,
          isProgressBarVisible: false,
          isRefreshing: false,
        });
      })
      .catch((err) => {
        console.log('Error getting chat with users', err);
        this.setState({
          isProgressBarVisible: false,
          isRefreshing: false,
          messengerChatList: null,
        });
      });
  };

  keyExtractor = (_, index: number): string => `${index}`;

  setActiveMessenger = (activeMessengerId: number) => {
    this.setState({ isPremiumViewVisible: false });

    const { opacity } = this.state;

    this.setState({ activeMessengerId });
    this.getMessengerChats(activeMessengerId);

    opacity.setValue(0);

    Animated.timing(opacity, {
      delay: 50,
      duration: 100,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  onShowChat = (item: {}) => {
    const { name, id } = item;

    NavigationService.navigate('MessengerChat', { name, id, withImage: false });
  };

  onActivate = () => {
    this.setState({ gradientColors: ['#DC5673', '#F0885F'] });
    this.onShowHidePremiumModal();
    setTimeout(() => this.setState({ gradientColors: [PINK_COLOR_1, ORANGE_COLOR_1] }), 500);
  };

  renderChatItem = (item: {}) => {
    const { index } = item;
    const {
      name,
      lastMessage: { text, ts },
    } = item.item;
    const { premiumReallyPaid, premium } = this.props;
    const isFeatureAvailable = premiumReallyPaid || premium.overriden;
    const blurred = index === 0 ? false : isFeatureAvailable ? false : true;
    const time = tsToDateConverter(ts, false);
    const { isPremiumViewVisible } = this.state;

    return (
      <ChatItem
        name={name}
        message={text}
        time={time}
        blurred={blurred}
        onChatPress={() => this.onShowChat(item.item)}
        viewStyle={{
          marginBottom: !isFeatureAvailable && index === 0 && isPremiumViewVisible ? 160 : 10,
        }}
      />
    );
  };

  setIsPremiumViewVisible = () => {
    this.setState({ isPremiumViewVisible: true });
  };

  onSupportPress = () => {
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
      .catch((err) => console.warn('An error occurred', err));
  };

  onShowHidePremiumModal = () => {
    const {
      iapItemsError,
      isPremiumModalVisible,
      showPremiumModal,
      showAlert,
    } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      showPremiumModal(!isPremiumModalVisible);
    };
  };

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  render() {
    const { premiumReallyPaid, premium, objects, activeOid, isPremiumModalVisible } = this.props;
    const {
      activeMessengerId,
      opacity,
      childMessengerList,
      gradientColors,
      messengerChatList,
      isProgressBarVisible,
      isRefreshing,
      isErrorGettingChats,
    } = this.state;
    const {
      container,
      chatsContainer,
      messengerSmall,
      chatsText,
      childName,
      imageWrapper,
      image,
      mainContainer,
      messengersContainer,
      activeMessengerWrapper,
      photoBackground,
      modalContainer,
      activityIndicatorWrapper,
      noMessagesText,
      errorWrapper,
      noDataText,
      writeUsText,
      chatSupportText,
    } = styles;
    const isFeatureAvailable = premiumReallyPaid || premium.overriden;
    const paddingTop = 56 + Constants.statusBarHeight;

    let imageSource = null;
    let name = '';

    for (let i in objects) {
      if (activeOid === objects[i].oid) {
        imageSource = objects[i].photoUrl;
        name = objects[i].name;
        break;
      }
    }

    return (
      <View style={[container, { paddingTop }]}>
        {Platform.OS !== 'ios' && <StatusBar backgroundColor={isProgressBarVisible ? 'rgba(0,0,0,0.5)' : null} />}
        <View style={imageWrapper}>
          <ImageBackground
            source={imageSource ? require('../img/child_photo_background.png') : null}
            style={photoBackground}>
            <Image
              source={imageSource ? { uri: imageSource } : require('../img/child_photo_placeholder.png')}
              style={image}
            />
          </ImageBackground>
          <Text style={childName}>{name}</Text>
        </View>
        <View style={mainContainer}>
          {childMessengerList !== null && childMessengerList.length > 0 && (
            <FlatList
              data={childMessengerList}
              renderItem={(item) => {
                const { image } = item.item;

                const imgSource = activeMessengerId === item.index ? require('../img/messenger_wrap.png') : null;

                return (
                  <MessengerItem
                    imgSource={imgSource}
                    onPress={() => this.setActiveMessenger(item.index)}
                    logo={image}
                  />
                );
              }}
              keyExtractor={this.keyExtractor}
              contentContainerStyle={messengersContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
          <View style={chatsContainer}>
            <Animated.View style={{ flex: 1, opacity }}>
              {childMessengerList !== null && childMessengerList.length > 0 && (
                <View style={activeMessengerWrapper}>
                  <Image source={childMessengerList[activeMessengerId].image} style={messengerSmall} />
                  <Text style={chatsText}>{L('chats')}</Text>
                </View>
              )}
              {messengerChatList ? (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={messengerChatList}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderChatItem}
                    scrollEnabled={isFeatureAvailable}
                    showsVerticalScrollIndicator={false}
                    onRefresh={() => this.getMessengerChats(activeMessengerId)}
                    refreshing={isRefreshing}
                  />
                  <ActivatePremiumView
                    isFeatureAvailable={isFeatureAvailable}
                    gradientColors={gradientColors}
                    onActivate={this.onActivate}
                    setIsPremiumViewVisible={this.setIsPremiumViewVisible}
                  />
                </View>
              ) : (
                <View style={errorWrapper}>
                  {isErrorGettingChats ? (
                    <View>
                      <Text style={noDataText}>{L('dont_downl_chats')}</Text>
                      <TouchableOpacity onPress={this.onSupportPress} style={{ marginTop: 24 }}>
                        <Text style={chatSupportText}>{L('menu_chat_support')}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={noMessagesText}>{L('app_dont_sms')}</Text>
                  )}
                </View>
              )}
            </Animated.View>
          </View>
          <Modal visible={isProgressBarVisible} transparent={true}>
            <View style={modalContainer}>
              <View style={activityIndicatorWrapper}>
                <MyActivityIndicator size="large" />
              </View>
            </View>
          </Modal>
        </View>
        {isPremiumModalVisible && (
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={(productId) =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'ChildChats' })
            }
            onPayWithIFree={(productId: string, kind: string) =>
              NavigationService.navigate('PaymentMethod', {
                productId,
                kind,
                backTo: 'ChildChats',
                onHide: () => this.onShowHidePremiumModal,
                isSubscription: true,
              })
            }
            onSuccess={this.onShowSuccessfulSubscriptionModal}
          />
        )}
        <PurchaseStateModals />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 22,
  },
  chatsContainer: {
    height: '100%',
    width: '81.3%',
    alignSelf: 'flex-end',
    backgroundColor: ORANGE_COLOR_2_RGB,
    borderTopLeftRadius: 12,
    paddingLeft: 17,
    paddingRight: 24,
    paddingTop: 15,
  },
  messengerSmall: {
    width: 27,
    height: 27,
  },
  chatsText: {
    fontSize: 16,
    fontWeight: '500',
    color: BLACK_COLOR,
    marginLeft: 7,
  },
  childName: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 13,
  },
  imageWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
    marginLeft: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  mainContainer: {
    flex: 9,
    flexDirection: 'row',
    marginTop: 12,
  },
  messengersContainer: {
    marginTop: 28,
  },
  activeMessengerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  photoBackground: {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorWrapper: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 14,
    fontWeight: '400',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '400',
    color: RED_COLOR,
    textAlign: 'center',
  },
  errorWrapper: {
    marginTop: 80,
    marginHorizontal: 30,
  },
  writeUsText: {
    fontSize: 14,
    fontWeight: '400',
    color: BLACK_COLOR,
    marginTop: 140,
    textAlign: 'center',
  },
  chatSupportText: {
    fontSize: 14,
    fontWeight: '400',
    color: ORANGE_COLOR_1,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

const mapStateToProps = (state) => {
  const { controlReducer, authReducer, popupReducer } = state;
  const { premiumReallyPaid, activeOid, objects, iapItemsError } = controlReducer;
  const { premium, userId } = authReducer;
  const { isPremiumModalVisible } = popupReducer;

  return {
    premiumReallyPaid,
    premium,
    userId,
    activeOid,
    objects,
    iapItemsError,
    isPremiumModalVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChildChatsPage);
