import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import ModalWindow from '../../molecules/ModalWindow';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import SpinnedButton from '../../molecules/SpinnedButton';
import KsButton from '../../atom/KsButton';
import { ConfirmTaskDialogTypes } from './type';
import ConfirmTaskForm from './form';

const styles = StyleSheet.create({
  textinput: {
    width: '100%',
    minHeight: 70,
    paddingTop: 12,
    paddingLeft: 16,
    maxHeight: 300,
    textAlignVertical: 'bottom',
    fontSize: 14,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
  },
});

const ConfirmTaskDialog: React.FC<ConfirmTaskDialogTypes.ConfirmTaskDialog> = (props) => {
  const { visible, style, onTouchOutside, reward, onSumbit } = props;
  return (
    <ModalWindow style={style} visible={visible} onTouchOutside={onTouchOutside}>
      <ConfirmTaskForm onSubmitEvent={(value) => onSumbit(value)} reward={reward}></ConfirmTaskForm>
    </ModalWindow>
  );
};

export default ConfirmTaskDialog;
