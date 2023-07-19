import React from 'react';
import { View } from 'react-native';
import PillButton from '../../atom/PillButton';
import { L } from '../../../lang/Lang';

const BuyPremiumBadge = ({ style, onPress }) => {
  return (
    <PillButton
      styleProp={style}
      onPress={onPress}
      text={L('buy_premium_badge')}
      icon={require('../../../img/ic_circle_alert_32.png')}
    />
  );
};

export default BuyPremiumBadge;
