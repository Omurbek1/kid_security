import { ViewStyle } from 'react-native';

export namespace ClickableTitledItemTypes {
  export interface ClickableTitledItemProps {
    title: string;
    count?: number;
    style?: ViewStyle;
    onItemPress?: () => void;
  }
}
