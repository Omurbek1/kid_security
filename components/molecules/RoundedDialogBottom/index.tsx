import React from 'react';

import { Button, View, Dimensions, Text, SafeAreaView } from 'react-native';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import KsAlign from '../../atom/KsAlign';
import MapZoomButton from '../../MapZoomButton';
import KsButton from '../../atom/KsButton';
import { MapOptionItem } from '../MapOptionItem';
import { L } from '../../../lang/Lang';
import { IconProps } from '../MapOptionItem/index';
import { ColorScheme } from '../../../shared/colorScheme';

interface RoundedDialogBottomProps extends IconProps {
  visible: boolean;
  onTouchOutside: () => boolean;
  title: string;
}

const RoundedDialogBottom: React.FC<RoundedDialogBottomProps> = ({ visible, onTouchOutside, children, title }) => {
  return (
    <Dialog
      visible={visible}
      dialogAnimation={
        new SlideAnimation({
          slideFrom: 'right',
        })
      }
      onTouchOutside={onTouchOutside}
      onHardwareBackPress={() => {
        onTouchOutside();
        return true;
      }}
      overlayOpacity={0.2}
      overlayBackgroundColor={ColorScheme.pink}
      dialogStyle={{ backgroundColor: 'transparent' }}
      containerStyle={{ justifyContent: 'flex-end' }}>
      <View
        style={{
          width: wp('100%'),
          minHeight: 300,
          borderTopLeftRadius: 100,
          backgroundColor: 'white',
        }}>
        <View style={{ justifyContent: 'space-between', marginBottom: 30 }}>
          <MapOptionItem icon="layers" type="material-community" outlined inactive title={title}></MapOptionItem>
          <View>{children}</View>

          <KsButton
            style={{ paddingVertical: 10, marginHorizontal: 10, marginTop: 10 }}
            onPress={onTouchOutside}
            title={L('cancel')}></KsButton>
        </View>
      </View>
    </Dialog>
  );
};

// <SafeAreaView>
// <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
//   <KsAlign
//     axis="horizontal"
//     style={{
//       justifyContent: 'flex-start',
//       alignItems: 'center',
//       width: '100%',
//       paddingLeft: 60,
//       height: 80,
//       borderBottomWidth: 1,
//       borderBottomColor: 'grey',
//     }}
//     elementsGap={10}>
//     <View>
//       <MapZoomButton outlined marginTop="-5" icon="layers" type="material-community" />
//     </View>

//     <View style={{ alignItems: 'flex-start' }}>
//       <Text>Hello world</Text>
//     </View>
//   </KsAlign>
// </View>
// {children}
// <View style={{ padding: 20 }}>
//   <KsButton title="Cancel" onPress={onTouchOutside}></KsButton>
// </View>
// </SafeAreaView>

export default RoundedDialogBottom;
