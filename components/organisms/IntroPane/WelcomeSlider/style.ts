import { StyleSheet, Dimensions } from 'react-native';
import { NewColorScheme } from '../../../../shared/colorScheme';

const { width } = Dimensions.get('window');
const {
  PINK_COLOR_1,
  BLACK_COLOR,
  ORANGE_COLOR_1,
  GREY_COLOR_2,
} = NewColorScheme;

const styles = StyleSheet.create({
  welcomeImg: {
    width: width / 1.3,
    height: width / 1.3,
    alignSelf: 'center',
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: width / 14,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: PINK_COLOR_1,
    textAlign: 'center',
  },
  parentName: {
    fontSize: width / 26,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: BLACK_COLOR,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: ORANGE_COLOR_1,
    borderRadius: 8,
    color: BLACK_COLOR,
    fontSize: width / 26,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    paddingLeft: 13,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 4,
    marginVertical: 10,
    paddingVertical: 0,
  },
  questionTitle: {
    fontSize: width / 21,
    fontWeight: '500',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  featureTitle: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
  },
  featureSubtitle: {
    fontSize: width / 34.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    marginTop: 3,
  },
  checkFeature: {
    width: 23,
    height: 23,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: GREY_COLOR_2,
    alignSelf: 'center',
  },
  statisticsImg: {
    width: width / 1.2,
    height: width / 1.2,
  },
  statisticsTitle: {
    fontSize: width / 16,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: PINK_COLOR_1,
    textAlign: 'center',
  },
  statisticsSubtitle: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  amount: {
    fontSize: width / 14,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
  },
  childrenSubtitle: {
    fontSize: width / 34.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  pinkSeparator: {
    height: 1,
    backgroundColor: PINK_COLOR_1,
  },
  amountItem: {
    height: 85,
    borderRadius: 20,
    paddingVertical: 24,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureList: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
  },
  amountSubtitle: {
    fontSize: width / 34.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
  },
  featureItem: {
    flexDirection: 'row',
    width: '85%',
    alignSelf: 'center',
  },
  titleWrapper: {
    marginLeft: 17,
    alignSelf: 'center',
  },
  amountList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default styles;
