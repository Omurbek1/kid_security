import { ViewStyle } from 'react-native';
import { ConfirmedTask, LoadingObject } from '../../../store/achievements/types';
export namespace ChildTaskListTypes {
  export interface ChildTaskListProps {
    style: ViewStyle;
    dispatch: any;
    data: any;
    loading: LoadingObject;
  }
}
