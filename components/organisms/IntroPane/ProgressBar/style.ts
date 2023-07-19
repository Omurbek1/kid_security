import { StyleSheet, Dimensions } from 'react-native';
import { NewColorScheme } from '../../../../shared/colorScheme';

const { width } = Dimensions.get('window');
const { ORANGE_COLOR_1 } = NewColorScheme;

const styles = StyleSheet.create({
  box: {
    width: width / 1.5,
    height: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: ORANGE_COLOR_1,
    borderRadius: 7,
  },
});

export default styles;
