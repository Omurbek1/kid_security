import { ViewStyle } from 'react-native';
export namespace ConfirmTaskDialogTypes {
  export interface ConfirmTaskDialog {
    visible?: boolean;
    style?: ViewStyle;
    onTouchOutside?: () => void;
    reward?: boolean;
    onSumbit?: (value: any) => void;
  }
}
