import { ViewStyle } from 'react-native';
export namespace TaskPaneTypes {
  export interface TaskPaneProps {
    title: string;
    removeSubmit?: boolean;
    submitButtonTitle?: string;
    cancelButtonTitle?: string;
    outlineSubmit?: boolean;
    style?: ViewStyle;
    customPointBar?: any;
    submitButtonColor?: string;
    points?: number;
    dev?: boolean;
    onSubmit?: () => void;
    onCancel?: (...args) => void;
    removeActions?: boolean;
    createdDate?: Date;
    removeCancel?: boolean;
    loadingSumbit?: boolean;
    loadingCancel?: boolean;
  }
}
