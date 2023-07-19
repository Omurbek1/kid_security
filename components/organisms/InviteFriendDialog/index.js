import React, { Component, Fragment, useEffect, useState } from 'react';
import { View, Text, Image, Linking, FlatList, SafeAreaView, Share, Platform } from 'react-native';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { L } from '../../../lang/Lang';
import { CustomProgressBar, shareApp } from '../../../Utils';
import { Icon } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { popupActionCreators } from '../../../reducers/popupRedux';
import { connect } from 'react-redux';
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog';
import InviteFriendProgressList from './InviteFriendProgressList';
import { controlActionCreators } from '../../../reducers/controlRedux';
import styles from './styles';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { firebaseAnalitycsForOpenModal } from 'analytics/firebase/firebase';

function InviteFriendDialog(props) {
  const { popupInviteFriendShowHide, userProps, userId, emitInviteToken, visible } = props;
  useEffect(() => {
    if (visible) {
      firebaseAnalitycsForOpenModal('modalShareWithFriends', true);
    }
  }, [visible]);
  let [state, setState] = useState({ isProgress: false, progressTitle: '' });

  const openProgressbar = (title) => {
    setState((prev) => ({ ...prev, isProgress: true, progressTitle: title }));
  };
  const hideProgressbar = () => {
    setState((prev) => ({ ...prev, isProgress: false }));
  };
  const onInvite = ({ userId, emitInviteToken }) => {
    openProgressbar(L('wait'));
    emitInviteToken(async function (pr, packet) {
      if (!packet || !packet.data) {
        return;
      }
      if (0 === packet.data.result) {
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
            hideProgressbar();
            setTimeout(() => {
              Share.share({
                message: L('app_share_text') + url,
              });
            }, 100);
          });
      }
    });
  };

  return (
    <Dialog
      visible={visible}
      containerStyle={{ ...styles.addFriendDialog }}
      onTouchOutside={popupInviteFriendShowHide}
      onHardwareBackPress={popupInviteFriendShowHide}>
      <View style={{ ...styles.wrapper }}>
        <View style={{ ...styles.top }}>
          <TouchableOpacity style={styles.cancel_button} onPress={popupInviteFriendShowHide}>
            <Icon iconColor="black" name="ios-close-circle-outline" type="ionicon" size={32} />
          </TouchableOpacity>
          <Image source={require('../../../img/ic_share_friends.png')} style={styles.image} />
          <Text style={styles.text1}>{L('minutes_gift')}</Text>
          <Text style={styles.text2}>{L('share_app_with_friends')}</Text>
          <View style={styles.horizontalSplit} />
        </View>
        <SafeAreaView style={{ ...styles.center }}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <InviteFriendProgressList userProps={userProps} />
          </ScrollView>
        </SafeAreaView>
        <View style={{ ...styles.bottom }}>
          <View style={styles.horizontalSplit} />
          <TouchableOpacity
            color="white"
            style={styles.button}
            onPress={async () => {
              await onInvite({ userId, emitInviteToken });
              /*const shared = await shareApp();
            if (shared && this.props.onPressCancel) {
              this.props.onPressCancel();
            }*/
            }}>
            <Text style={styles.button_text}>{L('share')}</Text>
          </TouchableOpacity>
          <CustomProgressBar visible={state.isProgress} title={state.progressTitle} />
          <Text style={styles.text3}>*{L('conditions_minutes')}</Text>
        </View>
      </View>
    </Dialog>
  );
}

const mapStateToProps = (state) => {
  return {
    userProps: state.authReducer.userProps,
    visible: state.popupReducer.popupInviteFriendVisible,
    userId: state.authReducer.userId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    popupInviteFriendShowHide: bindActionCreators(popupActionCreators.popupInviteFriendShowHide, dispatch),
    emitInviteToken: bindActionCreators(controlActionCreators.emitInviteToken, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriendDialog);
