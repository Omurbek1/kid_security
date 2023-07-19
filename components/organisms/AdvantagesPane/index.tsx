import React, { useEffect, useState } from 'react';
import { View, Text, Platform, Alert, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import { L } from '../../../lang/Lang';
import Const from '../../../Const';
import KsAlign from '../../atom/KsAlign';
import ModalWindow from '../../molecules/ModalWindow/index';
import KsButton from '../../atom/KsButton/index';
import * as IAP from '../../../purchases/Purchases';
import TryPremiumLabel from '../../TryPremiumLabel';
import { connect } from 'react-redux';
import { KidSecurityState } from '../../../store/types';
import { GetProductInfo, ProductItem } from '../../../purchases/PurchasesInterface';
import TryPremiumLabel2 from '../../molecules/TryPremiumLabel2/index';
import { PaymentProblemModal, CustomAlert } from '../../../components';
import { firebaseAnalitycsForOpenModal, firebaseAnalyticsForBeginCheckout } from '../../../analytics/firebase/firebase';

interface AdvantageRow {
  title: string;
  existsInTrial: boolean;
  existsInPremium: boolean;
}

interface AdvantagesPaneProps {
  visible: boolean;
  onClose: () => void;
  onButtonPress: () => void;
  threeMonthPrice: number;
  product: ProductItem;
  onSuccess: () => void;
  timerLabel: string;
  showAlert: (
    isVisible: boolean,
    title: string,
    subtitle: string,
    isSupportVisible?: boolean,
    supportText?: string,
    actionTitle?: string,
    actions?: []
  ) => void;
  alertObj: {};
}

const AdvantagesPane: React.FC<AdvantagesPaneProps> = ({
  visible,
  onClose,
  threeMonthPrice,
  product,
  onSuccess,
  timerLabel,
  showAlert,
  alertObj,
}) => {
  const [loading, setLoading] = useState(false);
  const [isPaymentProblemModalVisible, setIsPaymentProblemModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      firebaseAnalitycsForOpenModal('paywallMapLabel', true);
    }
  }, [visible]);

  const onBuyPremium = async () => {
    const kind = 'threemonth_trial';
    firebaseAnalyticsForBeginCheckout(kind)

    const result = await IAP.buyPremium(this, kind);
    const { purchase, cancelled, error } = result;
    console.log('Error:', error, result);
    //Error code means that this product alreave have been purchased before
    if (error === 'E_ALREADY_OWNED') {
      showAlert(true, L('premium_account'), L('premium_already_purchased'));
      setLoading(false);
      return;
    }
    if (error || cancelled) {
      setIsPaymentProblemModalVisible(true);
      setLoading(false);

      return;
    }

    const ok = IAP.verifyPurchase(purchase);

    if (ok) {
      setLoading(false);
      onClose();
      onSuccess();
    } else {
      setLoading(false);

      setTimeout(() => {
        showAlert(
          true,
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : ''])
        );
      }, 250);
      return;
    }
  };

  const [rows, setRows] = useState<AdvantageRow[]>([
    {
      title: L('child_location'),
      existsInTrial: true,
      existsInPremium: true,
    },
    {
      title: L('kid_achievements'),
      existsInTrial: true,
      existsInPremium: true,
    },
    {
      title: L('record_sound'),
      existsInTrial: false,
      existsInPremium: true,
    },
    {
      title: L('send_signal'),
      existsInTrial: false,
      existsInPremium: true,
    },
    {
      title: L('app_statistics'),
      existsInTrial: false,
      existsInPremium: true,
    },
    {
      title: L('child_movement'),
      existsInTrial: false,
      existsInPremium: true,
    },
  ]);

  const renderRow = (row: AdvantageRow) => {
    return (
      <View key={row.title} style={{ flexDirection: 'row', marginBottom: 5 }}>
        <View style={{ flex: 2 }}>
          <Text style={{ fontWeight: '700', textAlign: 'left', color: '#000' }}>{row.title}</Text>
        </View>

        <Icon
          containerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          type="font-awesome"
          name={row.existsInTrial ? 'check' : 'minus'}></Icon>
        <Icon
          containerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          type="font-awesome"
          name={row.existsInPremium ? 'check' : 'minus'}></Icon>
      </View>
    );
  };
  return (
    <Modal visible={visible} transparent={true}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#FFFFFF', padding: 15, borderRadius: 15, margin: 15 }}>
          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
              <TryPremiumLabel2 timerLabel={timerLabel} visible={true} price={product.introductoryPrice} />
              <Icon name="close-circle-outline" type="material-community" size={28} onPress={onClose}></Icon>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}></View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>{L('standart')}</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>{L('premium')}</Text>
              </View>
            </View>
            {rows.map((row) => renderRow(row))}
          </View>
          <View style={{ alignItems: 'center', borderBottomWidth: 1, paddingVertical: 10 }}>
            <KsButton
              loading={loading}
              title={L('subsribe_for_month', [product.introductoryPrice])}
              titleStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}
              style={{ borderRadius: 20, height: 50, marginBottom: 10 }}
              onPress={() => {
                onBuyPremium(), setLoading(true);
              }}></KsButton>
            <View style={{ maxWidth: '80%' }}>
              <Text style={{ textAlign: 'center', color: '#000' }}>
                {L('three_month_subheader', [product.localizedPrice])}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            <View>
              <Text style={{ textAlign: 'center', fontSize: 10, color: '#000' }}>
                {L('three_month_footer', [Platform.OS === 'ios' ? 'App Store' : 'Google Play'])}
              </Text>
            </View>
          </View>
        </View>
        <PaymentProblemModal
          isVisible={isPaymentProblemModalVisible}
          onCloseModal={() => setIsPaymentProblemModalVisible(false)}
        />
        {alertObj.isVisible && <CustomAlert />}
      </View>
    </Modal>
  );
};

export default AdvantagesPane;
