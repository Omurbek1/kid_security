import { createStackNavigator } from 'react-navigation';
import { Easing } from 'react-native';
import MapPage from '../pages/MapPage';
import AuthPage from '../pages/AuthPage';
import SettingsPage from '../pages/SettingsPage';
import AddPhonePage from '../pages/AddPhonePage';
import ObjectNamePage from '../pages/ObjectNamePage';
import AboutPage from '../pages/AboutPage';
import RecoverPage from '../pages/RecoverPage';
import RegisterPage from '../pages/RegisterPage';
import LocationRatePage from '../pages/LocationRatePage';
import BuzzerPage from '../pages/BuzzerPage';
import DummyPage from '../pages/DummyPage';
import TrackHistoryPage from '../pages/TrackHistoryPage';
import EventsPage from '../pages/EventsPage';
import PlacesPage from '../pages/PlacesPage';
import PremiumFeaturesPage from '../pages/PremiumFeaturesPage';
import BuyPremiumPage from '../pages/BuyPremiumPage';
import TryPremiumPage from '../pages/TryPremium';
import ChatPage from '../pages/ChatPage';
import StatsPage from '../pages/StatsPage';
import ParentsPage from '../pages/ParentsPage';
import AddParentPage from '../pages/AddParentPage';
import DeleteParentPage from '../pages/DeleteParentPage';
import WiretappingPage from '../pages/WiretappingPage';
import SetupBalancePage from '../pages/SetupBalancePage';
import SupportChatPage from '../pages/SupportChatPage';
import SupportAgentChatListPage from '../pages/SupportAgentChatListPage';
import SupportAgentChatPage from '../pages/SupportAgentChatPage';
import LanguagePage from '../pages/LanguagePage';
import AddHomePlacePage from '../pages/AddHomePlacePage';
import OnlineSoundProgressPage from '../pages/OnlineSoundProgressPage';
import OnlineSoundInitialPage from '../pages/OnlineSoundInitialPage';
import KidPhoneProblemsPage from '../pages/KidPhoneProblemsPage';
import KidPhoneConfigurePage from '../pages/KidPhoneConfigurePage';
import FreeMinutesPage from '../pages/FreeMinutesPage';
import ChildAchievementsPage from '../pages/ChildAchievementsPage';
import ChildTasksHistoryPage from '../pages/ChildTasksHistoryPage';
import ChildDreamsPage from '../pages/ChildDreamsPage';
import ChildParentTasksPage from '../pages/ChildParentTasksPage';
import AchievementsFeaturesPage from '../pages/AchievementsFeaturesPage';
import DemoMapPage from '../pages/DemoMapPage';
import ActivationSuccessPage from '../pages/ActivationSuccessPage';
import ActivationFailPage from '../pages/ActivationFailPage';
import DevPage from '../pages/DevPage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import IntroPane from "../components/organisms/IntroPane";
import {
  ChildChatsPage,
  MessengerChatPage,
  PaymentMethodPage,
  AddPhoneNumberPage,
  PhoneNumberConfirmationPage,
  YooKassaPaymentPage,
  PayWithBankCardPage,
  MenuPage,
  MainPage,
} from '../pages';
import { getModel } from 'react-native-device-info';

const phoneModel = getModel();
const isIphone14 = phoneModel == 'iPhone 14' || phoneModel === 'iPhone 14 Plus';
const isIphone14Pro = phoneModel.includes('iPhone 14 Pro');

const headerStatusBarConfigs = {
  headerStyle: {
    height: Platform.OS === 'ios' ? (isIphone14 ? 76 : (isIphone14Pro ? 86 : 56)) : Constants.statusBarHeight + 56,
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : Constants.statusBarHeight,
  },
};

const headerWithBorderRadiusConfigs = {
  headerStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    height: Platform.OS === 'ios' ? (isIphone14 ? 76 : (isIphone14Pro ? 86 : 56)) : Constants.statusBarHeight + 56,
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : Constants.statusBarHeight,
  },
  headerTransparent: true,
};

