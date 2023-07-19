import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { L } from '../../../lang/Lang';
import { NewColorScheme } from '../../../shared/colorScheme';
import { ChildDataTypes } from '../../../shared/types';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface ChildMarkerInfoBubleProps {
  child: ChildDataTypes.ChildData;
  visible?: boolean;
};

function makeReadableCoordTime(o: ChildDataTypes.ChildData) {
  if (o) {
    const { states } = o;
    if (states && states.coordTs) {
      const diff = Math.floor((new Date().getTime() - states.coordTs) / 1000);

      if (diff < 25) {
        return L('ts_right_now');
      };
      if (diff < 60) {
        return L('ts_minute_ago');
      };

      const minutes = Math.floor(diff / 60);

      if (minutes < 60) {
        return minutes + ' ' + L('ts_min');
      };

      const hours = Math.floor(diff / 3600);

      if (hours < 24) {
        return hours + ' ' + L('ts_hour');
      };

      const days = Math.floor(diff / 3600 / 24);

      return days + ' ' + L('ts_day');
    };
  };

  return L('ts_unknown');
};

const ChildMarkerInfoBuble: React.FC<ChildMarkerInfoBubleProps> = ({ child, visible }) => {
  const { container, text } = styles;

  return visible
    ? <View style={container}>
      <Text style={text}>
        {L('last_seen')}: {makeReadableCoordTime(child)}{' '}
        {makeReadableCoordTime(child) === L('ts_right_now') ? null : L('ago')}
      </Text>
      
    </View>
    : null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
});

export default ChildMarkerInfoBuble;
