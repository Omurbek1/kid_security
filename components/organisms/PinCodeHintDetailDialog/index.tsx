import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  ImageBackground,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
import Carousel from 'react-native-snap-carousel';
import { popupActionCreators, popupSelectors } from '../../../reducers/popupRedux';
import { L } from '../../../lang/Lang';
import { NewColorScheme } from '../../../shared/colorScheme';

const { width, height } = Dimensions.get('window');
const {
  GREY_COLOR_3,
  BLACK_COLOR,
  PINK_COLOR_1,
} = NewColorScheme;

interface PinCodeModalProps {
  toggleDialogPinCodeHintDetail: () => void;
  dialogPinCodeHintDetail: boolean;
};

interface PinCodeModalState {
  activeIndex: number;
};

class PinCodeHintDetailDialog extends React.Component<PinCodeModalProps, PinCodeModalState> {
  constructor(props) {
    super(props);
  };

  state = {
    activeIndex: 0,
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  renderItem({ item }) {
    return item.render();
  };

  onBackButtonPress = () => {
    const {
      toggleDialogPinCodeHintDetail,
      dialogPinCodeHintDetail,
    } = this.props;

    if (dialogPinCodeHintDetail) {
      toggleDialogPinCodeHintDetail();
      return true;
    };

    return false;
  };

  renderStep = (item: {}) => {
    const { index, item: { title, subtitle, img } } = item;
    const {
      stepTitle,
      stepSubtitle,
      stepImg,
      stepContainer,
      step2Wrapper,
      step2TitleWrapper,
      lockIcon,
      pinCodeText,
      step2Subtitle,
      pinCodeSwitch,
    } = styles;

    return <View style={stepContainer}>
      <View>
        <Text style={stepTitle}>{title}</Text>
        <Text style={stepSubtitle}>{subtitle}</Text>
      </View>
      <ImageBackground source={img} style={stepImg} resizeMode='contain'>
        {index === 1 &&
          <View style={step2Wrapper}>
            <View style={{ width: '85%' }}>
              <View style={step2TitleWrapper}>
                <Image
                  source={require('../../../img/lock_pin_code.png')}
                  style={lockIcon} />
                <Text style={pinCodeText}>
                  {L('pin1')}
                </Text>
              </View>
              <Text style={step2Subtitle}>
                {L('set_then_notdelete')}
              </Text>
            </View>
            <Image
              source={require('../../../img/pin_code_switch.png')}
              style={pinCodeSwitch} />
          </View>}
      </ImageBackground>
    </View>
  };

  render() {
    const {
      toggleDialogPinCodeHintDetail,
      dialogPinCodeHintDetail,
    } = this.props;
    const { activeIndex } = this.state;
    const {
      container,
      innerContainer,
      header,
      topWrapper,
      flexStyle,
      closeBtn,
      closeImg,
      pinCodeTitle,
      pinCodeSubtitle,
      dotsContainer,
      dot,
      pinCodeTitlesWrapper,
      carouselWrapper,
      arrowImg,
      arrowBtn,
    } = styles;
    const INSTRUCTIONS_STEPS = [
      {
        title: L('free_min_step_1'),
        subtitle: L('enter_childsetting'),
        img: require('../../../img/pin_code_step_1.png'),
      },
      {
        title: L('free_min_step_2'),
        subtitle: L('active_pin_code'),
        img: require('../../../img/pin_code_step_2.png'),
      },
    ];
    const getBackgroundColor = (index: number) =>
      activeIndex === index ? PINK_COLOR_1 : 'rgba(243, 105, 137, 0.3)';

    return dialogPinCodeHintDetail
      ? <GestureRecognizer
        onSwipeDown={() => toggleDialogPinCodeHintDetail(false)}
        style={flexStyle}>
        <Modal
          visible={dialogPinCodeHintDetail}
          transparent={true}
          onRequestClose={this.onBackButtonPress}>
          <View style={container}>
            <TouchableWithoutFeedback
              onPress={() => toggleDialogPinCodeHintDetail(false)}
              style={flexStyle} >
              <View style={flexStyle} />
            </TouchableWithoutFeedback>
            <View style={[innerContainer,
              { height: Platform.OS === 'ios' ? '85%' : '90%' }]}>
              <View style={topWrapper}>
                <View style={header} />
                <TouchableOpacity
                  onPress={() => toggleDialogPinCodeHintDetail(false)}
                  style={closeBtn}>
                  <Image
                    source={require('../../../img/close_gray.png')}
                    style={closeImg} />
                </TouchableOpacity>
              </View>
              <View>
                <View style={pinCodeTitlesWrapper}>
                  <Text style={pinCodeTitle}>
                    {L('pin_setur')}
                  </Text>
                  <Text style={pinCodeSubtitle}>
                    {activeIndex === 0
                      ? L('pin_child_manual')
                      : L('step_two_pin')}
                  </Text>
                </View>
                <View style={carouselWrapper}>
                  {activeIndex === 1 &&
                    <TouchableOpacity
                      onPress={() => this.carousel.snapToItem(0)}
                      style={[arrowBtn, { left: width / 14 }]}>
                      <Image
                        source={require('../../../img/arrow_page_left.png')}
                        style={arrowImg} />
                    </TouchableOpacity>}
                  <Carousel
                    ref={(c) => this.carousel = c}
                    data={INSTRUCTIONS_STEPS}
                    renderItem={this.renderStep}
                    sliderWidth={width}
                    itemWidth={width}
                    inactiveSlideShift={0}
                    onSnapToItem={activeIndex => this.setState({ activeIndex })}
                    useScrollView={true} />
                  {activeIndex === 0 &&
                    <TouchableOpacity
                      onPress={() => this.carousel.snapToItem(1)}
                      style={[arrowBtn, { right: width / 14 }]}>
                      <Image
                        source={require('../../../img/arrow_page_right.png')}
                        style={arrowImg} />
                    </TouchableOpacity>}
                </View>
                <View style={dotsContainer}>
                  <View style={[dot, { backgroundColor: getBackgroundColor(0) }]} />
                  <View style={[dot,
                    { marginHorizontal: 14, backgroundColor: getBackgroundColor(1) }]} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </GestureRecognizer>
      : null;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 39,
  },
  header: {
    width: 75,
    height: 6,
    backgroundColor: GREY_COLOR_3,
    borderRadius: 15,
  },
  topWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  flexStyle: {
    flex: 1,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 23,
  },
  closeImg: {
    width: 16,
    height: 16,
    alignSelf: 'flex-end',
  },
  pinCodeTitle: {
    fontSize: width / 23,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  pinCodeSubtitle: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center'
  },
  stepTitle: {
    fontSize: width / 23,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: PINK_COLOR_1,
    textAlign: 'center',
    marginTop: 15,
  },
  stepSubtitle: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 3,
  },
  stepImg: {
    width: width / 1.5,
    height: height / 2,
    left: '10.5%',
  },
  stepContainer: {
    width: '80%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dotsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10,
    left: '1.5%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pinCodeTitlesWrapper: {
    flex: 2,
    paddingHorizontal: 34,
    justifyContent: 'space-evenly',
  },
  step2Wrapper: {
    width: width <= 400 ? (width / 1.5) / 1.75 : (width / 1.5) / 1.55,
    height: 42,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#5058F9',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    top: (height / 2) / 2.8,
    alignSelf: 'center',
    right: width <= 400 ? (width / 1.5) / 9 : (width / 1.5) / 8,
  },
  step2TitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    width: 9,
    height: 9,
  },
  pinCodeText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#181818',
    marginLeft: 2,
  },
  step2Subtitle: {
    fontSize: 6,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
    color: '#666585',
    marginTop: 4,
  },
  pinCodeSwitch: {
    width: 21,
    height: 13,
  },
  carouselWrapper: {
    flex: 11,
    flexDirection: 'row',
  },
  arrowImg: {
    width: 27,
    height: 27,
  },
  arrowBtn: {
    width: 27,
    height: '100%',
    alignSelf: 'center',
    paddingTop: '50%',
    zIndex: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    dialogPinCodeHintDetail: popupSelectors.getDialogPinCodeHintDetail(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDialogPinCodeHintDetail: bindActionCreators(popupActionCreators.toggleDialogPinCodeHintDetail, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PinCodeHintDetailDialog);