import React, { Component, FC, useEffect } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { PaymentProblemModal } from 'components';
import { L } from '@lang';
import { firebaseAnalitycsForOpenModal } from 'analytics/firebase/firebase';

type SoundBalanceSalePaneProps = {
  visible: boolean;
  onPressCancel: () => void;
  onPressBuy: () => void;
  product: {
    introductoryPrice: string;
    localizedPrice: string;
  };
  timerLabel: string;
  isPaymentProblemModalVisible: boolean;
  onShowHidePaymentProblemModal: () => void;
};

const SoundBalanceSalePane: FC<SoundBalanceSalePaneProps> = ({
  visible,
  onPressCancel,
  isPaymentProblemModalVisible,
  onPressBuy,
  product,
  timerLabel,
  onShowHidePaymentProblemModal,
}) => {
  useEffect(() => {
    if (visible) {
      firebaseAnalitycsForOpenModal('paywallFewMinutesLeft', true, {
        offer: 'first_month_dicount_for_live_wire',
        offer_timer_counter: timerLabel,
      });
    }
  }, [visible]);
  
  return visible ? (
    <SafeAreaView pointerEvents="auto" style={styles.addPhonePane}>
      <View style={styles.addPhonePaneContent}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              if (onPressCancel) {
                onPressCancel();
              }
            }}>
            <Icon name="close" type="material" size={30} />
          </TouchableOpacity>
          <Image source={require('./ic_calm.png')} resizeMode={'contain'} style={styles.image} />

          <View style={{ marginTop: 10 }}>
            <Text style={styles.text2}>{L('stop_saving_minutes')}</Text>
            <Text style={styles.text2}>{L('safety_is_more_important')}</Text>
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={styles.text2}>{L('first_month')}</Text>
            <Text style={styles.text2}>
              <Text style={{ color: 'red' }}>{`${L('half_percent')} `}</Text>
              {L('for_sound_subscription')}
            </Text>
          </View>

          <Text style={styles.text2}>{product.introductoryPrice}</Text>
          <Text style={[styles.text2]}>{`${L('this_instead_of_this')}`}</Text>
          <View style={styles.cross}>
            <Text style={[styles.text2, { position: 'absolute', top: 0 }]}>{product.localizedPrice}</Text>
            <View style={styles.crossUp} />
            <View style={styles.crossFlat} />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (onPressBuy) {
                onPressBuy();
              }
            }}>
            <Text style={styles.button_text}>{L('connect_promo')}</Text>
          </TouchableOpacity>
          <Text style={styles.text1}>{timerLabel}</Text>

          <Text style={styles.text3}>
            {L('first_month_sound_subscription_sale_info', [product.introductoryPrice, product.localizedPrice])}
          </Text>
        </ScrollView>
      </View>
      <PaymentProblemModal isVisible={isPaymentProblemModalVisible} onCloseModal={onShowHidePaymentProblemModal} />
    </SafeAreaView>
  ) : null;
};

const styles = StyleSheet.create({
  addPhonePane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 6,
    maxWidth: '90%',
    height: '75%',
  },
  closeButton: { position: 'absolute', right: 15, top: 15, borderRadius: 20, borderWidth: 2 },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  text1: {
    textAlign: 'center',
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
  },
  text2: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  text3: {
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
    marginTop: 20,
  },
  button_text: {
    color: 'white',
    fontWeight: '600',
  },
  buttons: {
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#FF666F',
    borderRadius: 10,
    margin: 20,
    width: 200,
  },
  cross: {
    width: 200,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossUp: {
    backgroundColor: 'red',
    height: 100,
    width: 3,
    position: 'absolute',
    top: -40,
    transform: [{ rotate: '75deg' }],
  },
  crossFlat: {
    backgroundColor: 'red',
    height: 100,
    width: 3,
    position: 'absolute',
    top: -40,
    transform: [{ rotate: '105deg' }],
  },
});

export default SoundBalanceSalePane;
