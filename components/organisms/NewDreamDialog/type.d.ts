import { ViewStyle } from 'react-native';
export namespace NewDreamDialogTypes {
  export interface NewDreamDialogProps {
    visible: boolean;
    onTouchOutside?: () => void;
    style?: ViewStyle;
    onSubmit?: (value: any) => void;
  }
}
