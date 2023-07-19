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
    ScrollView,
    Linking,
    ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GestureRecognizer from 'react-native-swipe-gestures';
import Carousel from 'react-native-snap-carousel';
import { L } from '@lang';

import Const from '../Const';
import { NewColorScheme } from '../shared/colorScheme';
import * as Utils from '../Utils';
import { GradientButton, NewProblemItem } from '../components';

const { width, height } = Dimensions.get('window');
const {
    GREY_COLOR_3,
    BLACK_COLOR,
    GREY_COLOR_1,
    ORANGE_COLOR_1,
    PINK_COLOR_1,
} = NewColorScheme;

interface KidPhoneProblemsModalProps {
    isVisible: boolean;
    onHide: () => void;
    activeObject: {};
    objects: {};
    userId: number;
};

interface KidPhoneProblemsModalState {
    isPinCodeAgreed: boolean;
    activeIndex: number;
    isPinCodeAlertDisplayed: boolean;
};

class KidPhoneProblemsModal extends React.Component
    <KidPhoneProblemsModalProps, KidPhoneProblemsModalState> {
    constructor(props) {
        super(props);
    };

    state = {
        isPinCodeAgreed: false,
        activeIndex: 0,
        isPinCodeAlertDisplayed: false,
    };

    async componentDidMount() {
        let isPinCodeAlertDisplayed = await AsyncStorage.getItem('IS_PIN_CODE_ALERT_DISPLAYED');
        isPinCodeAlertDisplayed = isPinCodeAlertDisplayed
            ? JSON.parse(isPinCodeAlertDisplayed) : false;

        this.setState({ isPinCodeAlertDisplayed });

        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    renderItem({ item }) {
        return item.render();
    };

    onBackButtonPress = () => {
        const { isVisible, onHide } = this.props;

        if (isVisible) {
            onHide();
            return true;
        };

        return false;
    };

    onChatWithTechSupport = async () => {
        const { objects, userId } = this.props;

        const url = Const.compileSupportUrl(userId, objects);

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    const instructionsUrl = L('instructions_url');
                    Linking.openURL(instructionsUrl);
                } else {
                    return Linking.openURL(url);
                };
            })
            .catch((err) => console.warn('Error opening chat with tech support', err));
    };

    onPinCodeDontWant = async () => {
        this.setState({ isPinCodeAlertDisplayed: true });
        await AsyncStorage.setItem('IS_PIN_CODE_ALERT_DISPLAYED', JSON.stringify(true));
    };

    onShowHidePinCodeInstructionsView = () => {
        const { isPinCodeAgreed } = this.state;
        this.setState({ isPinCodeAgreed: !isPinCodeAgreed });
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
                                    source={require('../img/lock_pin_code.png')}
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
                            source={require('../img/pin_code_switch.png')}
                            style={pinCodeSwitch} />
                    </View>}
            </ImageBackground>
        </View>
    };

    render() {
        const {
            isVisible,
            onHide,
            activeObject,
        } = this.props;
        const alerts = Utils.getConfigurationAlets(activeObject);
        const {
            hasAlert,
            gpsAlert,
            micPermissionAlert,
            offlineAlert,
            backgroundPermissionAlert,
            adminDisabledAlert,
            gpsPermissionAlert,
        } = alerts;
        const { isPinCodeAgreed, activeIndex, isPinCodeAlertDisplayed } = this.state;
        const {
            container,
            innerContainer,
            header,
            topWrapper,
            flexStyle,
            closeBtn,
            closeImg,
            notConfigured,
            title,
            techSupport,
            titleWrapper,
            problemsWrapper,
            bottomWrapper,
            arrowLeft,
            back,
            pinCodeTitle,
            pinCodeSubtitle,
            dotsContainer,
            dot,
            pinCodeContainer,
            pinCodeTitlesWrapper,
            carouselWrapper,
            arrowImg,
            arrowBtn,
        } = styles;
        const PROBLEMS = [
            {
                title: L('problem_gps_disabled'),
                subtitle: L('ask_enable_gps'),
                iconSrc: require('../img/location_off.png'),
                iconStyle: { width: 23.5, height: 22 },
            },
            {
                title: L('problem_no_mic_permission'),
                subtitle: L('openapp_microphone'),
                iconSrc: require('../img/microfone_off.png'),
                iconStyle: { width: 24.5, height: 24 },
            },
            {
                title: L('phone_not_connect'),
                subtitle: L('maybe_childdeleteapp'),
                iconSrc: require('../img/connection_off.png'),
                iconStyle: { width: 30, height: 30 },
            },
            {
                title: L('child_removed_pin'),
                subtitle: L('want_set_pin'),
                iconSrc: require('../img/pin_code_off.png'),
                iconStyle: { width: 24, height: 24 },
                isPinCode: true,
                onDontWant: this.onPinCodeDontWant,
                onWant: this.onShowHidePinCodeInstructionsView,
            },
            {
                title: L('background_permission_alert'),
                subtitle: L('configure_kid_app_by_instruction'),
                iconSrc: require('../img/background_mode_off.png'),
                iconStyle: { width: 21, height: 21 },
                isInstructions: true,
            },
            {
                title: L('problem_no_gps_permission'),
                subtitle: L('enable_location_child_app'),
                iconSrc: require('../img/gps_permission_off.png'),
                iconStyle: { width: 23, height: 21 },
            },
        ];
        const INSTRUCTIONS_STEPS = [
            {
                title: L('free_min_step_1'),
                subtitle: L('enter_childsetting'),
                img: require('../img/pin_code_step_1.png'),
            },
            {
                title: L('free_min_step_2'),
                subtitle: L('active_pin_code'),
                img: require('../img/pin_code_step_2.png'),
            },
        ];

        const getBackgroundColor = (index: number) =>
            activeIndex === index ? PINK_COLOR_1 : 'rgba(243, 105, 137, 0.3)';

        return <GestureRecognizer
            onSwipeDown={onHide}
            style={flexStyle}>
            <Modal
                visible={isVisible}
                transparent={true}
                onRequestClose={this.onBackButtonPress}>
                <View style={container}>
                    <TouchableWithoutFeedback
                        onPress={onHide}
                        style={flexStyle} >
                        <View style={flexStyle} />
                    </TouchableWithoutFeedback>
                    <View style={[innerContainer,
                        { height: Platform.OS === 'ios' ? '90%' : '95%' }]}>
                        <View style={topWrapper}>
                            <View style={header} />
                            <TouchableOpacity
                                onPress={onHide}
                                style={closeBtn}>
                                <Image
                                    source={require('../img/close_gray.png')}
                                    style={closeImg} />
                            </TouchableOpacity>
                        </View>
                        {isPinCodeAgreed
                            ? <View>
                                <View style={pinCodeContainer}>
                                    <TouchableOpacity
                                        onPress={this.onShowHidePinCodeInstructionsView}>
                                        <Image
                                            source={require('../img/arrow_left_orange.png')}
                                            style={arrowLeft} />
                                    </TouchableOpacity>
                                    <Text style={back}>
                                        {L('back_settingchild')}
                                    </Text>
                                </View>
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
                                                source={require('../img/arrow_page_left.png')}
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
                                                source={require('../img/arrow_page_right.png')}
                                                style={arrowImg} />
                                        </TouchableOpacity>}
                                </View>
                                <View style={dotsContainer}>
                                    <View style={[dot, { backgroundColor: getBackgroundColor(0) }]} />
                                    <View style={[dot,
                                        { marginHorizontal: 14, backgroundColor: getBackgroundColor(1) }]} />
                                </View>
                            </View>
                            : <>
                                <View style={titleWrapper}>
                                    <Image
                                        source={require('../img/not_configured.png')}
                                        style={notConfigured} />
                                    <Text style={title}>{L('kid_phone_is_not_configured')}</Text>
                                </View>
                                {hasAlert &&
                                    <View style={problemsWrapper}>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <NewProblemItem
                                                item={PROBLEMS[0]}
                                                isVisible={gpsAlert} />
                                            <NewProblemItem
                                                item={PROBLEMS[1]}
                                                isVisible={micPermissionAlert} />
                                            <NewProblemItem
                                                item={PROBLEMS[2]}
                                                isVisible={offlineAlert} />
                                            {!isPinCodeAlertDisplayed &&
                                                <NewProblemItem
                                                    item={PROBLEMS[3]}
                                                    isVisible={adminDisabledAlert} />}
                                            <NewProblemItem
                                                item={PROBLEMS[4]}
                                                isVisible={backgroundPermissionAlert} />
                                            <NewProblemItem
                                                item={PROBLEMS[5]}
                                                isVisible={gpsPermissionAlert} />
                                        </ScrollView>
                                    </View>}
                                <View style={bottomWrapper}>
                                    <GradientButton
                                        title={L('i_understood')}
                                        onPress={onHide}
                                        gradientStyle={{ width: '100%' }} />
                                    <Text
                                        onPress={this.onChatWithTechSupport}
                                        style={techSupport}>
                                        {L('contact_support_via_chat')}
                                    </Text>
                                </View>
                            </>}
                    </View>
                </View>
            </Modal>
        </GestureRecognizer>;
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
    notConfigured: {
        width: 74,
        height: 74,
        marginTop: 30,
    },
    title: {
        fontSize: width / 23,
        fontWeight: '700',
        fontFamily: 'Roboto-Bold',
        color: BLACK_COLOR,
        textAlign: 'center',
        marginTop: 14,
    },
    techSupport: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: GREY_COLOR_1,
        textDecorationLine: 'underline',
    },
    titleWrapper: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    problemsWrapper: {
        flex: 3.5,
        marginBottom: 10,
    },
    bottomWrapper: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    arrowLeft: {
        width: 22,
        height: 22,
        marginLeft: 22,
    },
    back: {
        fontSize: width / 26,
        fontWeight: '500',
        fontFamily: 'Roboto-Medium',
        color: ORANGE_COLOR_1,
        marginLeft: 7,
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
    pinCodeContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 6,
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
    const {

    } = state.controlReducer;

    return {
    };
};

export default connect(mapStateToProps)(KidPhoneProblemsModal);
