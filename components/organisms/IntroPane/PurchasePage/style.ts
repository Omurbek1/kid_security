import { StyleSheet, Dimensions } from 'react-native';

import { NewColorScheme } from '../../../../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR, GREY_COLOR_2, PINK_COLOR_2, PINK_COLOR_1, GREY_COLOR_1, GREY_COLOR_4, GREY_COLOR_3 } =
  NewColorScheme;

const styles = StyleSheet.create({
  title: {
    fontSize: width / 29,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 25,
  },
  functionWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  check: {
    width: 17,
    height: 12,
    alignSelf: 'center',
  },
  lock: {
    width: 14,
    height: 17,
    alignSelf: 'center',
  },
  bottomWrapper: {
    backgroundColor: PINK_COLOR_2,
    paddingVertical: 40,
    width,
    paddingHorizontal: 22,
    height: '100%',
  },
  selected: {
    width: 20,
    height: 20,
    borderRadius: 30,
    backgroundColor: PINK_COLOR_1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10,
  },
  checkWhite: {
    width: 12,
    height: 9,
  },
  promoText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
  },
  boldWhiteText: {
    fontSize: width / 23,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  sevenDays: {
    fontSize: width / 29.5,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  priceText: {
    fontSize: width / 26,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  notSelected: {
    width: 20,
    height: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: GREY_COLOR_2,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText1: {
    fontSize: width / 29.5,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 12,
  },
  bottomText2: {
    fontSize: width / 26,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 4,
  },
  policyText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: width / 34.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: GREY_COLOR_1,
    marginBottom: width / 29.5,
    alignSelf: 'center',
  },
  promoView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingTop: 9,
    paddingBottom: 7,
  },
  promoWrapper: {
    backgroundColor: PINK_COLOR_1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingLeft: 19,
    paddingRight: 12,
    paddingTop: 7,
    paddingBottom: 9,
  },
  monthlyView: {
    borderRadius: 12,
    backgroundColor: GREY_COLOR_4,
    paddingLeft: 19,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 12,
    marginTop: width / 29.5,
  },
  monthlyWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 15,
  },
  featureSeparator: {
    height: 1,
    backgroundColor: GREY_COLOR_4,
  },
  feature: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
  },
  subscriptionType: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topWrapper: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    width: 15,
    height: 14,
    alignSelf: 'center',
    marginBottom: 3,
  },
  premiumWrapper: {
    width: 59,
    height: 219,
    position: 'absolute',
    alignSelf: 'center',
    top: -15,
    resizeMode: 'contain',
  },
  notPromoSelected: {
    borderWidth: 1,
    borderColor: GREY_COLOR_3,
    backgroundColor: '#FFFFFF',
  },
  bottomTextWrapper: {
    flex: 1,
    marginTop: 12,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  trialInfoText: {
    color: BLACK_COLOR,
    fontSize: width / 34.5,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 7,
  },
  versionApp: {
    color: '#7D7D7D',
    fontSize: 11,
    fontWeight: '300',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default styles;
