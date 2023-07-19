import React from 'react';
import ModalWindow from '../../molecules/ModalWindow';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import { TextInput } from 'react-native';
import SpinnedButton from '../../molecules/SpinnedButton';
import KsButton from '../../atom/KsButton';
import { NewDreamDialogTypes } from './type';
import DreamConfirmForm from './form';

const NewDreamDialog: React.FC<NewDreamDialogTypes.NewDreamDialogProps> = ({
  visible,
  style,
  onTouchOutside,
  onSubmit,
}) => {
  return (
    <ModalWindow style={style} visible={visible} onTouchOutside={onTouchOutside}>
      <DreamConfirmForm onSumbit={onSubmit}></DreamConfirmForm>
    </ModalWindow>
  );
};

export default NewDreamDialog;
