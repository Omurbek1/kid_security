import { StyleSheet, Dimensions } from 'react-native';
import { NewColorScheme } from '../../../../shared/colorScheme';

const { width, height } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

const styles = StyleSheet.create({
  img: {
    width,
    height: height / 1.7,
  },
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
    marginTop: width / 13,
  },
  bottomWrapper: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-around',
  },
});

export default styles;
