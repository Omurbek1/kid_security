import { ViewStyle } from 'react-native';
import { ModalWindowTypes } from '../../molecules/ModalWindow/type';
export namespace AddTaskDialogType {
  export interface AddTaskDialogProps extends ModalWindowTypes.ModalWindowProps {
    style?: ViewStyle;
    onSubmit?: (data: TaskDialogEventData) => void;
  }
  export interface TaskDialogEventData {
    title: string;
    reward: number;
  }
}
