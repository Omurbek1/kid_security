import React from 'react';
import { View } from 'react-native';
import GeoZoneRadius from '../../molecules/GeoZoneRadius/index';

const EditPlaceForm = () => {
  return (
    <View style={{ alignItems: 'center', paddingTop: 20 }}>
      <GeoZoneRadius style={{ width: '60%' }}></GeoZoneRadius>
    </View>
  );
};

export default EditPlaceForm;
