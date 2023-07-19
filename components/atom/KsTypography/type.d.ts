import { TextStyle } from 'react-native';

export namespace KsTypographyTypes {
  export interface KsTypographyProps {
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'custom';
    fontSize?: number;
    fontWeight?:
      | '600'
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '700'
      | '800'
      | '900';
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    style?: TextStyle;
  }
}
