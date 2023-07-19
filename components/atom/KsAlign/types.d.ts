import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export namespace KsAlignTypes {
  export interface KsAlignProps {
    justifyContent?: 'center' | 'flex-start' | 'flex-end';
    alignItems?: 'center' | 'flex-start' | 'flex-end';
    elementsGap?: number;
    children?: ReactNode;
    axis?: 'horizontal' | 'vertical';
    style?: ViewStyle[] | ViewStyle;
  }

  export enum JustifyContentValues {
    ROW = 'row',
    COLUMN = 'column',
    ROW_REVERSE = 'row-reverse',
    COLUMN_REVERSE = 'column-reverse',
  }
}