const RootStack = createStackNavigator(
  {
    Intro: {
      // screen: IntroPage,
      screen: IntroPane,
      // screen: BuyPremiumPage,
      navigationOptions: {
        header: null,
        headerBackTitle: null,
      },
    },
    Auth: {
      screen: AuthPage,
      navigationOptions: {
        header: null,
        headerBackTitle: null,
      },
    },
    Register: {
      screen: RegisterPage,
    },
    Recover: {
      screen: RecoverPage,
    },
    Map: {
      screen: MapPage,
    },
    DemoMap: {
      screen: DemoMapPage,
    },
    Settings: {
      screen: SettingsPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    About: {
      screen: AboutPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    AddPhone: {
      screen: AddPhonePage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ObjectName: {
      screen: ObjectNamePage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    LocationRate: {
      screen: LocationRatePage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    Buzzer: {
      screen: BuzzerPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    Dummy: {
      screen: DummyPage,
    },
    TrackHistory: {
      screen: TrackHistoryPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    Events: {
      screen: EventsPage,
    },
    Places: {
      screen: PlacesPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    PremiumFeatures: {
      screen: PremiumFeaturesPage,
    },
    AchievementFeatures: {
      screen: AchievementsFeaturesPage,
    },
    BuyPremium: {
      screen: BuyPremiumPage,
    },
    TryPremium: {
      screen: TryPremiumPage,
    },
    Chat: {
      screen: ChatPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    Stats: {
      screen: StatsPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    Parents: {
      screen: ParentsPage,
    },
    AddParent: {
      screen: AddParentPage,
    },
    DeleteParent: {
      screen: DeleteParentPage,
    },
    Wiretapping: {
      screen: WiretappingPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    SetupBalance: {
      screen: SetupBalancePage,
    },
    SupportChat: {
      screen: SupportChatPage,
    },
    SupportAgentChatList: {
      screen: SupportAgentChatListPage,
    },
    SupportAgentChat: {
      screen: SupportAgentChatPage,
    },
    Language: {
      screen: LanguagePage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    AddHomePlace: {
      screen: AddHomePlacePage,
    },
    OnlineSoundInitial: {
      screen: OnlineSoundInitialPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    OnlineSoundProgress: {
      screen: OnlineSoundProgressPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    KidPhoneProblems: {
      screen: KidPhoneProblemsPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    KidPhoneConfigure: {
      screen: KidPhoneConfigurePage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    FreeMinutes: {
      screen: FreeMinutesPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ChildAchievements: {
      screen: ChildAchievementsPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ChildTasksHistory: {
      screen: ChildTasksHistoryPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ChildDreams: {
      screen: ChildDreamsPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ChildParentTasks: {
      screen: ChildParentTasksPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ActivationSuccess: {
      screen: ActivationSuccessPage,
    },
    ActivationFail: {
      screen: ActivationFailPage,
    },
    Dev: {
      screen: DevPage,
      navigationOptions: {
        ...headerStatusBarConfigs,
      },
    },
    ChildChats: {
      screen: ChildChatsPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    MessengerChat: {
      screen: MessengerChatPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    PaymentMethod: {
      screen: PaymentMethodPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    AddPhoneNumber: {
      screen: AddPhoneNumberPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    PhoneNumberConfirmation: {
      screen: PhoneNumberConfirmationPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    YooKassaPayment: {
      screen: YooKassaPaymentPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    PayWithBankCard: {
      screen: PayWithBankCardPage,
      navigationOptions: {
        ...headerWithBorderRadiusConfigs,
      },
    },
    Menu: {
      screen: MenuPage,
      navigationOptions: {
        header: null,
      },
    },
    Main: {
      screen: MainPage,
      navigationOptions: {
        header: null,
      },
    }
  },
  {
    initialRouteName: 'Dummy',
    unmountInactiveRoutes: true,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#FF666F',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: '100',
      },
      gesturesEnabled: false,
      headerBackTitle: null,
    },
    headerLayoutPreset: 'center',
    transitionConfig: (navigationProps) => {
      const props = navigationProps && navigationProps.scene.route;
      const { routeName, params = {} } = props;
      const { backTo = null } = params;

      if (routeName === 'MessengerChat') {
        return {
          transitionSpec: {
            delay: 100,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          },
        };
      } else if (routeName === 'BuyPremium' && backTo && backTo === 'ChildChats') {
        return {
          transitionSpec: {
            delay: 1,
            duration: 500,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            useNativeDriver: true,
          },
        };
      };
    },
  },
);

export default RootStack;
