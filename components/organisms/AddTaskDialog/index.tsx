import React, { useState } from 'react';
import { AddTaskDialogType } from './type';
import { View, TextInput, StyleSheet } from 'react-native';
import ModalWindow from '../../molecules/ModalWindow';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import KsButton from '../../atom/KsButton';
import SpinnedButton from '../../molecules/SpinnedButton';
import AddTaskForm from './form';
import { ModalWindowTypes } from '../../molecules/ModalWindow/type';

const AddTaskDialog: React.FC<AddTaskDialogType.AddTaskDialogProps> = (props) => {
  const { visible, style, onTouchOutside, onSubmit, loading } = props;
  return (
    <ModalWindow style={style} visible={visible} onTouchOutside={onTouchOutside}>
      <AddTaskForm loading={loading} onSubmitEvent={onSubmit} />
    </ModalWindow>
  );
};

export default AddTaskDialog;
