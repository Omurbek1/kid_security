import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { RoundedPane } from '../../atom/RoundedPane/index';
import { Icon } from 'react-native-elements';
import { AppColorScheme } from '../../../shared/colorScheme';
import { L } from '@lang';


interface NoPlacesViewProps {
  style?: ViewStyle | ViewStyle[];
}

const NoPlacesView: React.FC<NoPlacesViewProps> = ({ style }) => {
  return (
    <View
      style={[{ alignItems: 'center', borderBottomColor: AppColorScheme.passiveAccent, borderBottomWidth: 1 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 30 }}>
        <View style={{ flex: 2 }}>
          <Icon name="alert-circle-outline" type="material-community" color={AppColorScheme.accent}></Icon>
        </View>
        <View style={{ flex: 5 }}>
          <Text style={{ width: '100%', fontSize: 16 }}>{L('add_place_to_receive_alerts')}</Text>
        </View>
      </View>
    </View>
  );
};

export default NoPlacesView;
