import React from 'react';
import {
  Text,
  Linking,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { APIService } from '../Api';
import Const from '../Const';
import { L } from '../lang/Lang';
import UserPrefs from '../UserPrefs';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar } from '../Utils';
import { getHeader } from '../shared/getHeader';
import { AppColorScheme, NewColorScheme } from '../shared/colorScheme';
import CustomHeader from '../components/molecules/CustomHeader';
import KsListItem from '../components/atom/KsListItem';
import { BottomModal, RoundedButton, AccountDeletedModal, DeleteAccountErrorModal } from '../components';
import { APP_VERSION } from '../shared/constants';

const { width } = Dimensions.get('window');
const { RED_COLOR, BLACK_COLOR } = NewColorScheme;

let list: AboutPageListItem[] = [];

interface AboutPageListItem {
  name: string;
  url?: string;
  value?: string;
  lines?: number;
  showArrow?: boolean;
  onPress?: () => void;
}

function initList() {
  const { userId, userProps } = this.props;

  list = [
    {
      name: L('menu_terms_of_use'),
      url: L('terms_of_use_url'),
    },
    {
      name: L('menu_policy'),
      url: L('policy_url'),
    },
    {
      name: L('your_id'),
      value: userId + '',
    },
    {
      name: L('your_phone'),
      value: userProps.phoneNumber ?? '-',
    },
    {
      name: L('delete_acc'),
      showArrow: false,
      onPress: this.onShowHideDeleteAccountModal,
    },
  ];
}

