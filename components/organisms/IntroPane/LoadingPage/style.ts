import { StyleSheet, Dimensions } from 'react-native';
import { NewColorScheme } from '../../../../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

const styles = StyleSheet.create({
  title: {
    fontSize: width / 16,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 86,
    marginBottom: 24,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width / 10,
  },
});

export default styles;
