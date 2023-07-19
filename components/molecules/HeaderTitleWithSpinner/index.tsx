import React from 'react';
import KsAlign from '../../atom/KsAlign';
import { View, Text } from 'react-native';
import ConnectedLoadingSpinner from '../ConnectedLoadingSpinner';
import { L } from '../../../lang/Lang';

const HeaderTitleWithSpinner = ({ title }) => {
  return (
    <KsAlign axis="horizontal" elementsGap={10}>
      <View>
        <ConnectedLoadingSpinner color="#fff"></ConnectedLoadingSpinner>
      </View>

      <Text style={{ fontWeight: '600', fontSize: 16, color: '#fff' }}>{title}</Text>
    </KsAlign>
  );
};

export default HeaderTitleWithSpinner;
