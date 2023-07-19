import React from 'react';
import { Share, Text, TouchableOpacity, StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { CustomProgressBar } from '../Utils';
import { L } from '../lang/Lang';
import NavigationService from '../navigation/NavigationService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';

const win = Dimensions.get('window');
const ratio = win.width / 512; // 512 is actual image width

class FreeMinutesPage extends React.Component {
  state = {
    isProgress: false,
  };

  static navigationOptions = () => {
    return {
      header: null,
      /*headerTransparent: true,
      headerStyle: { borderBottomWidth: 0 },*/
    };
  };

  async UNSAFE_componentWillMount() {}

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  async onInvite() {
    const { userId, emitInviteToken } = this.props;

    this.openProgressbar(L('wait'));
    const _hideProgressbar = this.hideProgressbar;

    emitInviteToken(async function (pr, packet) {
      if (!packet || !packet.data) {
        return;
      }
      if (packet.data.result === 0) {
        const token = packet.data.token;
        dynamicLinks()
          .buildShortLink(
            {
              link: 'https://kidsecurity.net/?action=invite&initiator=' + userId + '&token=' + token,
              domainUriPrefix: 'https://kidsecurity.page.link',
              analytics: {
                campaign: 'banner',
                action: 'invite',
                initiator: userId,
                token: token,
              },
              android: {
                packageName: 'kz.sirius.kidssecurity',
                // fallbackUrl: 'https://kidsecurity.page.link/friend',
              },
              ios: {
                appStoreId: '1450358983',
                bundleId: 'kz.sirius.siriuskids',
                // fallbackUrl: 'https://kidsecurity.page.link/friend',
              },
            },
            'UNGUESSABLE'
          )
          .then((url) => {
            _hideProgressbar();
            setTimeout(() => {
              Share.share({
                message: L('app_share_text') + url,
              });
            }, 100);
          });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Image style={styles.image} source={require('../img/ic_invite_friend.jpg')} resizeMode="cover" />
        <TouchableOpacity style={styles.close} onPress={() => NavigationService.back()}>
          <Icon type="evilicon" name="close-o" color="black" size={50} />
        </TouchableOpacity>

        <Text style={styles.header}>{L('free_minutes_per_friend')}</Text>
        <View style={styles.steps}>
          <Text>
            <Text style={styles.bold}>{L('free_min_step_1')}</Text>
            <Text style={{ color: '#000' }}>{L('free_min_tell_friends')}</Text>
          </Text>
          <Text>{'\n'}</Text>
          <Text>
            <Text style={styles.bold}>{L('free_min_step_2')}</Text>
            <Text style={{ color: '#000' }}>{L('free_min_get_reward')}</Text>
          </Text>
        </View>
        <Text style={styles.benefit}>{L('free_min_benefid_for_friend')}</Text>
        <View style={styles.buttonWrapper}>
          <Button
            buttonStyle={styles.request_button}
            textStyle={{ textAlign: 'center' }}
            backgroundColor="#FF666F"
            borderRadius={20}
            title={L('send_invitation')}
            onPress={this.onInvite.bind(this)}
          />
        </View>
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { userId } = state.authReducer;

  return {
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    emitInviteToken: bindActionCreators(controlActionCreators.emitInviteToken, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreeMinutesPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  image: {
    width: win.width,
    height: ratio * 342,
    backgroundColor: 'white',
    alignSelf: 'stretch',
  },
  header: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  steps: {
    paddingLeft: 20,
    margin: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'red',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  benefit: {
    marginTop: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#000',
  },
  request_button: {
    marginTop: 10,
    borderRadius: 20,
    width: 250,
    height: 50,
  },
  buttonWrapper: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  close: {
    position: 'absolute',
    top: 40,
    right: 5,
    zIndex: 100,
  },
});
