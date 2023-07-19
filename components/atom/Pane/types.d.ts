import { ViewStyle } from 'react-native';
export namespace KsPaneTypes {
  export interface PaneProps {
    padding?: PaddingObject | number;
    style?: ViewStyle;
  }

  export interface PaddingObject {
    vertical: number;
    horizontal: number;
  }
}
