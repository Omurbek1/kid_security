import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Modal,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Constants from 'expo-constants';
import { APIService } from '../Api';
import NavigationService from '../navigation/NavigationService';
import { popupActionCreators } from '../reducers/popupRedux';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { getHeader } from '../shared/getHeader';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import { PinCodeView, Countdown, PinCodeNotReceivedModal } from '../components';
import MyActivityIndicator from '../components/MyActivityIndicator';

const { width } = Dimensions.get('window');
const { BLACK_COLOR, GREY_COLOR_2 } = NewColorScheme;

interface PhoneNumberConfirmationPageProps {
    navigation: {};
    showThanksForMinutesPurchaseModal: (isThanksForMinutesPurchaseModalVisible: boolean) => void;
    objects: {};
    userId: number;
    showSuccessfulSubscriptionModal: (isSuccessfulSubscriptionModalVisible: boolean) => void;
    getOnlineSoundBalance: any;
    setOnlineSoundBalance: (minutes: number) => void;
    showAlert: (
        isVisible: boolean,
        title: string,
        subtitle: string,
        isSupportVisible?: boolean,
        supportText?: string,
        actionTitle?: string,
        actions?: [],
    ) => void;
};

interface PhoneNumberConfirmationPageState {
    isCountdownCompleted: boolean;
    counterId: number;
    isPinCodeCorrect: boolean;
    isPinCodeNotReceivedModalVisible: boolean;
    isProgressBarVisible: boolean,
};

