import { ViewStyle } from 'react-native';
export namespace ModalWindowTypes {
  export interface ModalWindowProps {
    visible?: boolean;
    style?: ViewStyle;
    onTouchOutside?: () => void;
    loading?: boolean;
  }
}
