import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ModalWindowTypes } from './type';

const ModalWindow: React.FC<ModalWindowTypes.ModalWindowProps> = (props) => {
  const { visible, style, onTouchOutside } = props;

  return (
    <Dialog
      visible={visible}
      containerStyle={{ zIndex: 99 }}
      onTouchOutside={onTouchOutside}
      onHardwareBackPress={onTouchOutside}>
      <DialogContent>
        <View style={[{ width: wp('80%'), paddingTop: 20 }, style]}>{props.children}</View>
      </DialogContent>
    </Dialog>
  );
};

export default ModalWindow;
