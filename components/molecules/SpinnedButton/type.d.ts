import { ViewStyle } from 'react-native';

export namespace KsSpinnedButtonTypes {
  export interface SpinnedButtonProps {
    value?: number;
    style?: ViewStyle;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  }
}