class PhoneNumberConfirmationPage extends React.Component
    <PhoneNumberConfirmationPageProps, PhoneNumberConfirmationPageState> {
    static navigationOptions = () => {
        return {
            ...getHeader({ title: L('mobilnii_oplata'), isOldHeader: false }),
            headerRight: null,
        };
    };

    state = {
        isCountdownCompleted: false,
        counterId: 0,
        isPinCodeCorrect: true,
        isPinCodeNotReceivedModalVisible: false,
        isProgressBarVisible: false,
    };

    intervalRefreshCallistoPaymentStatus;

    onShowSuccessfulSubscriptionModal = async () => {
        const {
            showThanksForMinutesPurchaseModal,
            showSuccessfulSubscriptionModal,
            navigation: { getParam },
        } = this.props;
        const backTo = getParam('backTo');

        if (backTo) {
            NavigationService.navigate(backTo);
        };

        showThanksForMinutesPurchaseModal(true);
        showSuccessfulSubscriptionModal(true);
    };

    onCountdownCompleted = () => {
        this.setState({ isCountdownCompleted: true });
    };

    onRestartCountdown = () => {
        const { navigation: { getParam }, showAlert } = this.props;
        const { counterId } = this.state;

        const phoneNumber = getParam('phoneNumber');

        APIService.startPhoneNumberVerification(phoneNumber)
            .then(res => {
                const { contract: { extra: { description } } } = res;

                if (description === 'OK') {
                    this.setState({
                        isCountdownCompleted: false,
                        counterId: counterId + 1,
                    });
                } else {
                    showAlert(true, L('error'), L('if_try_write_us'), true);
                };
            })
            .catch(err => {
                console.log('Error sending verification code again', err);
                showAlert(true, L('error'), L('if_try_write_us'), true);
            });
    };

    clearIntervalRefreshCallistoPaymentStatus = () => {
        this.setState({ isProgressBarVisible: false });
        clearInterval(this.intervalRefreshCallistoPaymentStatus);
    };

    async reloadBalance() {
        const { getOnlineSoundBalance, setOnlineSoundBalance } = this.props;

        let promise = new Promise(async function (resolve, reject) {
            getOnlineSoundBalance((pr, packet) => {
                const data = packet && packet.data ? packet.data : null;
                if (data && 0 === data.result) {
                    setOnlineSoundBalance(data.balance);
                };

                resolve();
            });
        });

        return promise;
    };

    onRefreshCallistoPaymentStatus = (orderId: string) => {
        const { navigation: { getParam }, showAlert } = this.props;
        const backTo = getParam('backTo');

        this.intervalRefreshCallistoPaymentStatus =
            setInterval(() => APIService.refreshCallistoPaymentStatus(orderId)
                .then(res => {
                    const {
                        order:
                        { extra: { description },
                            paymentStatus,
                            paymentResult,
                        },
                    } = res;

                    if (description === 'OK' &&
                        paymentStatus === 'PAID' && paymentResult === 'SUCCESS') {
                        this.clearIntervalRefreshCallistoPaymentStatus();
                        this.reloadBalance();
                        this.setState({ isProgressBarVisible: false });
                        this.onShowSuccessfulSubscriptionModal();
                    } else {
                        if (backTo) {
                            NavigationService.navigate(backTo);
                        };

                        this.clearIntervalRefreshCallistoPaymentStatus();
                        this.setState({ isProgressBarVisible: false });
                        showAlert(true, L('error'), L('if_try_write_us'), true);
                    };
                })
                .catch(err => {
                    console.log('Error refreshing Callisto payment status', err);
                    this.clearIntervalRefreshCallistoPaymentStatus();
                    this.setState({ isProgressBarVisible: false });
                    showAlert(true, L('error'), L('if_try_write_us'), true);
                }), 5000);

        setTimeout(this.clearIntervalRefreshCallistoPaymentStatus, 30000);
    };

    onGetCallistoPaymentStatus = (orderId: string) => {
        const { showAlert } = this.props;

        APIService.getCallistoPaymentStatus(orderId)
            .then(res => {
                const { order: { extra: { description }, orderId } } = res;

                if (description === 'OK') {
                    this.onRefreshCallistoPaymentStatus(orderId);
                } else {
                    this.setState({ isProgressBarVisible: false });
                    showAlert(true, L('error'), L('if_try_write_us'), true);
                };
            })
            .catch(err => {
                console.log('Error getting Callisto payment status', err);
                this.setState({ isProgressBarVisible: false });
                showAlert(true, L('error'), L('if_try_write_us'), true);
            });
    };

    onBuyWithCallisto = () => {
        const { navigation: { getParam }, showAlert } = this.props;

        const phoneNumber = getParam('phoneNumber');
        const productId = getParam('productId');

        APIService.buyWithCallisto(phoneNumber, productId)
            .then(res => {
                const { order: { extra: { description }, orderId } } = res;

                if (description === 'OK') {
                    this.onGetCallistoPaymentStatus(orderId);
                } else {
                    this.setState({ isProgressBarVisible: false });
                    showAlert(true, L('error'), L('if_try_write_us'), true);
                };
            })
            .catch(err => {
                console.log('Error buying with Callisto', err);
                this.setState({ isProgressBarVisible: false });
                showAlert(true, L('error'), L('if_try_write_us'), true);
            });
    };

    onVerifyPinCodeAndPay = (pinCode: string) => {
        const { navigation: { getParam }, showAlert } = this.props;

        const phoneNumber = getParam('phoneNumber');

        this.setState({ isProgressBarVisible: true });

        APIService.finishPhoneNumberVerification(phoneNumber, pinCode)
            .then(async (res) => {
                const { contract: { extra: { description } } } = res;

                if (description === 'OK') {
                    this.onBuyWithCallisto();
                } else if (description === 'Business_CustomerContractNotAuthorized') {
                    this.setState({ isPinCodeCorrect: false, isProgressBarVisible: false });
                } else {
                    this.setState({ isProgressBarVisible: false });
                    showAlert(true, L('error'), L('if_try_write_us'), true);
                };
            })
            .catch(err => {
                console.log('Error finishing phone number verification', err);
                this.setState({ isProgressBarVisible: false });
                showAlert(true, L('error'), L('if_try_write_us'), true);
            });
    };

    clearPinCode = () => {
        this.setState({ isPinCodeCorrect: true });
    };

    onShowHideIsPinCodeNotReceivedModal = () => {
        const { isPinCodeNotReceivedModalVisible } = this.state;

        this.setState({ isPinCodeNotReceivedModalVisible: !isPinCodeNotReceivedModalVisible });
    };

    render() {
        const { navigation: { getParam }, objects, userId } = this.props;
        const {
            isCountdownCompleted,
            counterId,
            isPinCodeCorrect,
            isPinCodeNotReceivedModalVisible,
            isProgressBarVisible,
        } = this.state;
        const {
            container,
            title,
            subtitle,
            timer,
            modalContainer,
            activityIndicatorWrapper,
        } = styles;
        const phoneNumber = getParam('phoneNumber');
        const paddingTop = 56 + Constants.statusBarHeight;
        const a = phoneNumber;
        const phoneNumberChanged = a.slice(0, 2) + ' (' + a.slice(2, 5) + ') '
            + a.slice(5, 8) + '-' + a.slice(8, 10) + '-' + a.slice(10, 12);

        return (
            <View style={[container, { paddingTop }]}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 21 }}>
                        <Text style={title}>{L('podtverjdenie_nomera')}</Text>
                        <Text style={subtitle}>{L('podverdite', [phoneNumberChanged])}</Text>
                    </View>
                    <Countdown
                        until={60}
                        onFinish={this.onCountdownCompleted}
                        timeToShow={['M', 'S']}
                        id={counterId}
                        style={timer} />
                    <PinCodeView
                        isCountdownCompleted={isCountdownCompleted}
                        onRestartCountdown={this.onRestartCountdown}
                        onVerifyPinCodeAndPay={this.onVerifyPinCodeAndPay}
                        isPinCodeCorrect={isPinCodeCorrect}
                        clearPinCode={this.clearPinCode}
                        onDidNotReceivePinCode={this.onShowHideIsPinCodeNotReceivedModal} />
                    <PinCodeNotReceivedModal
                        isVisible={isPinCodeNotReceivedModalVisible}
                        onHide={this.onShowHideIsPinCodeNotReceivedModal}
                        objects={objects}
                        userId={userId} />
                </ScrollView>
                <Modal visible={isProgressBarVisible} transparent={true}>
                    <View style={modalContainer}>
                        <View style={activityIndicatorWrapper}>
                            <MyActivityIndicator size='small' />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: width / 21,
        fontWeight: '500',
        color: BLACK_COLOR,
        marginTop: 30,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: width / 29.5,
        fontWeight: '400',
        color: BLACK_COLOR,
    },
    timer: {
        fontSize: width / 26,
        fontWeight: '500',
        color: GREY_COLOR_2,
        marginVertical: 18,
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicatorWrapper: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const mapStateToProps = (state) => {
    const { controlReducer, authReducer } = state;
    const { objects } = controlReducer;
    const { userId } = authReducer;

    return { objects, userId };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showThanksForMinutesPurchaseModal: bindActionCreators(popupActionCreators.showThanksForMinutesPurchaseModal, dispatch),
        showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
        getOnlineSoundBalance: bindActionCreators(controlActionCreators.getOnlineSoundBalance, dispatch),
        setOnlineSoundBalance: bindActionCreators(authActionCreators.setOnlineSoundBalance, dispatch),
        showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberConfirmationPage);
