import { Text, StyleSheet, View, Modal } from 'react-native';
import React, { Component } from 'react';
import KsButtonGradient from 'components/atom/KsButtonGradient';
import { L } from '@lang';

interface Props {
  onClick: () => void;
  visible: boolean;
}
export default class DialogConnectChildSuccess extends Component<Props> {
  render() {
    const { visible, onClick } = this.props;
    return (
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modaltext}>{L('kid_phone_connected_to_you')}</Text>
            <View style={styles.buttonStyle}>
              <KsButtonGradient title="Ok" onPress={onClick} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: 300,
    height: 160,
    marginTop: -90,
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
  modaltext: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#303030',
    marginBottom: 20,
  },
  buttonStyle: {
    marginTop: -60,
  },
});