class AboutPage extends React.Component {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_about'), noBackground: true }),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    usingAltBackend: false,
    pressCounter: 0,
    isDeleteAccountModalVisible: false,
    isAccountDeletedModalVisible: false,
    isDeleteAccountErrorModalVisible: false,
  };

  async UNSAFE_componentWillMount() {
    initList.bind(this)();
    let altBackend = await UserPrefs.getUsingAltBackend();
    this.setState({ usingAltBackend: altBackend });
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onItemPress(item) {
    Linking.openURL(item.url);
  }

  getAboutItems() {
    return list.map((item, index) => {
      const isFirst = index === 0;

      return (
        <KsListItem
          containerStyle={[
            styles.itemContainer,
            isFirst && { borderTopColor: AppColorScheme.passiveAccent, borderTopWidth: 1 },
          ]}
          rightText={item?.value}
          rightStyle={{ flex: 6, textAlign: 'right', color: AppColorScheme.passive }}
          title={item.name}
          index={index + 1}
          key={item.name}
          onPress={() => (item.url ? this.onItemPress(item) : item.onPress ? item.onPress() : null)}
          showArrow={item.showArrow}
        />
      );
    });
  }

  onVersionPress() {
    const { pressCounter } = this.state;
    if (pressCounter > 10) {
      NavigationService.navigate('Dev');
    } else {
      this.setState({ pressCounter: this.state.pressCounter + 1 });
    }
  }

  onShowHideDeleteAccountModal = () => {
    const { isDeleteAccountModalVisible } = this.state;

    this.setState({ isDeleteAccountModalVisible: !isDeleteAccountModalVisible });
  };

  onShowAccountDeletedModal = () => {
    this.setState({ isAccountDeletedModalVisible: true });
  };

  onShowHideDeleteAccountErrorModal = () => {
    const { isDeleteAccountErrorModalVisible } = this.state;

    this.setState({ isDeleteAccountErrorModalVisible: !isDeleteAccountErrorModalVisible });
  };

  onDeleteAccount = () => {
    APIService.deleteAccount()
      .then((res) => {
        const { success } = res;

        this.onShowHideDeleteAccountModal();

        if (success) {
          UserPrefs.clearAllData();
          this.onShowAccountDeletedModal();
        } else {
          this.onShowHideDeleteAccountErrorModal();
        }
      })
      .catch((error) => {
        this.onShowHideDeleteAccountModal();
        this.onShowHideDeleteAccountErrorModal();
        console.log('Error deleting account', error);
      });
  };

  renderDeleteAccountModal = () => {
    return (
      <View style={styles.deleteContainer}>
        <Text style={styles.deleteTitle1}>{L('delete_acc_conf')}</Text>
        <Image source={require('../img/delete_account.png')} style={styles.deleteImg} />
        <View>
          <Text style={styles.deleteTitle2}>{L('really_delete')}</Text>
          <Text style={styles.deleteSubtitle}>{L('data_delete')}</Text>
        </View>
        <View style={styles.deleteButtonsWrapper}>
          <RoundedButton title={L('cancel')} onPress={this.onShowHideDeleteAccountModal} />
          <RoundedButton
            title={L('delete')}
            onPress={this.onDeleteAccount}
            buttonStyle={styles.deleteBtn}
            textStyle={{ color: RED_COLOR }}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader
          style={{ borderBottomLeftRadius: 100, borderBottomRightRadius: 40, marginBottom: 20 }}
          backgroundColor="white">
          <View style={{ height: 160, width: '90%', alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
              }}>
              <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Image
                  style={{ height: 20, resizeMode: 'contain', marginBottom: 10 }}
                  source={require('../img/ic_kid_white.png')}></Image>
                <Image
                  style={{ height: 120, resizeMode: 'contain' }}
                  source={require('../img/ic_child_header_1.png')}></Image>
              </View>
              <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Image
                  style={{ height: 20, resizeMode: 'contain', marginBottom: 10 }}
                  source={require('../img/ic_kid_white.png')}></Image>
                <Image
                  style={{ height: 130, resizeMode: 'contain' }}
                  source={require('../img/ic_child_header_2.png')}></Image>
              </View>
              <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Image
                  style={{ height: 20, resizeMode: 'contain', marginBottom: 10 }}
                  source={require('../img/ic_kid_white.png')}></Image>
                <Image
                  style={{ height: 120, resizeMode: 'contain' }}
                  source={require('../img/ic_child_header_3.png')}></Image>
              </View>
            </View>
          </View>
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={this.onVersionPress.bind(this)}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>
                {L('app_version')}: {APP_VERSION}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </CustomHeader>
        <ScrollView>
          {this.getAboutItems()}
          <Text style={styles.backend}>
            {this.state.usingAltBackend ? L('using_alt_backend') : L('using_main_backend')}
          </Text>
          <TouchableOpacity
            style={{
              height: 50,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
            onPress={() => Linking.openURL(Const.HOMEPAGE)}>
            <Text style={{ textAlign: 'center', color: '#555', fontSize: 10 }}>{Const.HOMEPAGE_TEXT}</Text>
          </TouchableOpacity>
          <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
          <BottomModal
            isVisible={this.state.isDeleteAccountModalVisible}
            onHide={this.onShowHideDeleteAccountModal}
            modalStyle={{ height: '55%' }}
            renderView={this.renderDeleteAccountModal}
          />
          <AccountDeletedModal isVisible={this.state.isAccountDeletedModalVisible} />
          <DeleteAccountErrorModal
            isVisible={this.state.isDeleteAccountErrorModalVisible}
            onCloseModal={this.onShowHideDeleteAccountErrorModal}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;

  const { userId, userProps } = state.authReducer;

  return {
    objects,
    userProps,
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    marginTop: 15,
    marginBottom: 10,
    width: 120,
    height: 120,
  },
  listContainer: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: 'white',
  },
  bottomLink: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  backend: {
    opacity: 0.5,
    fontSize: 10,
    textAlign: 'center',
    marginVertical: 20,
  },
  deleteTitle1: {
    fontSize: width / 21,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: RED_COLOR,
    textAlign: 'center',
  },
  deleteImg: {
    width: 70,
    height: 73,
  },
  deleteTitle2: {
    fontSize: width / 23,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: width / 6,
  },
  deleteSubtitle: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 13,
  },
  deleteContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: width / 29.5,
    justifyContent: 'space-evenly',
  },
  deleteButtonsWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  deleteBtn: {
    width: '35.5%',
    borderColor: RED_COLOR,
  },
});
