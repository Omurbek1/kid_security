import { StyleSheet } from 'react-native';
import { borders } from '../style';

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 45,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  header: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: borders,
  },
  slideView: {
    flex: 1,
    paddingHorizontal: 22,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  skipView: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default styles;
