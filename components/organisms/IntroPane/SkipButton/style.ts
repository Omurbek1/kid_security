import { StyleSheet } from 'react-native';
import { NewColorScheme } from '../../../../shared/colorScheme';

const { GREY_COLOR_2 } = NewColorScheme;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: GREY_COLOR_2,
    textAlign: 'right',
    width: '100%',
  },
});

export default styles;
