import React, { useState } from 'react';
import { View, Image, Platform, ImageBackground, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { L } from '../../../lang/Lang';
import { NewColorScheme } from '../../../shared/colorScheme';
import { ChildDataTypes } from '../../../shared/types';
import ChildMarkerInfoBuble from '../ChildMarkerInfoBuble';
import FastImage from 'react-native-fast-image';
import DialogConnectChildSuccess from 'pages/DialogConnectChildSuccess';
import { firebaseAnalitycsLogEvent } from 'analytics/firebase/firebase';

const { width } = Dimensions.get('window');
const { ORANGE_COLOR_1, PINK_COLOR_1 } = NewColorScheme;
const substrate = require('../../../img/ic_marker_substrate.png');
const noAvatarMarker = require('../../../img/child_without_photo.png');

interface MapChildMarkerProps {
  childData: ChildDataTypes.ChildData;
  photoUrl?: string;
  infoBuble?: boolean;
  isExample?: boolean;
  onAddChild?: () => void;
}
const MAX_MODAL_COUNT = 1;

const MapChildMarker: React.FC<MapChildMarkerProps> = ({
  childData,
  photoUrl,
  infoBuble,
  isExample = false,
  onAddChild,
}) => {
  const isPhotoExists = childData?.photoUrl || photoUrl;
  const isChildPhoneAndroid = childData?.states?.firmware?.includes('android');
  const isChildPhoneIos = childData?.states?.firmware?.includes('ios');
  const hi = parseInt(childData?.states?.firmware?.split('-')[1].split('.')[0]);
  const {
    container,
    addChildBtn,
    addChildIcon,
    addChildText,
    childPhotoBackground,
    childPhoto,
    noAvatar,
    timeWrapper,
  } = styles;

  const [modalVisible, setModalVisible] = useState(true);
  const [modalCount, setModalCount] = useState(0);
  const HideModal = () => {
    const params = {
      modal_name: 'ChildPhoneReady',
      screen_name: 'mapScreenDemo',
    };
    firebaseAnalitycsLogEvent('modal_open', params as never, true);
    if (modalCount < MAX_MODAL_COUNT) {
      setModalVisible(false);
      setModalCount(modalCount - 1);
    }
  };

  return (
    <View style={container}>
      {(isChildPhoneAndroid || (isChildPhoneIos && hi < 2)) && !isExample && (
        <>
          <View style={timeWrapper}>
            <ChildMarkerInfoBuble visible={infoBuble} child={childData} />
          </View>
        </>
      )}
      {!isExample && (
        <>
          <View style={timeWrapper}>
            <DialogConnectChildSuccess visible={modalVisible} onClick={HideModal} />
          </View>
        </>
      )}
      {isExample && (
        <TouchableOpacity onPress={onAddChild} style={addChildBtn}>
          <Image source={require('../../../img/add_child_pink.png')} style={addChildIcon} />
          <Text style={addChildText}>{L('forget_to_connect')}</Text>
        </TouchableOpacity>
      )}
      <FastImage source={substrate} style={childPhotoBackground}>
        {isPhotoExists ? (
          <FastImage source={isExample ? photoUrl : { uri: photoUrl || childData.photoUrl }} style={childPhoto} />
        ) : (
          <FastImage source={noAvatarMarker} style={noAvatar} />
        )}
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  timeWrapper: {
    marginBottom: 14,
  },
  addChildBtn: {
    width: 200,
    height: 67,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: ORANGE_COLOR_1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
    marginRight: 60,
    paddingHorizontal: 20,
  },
  addChildIcon: {
    width: 27,
    height: 26,
    marginBottom: 10,
  },
  addChildText: {
    fontSize: width / 26,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: PINK_COLOR_1,
    marginLeft: 4,
    width: '80%',
    textAlign: 'center',
  },
  childPhotoBackground: {
    width: 53,
    height: 61,
    alignItems: 'center',
  },
  childPhoto: {
    width: 47,
    height: 47,
    borderRadius: 100,
    top: 3,
  },
  noAvatar: {
    width: 41,
    height: 41,
    top: 6,
  },
});

export default MapChildMarker;
