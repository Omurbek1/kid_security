import { L } from '@lang';
import KsButtonGradient from 'components/atom/KsButtonGradient';
import React, { FC } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Close from '../img/close.svg';
import IconCheck from '../img/iconCheck.svg';
import Line from '../img/line.svg';
import Plus from '../img/plus.svg';
import Tigrow from '../img/app_iconTigrow1.svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenSecondModal: () => void;
};

const DialogConnectChild: FC<Props> = ({ visible, onClose, onOpenSecondModal }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose}>
            <Close style={styles.backicon} />
          </TouchableOpacity>
          <View>
            <View style={styles.images}>
              <IconCheck style={styles.appicon} />
              <Plus style={styles.plus} />
              <Tigrow style={styles.tigrow} />
            </View>
            <View style={styles.imagesText}>
              <View style={styles.forParents}>
                <Text style={styles.kidsSecurity}>Kid Secuirty </Text>
                <Text style={styles.textKids}>{L('kid_security_for_parents')}</Text>
              </View>
              <View style={styles.textTigrow}>
                <Text style={styles.tigrowText}>Tigrow</Text>
                <Text style={styles.forChild}>{L('tigrow_for_kids')}</Text>
              </View>
            </View>
          </View>
          <Line style={styles.appicontext} />
          <View style={styles.settingText}>
            <Text style={styles.parentText}>{L('parent_phone_setup_successfully')}</Text>
            <Text style={styles.setupText}>{L('lets_setup_kid_phone')}</Text>
          </View>
          <View />
          <KsButtonGradient title={L('setup_kid_phone')} onPress={onOpenSecondModal} />
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
    alignItems: 'center',
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
  appicon: {
    marginTop: 40,
    marginLeft: 0,
  },
  tigrow: {
    width: 75,
    height: 75,
    marginTop: 49,
    marginLeft: 20,
  },
  plus: {
    marginTop: 78,
    marginRight: 0,
    margin: 10,
  },
  appicontext: {
    width: 130,
    height: 125,
    marginTop: 50,
    marginRight: 185,
  },
  forParents: {
    marginLeft: 15,
  },
  settingText: {
    marginTop: -123,
    marginBottom: 20,
    marginLeft: 45,
  },

  parentText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#303030',
  },
  setupText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#303030',
    marginTop: 45,
  },
  images: {
    flexDirection: 'row',
    width: '100%',
  },
  imagesText: {
    flexDirection: 'row',
    marginLeft: -25,
  },
  textKids: {
    textAlign: 'center',
    fontSize: 11,
  },
  textTigrow: {
    textAlign: 'center',
    marginLeft: 60,
    alignItems: 'center',
  },
  kidsSecurity: {
    fontWeight: 'bold',
    color: '#FF4D77',
    fontSize: 16,
  },
  tigrowText: {
    fontWeight: 'bold',
    color: '#FF4D77',
    fontSize: 16,
    // wordSpacing: 1,
  },
  forChild: {
    textAlign: 'center',
    fontSize: 11,
    alignItems: 'center',
  },
  backicon: {
    marginRight: 275,
    marginTop: -7,
  },
  check: {
    marginTop: 85,
    position: 'absolute',
    left: 120,
    zIndex: 1,
    width: 90,
    height: 90,
  },
});

export default DialogConnectChild;
