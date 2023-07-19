import { ViewStyle, TextStyle } from 'react-native';
import { IconProps } from '../../molecules/MapOptionItem/index';
import { Icon, IconType, IconObject } from 'react-native-elements';
export namespace KsButtonTypes {
  export interface KsButtonProps {
    title: string;
    hidden?: boolean;
    outlined?: boolean;
    style?: ViewStyle;
    onPress?: () => void;
    color?: string;
    titleStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
    icon?: IconObject;
  }
}

export default KsButtonTypes;
