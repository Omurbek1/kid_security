import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { NewColorScheme } from '../../../../shared/colorScheme';
import Close from '../../../../img/icons/close.svg';
import { L } from '../../../../lang/Lang';

const MapModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const onCloseModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.popup}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.popupCloseBtn} onPress={onCloseModal}>
            <Close />
          </TouchableOpacity>
          <Text style={styles.title}>{L('map_position_in_real_time_active')}</Text>
          <Text style={styles.description}>{L('map_position_in_real_time_description')}</Text>
          <TouchableOpacity style={styles.button} onPress={onCloseModal}>
            <LinearGradient
              colors={[NewColorScheme.PINK_COLOR_1, NewColorScheme.ORANGE_COLOR_1]}
              start={[0, 0]}
              end={[1, 0]}
              locations={[0, 1.0]}
              style={{
                paddingVertical: 6,
              }}>
              <Text style={styles.buttonText}>{L('map_position_in_real_time_button')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    backgroundColor: 'rgba(125, 125, 125, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  popupCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 32,
    width: '89%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    marginTop: 10,
    marginBottom: 6,
  },
  description: {
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
    color: '#7D7D7D',
    marginBottom: 22,
  },
  button: {
    borderRadius: 26,
    overflow: 'hidden',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
export default MapModal;
