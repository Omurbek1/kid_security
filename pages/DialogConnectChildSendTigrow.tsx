import { L } from '@lang';
import KsButtonGradient from 'components/atom/KsButtonGradient';
import React, { FC } from 'react';
import { Modal, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Appstore from '../img/appstore.svg';
import Googleplay from '../img/googleplay.svg';
import Close from '../img/close.svg';
import LinearGradient from 'react-native-linear-gradient';
import Tigrow from '../img/app_iconTigrow2.svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  useOtherMethod: () => void;
};

const DialogConnectChildSendTigrowModal: FC<Props> = ({ visible, onShare, useOtherMethod, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose}>
            <View>
              <Close style={styles.backicon} />
            </View>
          </TouchableOpacity>

          <Text style={styles.headertext}>{L('send_link_to_Tigrow')}</Text>
          {/* <Tigrow /> */}
          <LinearGradient
            colors={['#F36989', '#FF9B72']}
            start={{ x: 0.0, y: 0 }}
            end={{ x: 1.0, y: 0 }}
            style={styles.gradient}>
            <View style={styles.imageview}>
              {/* <Image source={require('../img/android_tigrow.png')} style={styles.tigrow} /> */}
              <Tigrow style={styles.tigrow} />
              <Text style={styles.tigrowText}>Tigrow by Kid Security</Text>
              <View style={styles.imageviewintor}>
                <Appstore style={styles.tigrowappstore} />
                <Googleplay style={styles.tiggrowgoogleplay} />
              </View>
            </View>
          </LinearGradient>
          <Text style={styles.desctext}>{L('tigrow_geolocation_description')}</Text>
          <View style={styles.sharebutton}>
            <KsButtonGradient title={L('send_link_to_kid')} onPress={onShare} />
            <TouchableOpacity onPress={useOtherMethod}>
              <Text style={{ marginTop: 15, textDecorationLine: 'underline' }}>{L('use_another_method')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -20,

    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 35,
    width: 340,
    height: 550,

    // alignItems: 'center',
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  gradient: {
    width: 302,
    height: 106,
    marginTop: 30,
    borderRadius: 21,
    marginLeft: -15,
  },
  appicon: {
    width: 285,
    padding: 20,
    height: 91,
    marginTop: 50,
  },
  appicontext: {
    width: 220,
    height: 105,
    // marginTop: 50,
  },
  backicon: {
    marginLeft: -8,
    marginTop: -8,
  },
  headertext: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 30,
    color: '#000',
  },
  desctext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    width: '100%',
    fontWeight: '400',
    marginRight: 0,
  },
  sharebutton: {
    marginTop: 45,
    textAlign: 'center',
    alignItems: 'center',
  },
  imageview: {
    width: 300,
    height: 104,

    marginTop: 1,
    marginLeft: 0.8,
    backgroundColor: '#ffffff',
    // borderImage: 'linear-gradient(to bottom right, #FF9B72, #FF6E7F)',
    padding: 15,
    borderRadius: 20,
  },
  tigrow: {
    marginTop: 8,
    width: 52,
    height: 52,
  },
  tigrowText: {
    marginTop: -55,
    marginLeft: 64,
    fontWeight: '700',
    fontSize: 18,
    color: '#303030',
  },
  tigrowappstore: {
    marginLeft: 75,
    marginTop: 6,
  },
  tiggrowgoogleplay: {
    marginLeft: 105,
    marginTop: 6,
  },
  imageviewintor: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '55%',
    marginTop: 0,
    marginLeft: 40,
  },
});

export default DialogConnectChildSendTigrowModal;
