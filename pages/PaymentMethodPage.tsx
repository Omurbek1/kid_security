import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    Image,
    View,
    Dimensions,
    FlatList,
    Modal,
    Platform,
    BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RNIap from 'react-native-iap';
import Constants from 'expo-constants';
import NavigationService from '../navigation/NavigationService';
import { popupActionCreators } from '../reducers/popupRedux';
import { getHeader } from '../shared/getHeader';
import UserPrefs from '../UserPrefs';
import * as IAP from '../purchases/Purchases';
import Rest from '../Rest';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import { APIService } from '../Api';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { CustomProgressBar } from '../Utils';
import { waitForConnection } from '../Helper';
import {
    PaymentMethodField,
    PaymentMethodButton,
    BalancePaymentConfirmationModal,
    BackButton,
} from '../components';
import MyActivityIndicator from '../components/MyActivityIndicator';

const { width, height } = Dimensions.get('window');
const { BLACK_COLOR, GREY_COLOR_2, RED_COLOR } = NewColorScheme;
const { MONTHLY_AND_VOICE } = IAP;

interface PaymentMethodPageProps {
    navigation: {};
    showThanksForMinutesPurchaseModal: (isThanksForMinutesPurchaseModalVisible: boolean) => void;
    showSuccessfulSubscriptionModal: (isSuccessfulSubscriptionModalVisible: boolean) => void;
    getOnlineSoundBalance: any;
    setOnlineSoundBalance: (minutes: number) => void;
    purchaseLiveWire: any;
    showPremiumModal: (isPremiumModalVisible: boolean) => void;
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

interface PaymentMethodPageState {
    isStorePaymentDisabled: boolean;
    verifiedPhoneNumbers: [],
    isProgressBarVisible: boolean;
    isBalancePaymentConfirmationModalVisible: boolean;
    phoneNumberToPay: string;
    isProgress: boolean;
    progressTitle: string;
};

class PaymentMethodPage extends React.Component<PaymentMethodPageProps, PaymentMethodPageState> {
    static navigationOptions = (props) => {
        const { navigation: { state: { params: { showPremium = true } } } } = props;

        return {
            ...getHeader({ title: L('sposob_oplati'), isOldHeader: false }),
            headerRight: null,
            headerLeft: <BackButton
                onBack={() => NavigationService.back()}
                showPremium={showPremium} />
        };
    };

    state = {
        isStorePaymentDisabled: true,
        verifiedPhoneNumbers: null,
        isProgressBarVisible: false,
        isBalancePaymentConfirmationModalVisible: false,
        phoneNumberToPay: '',
        isProgress: false,
        progressTitle: null,
    };

    intervalRefreshCallistoPaymentStatus;

    async componentDidMount() {
        const { navigation: { getParam } } = this.props;
        const productId = getParam('productId');

        if (productId !== MONTHLY_AND_VOICE) {
            APIService.getVerifiedPhoneNumbers()
                .then(res => {
                    if (res) {
                        this.setState({ verifiedPhoneNumbers: res.contracts[0] });
                    };
                })
                .catch(err => console.log('Error getting verified phone numbers', err));
        };

        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    onBackButtonPress = () => {
        const {
            showPremiumModal,
            navigation: { state: { params: { showPremium = true } } },
        } = this.props;

        NavigationService.back();
        showPremium && showPremiumModal(true);

        return true;
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

    clearIntervalRefreshCallistoPaymentStatus = () => {
        this.setState({ isProgressBarVisible: false });
        clearInterval(this.intervalRefreshCallistoPaymentStatus);
    };

    onRefreshCallistoPaymentStatus = (orderId: string) => {
        const { showAlert } = this.props;

        this.intervalRefreshCallistoPaymentStatus =
            setInterval(() => APIService.refreshCallistoPaymentStatus(orderId)
                .then(async res => {
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
                        this.onShowSuccessfulSubscriptionModal(true);
                    } else {
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
                const { order: { extra: { description } } } = res;

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
        const { phoneNumberToPay } = this.state;
        const productId = getParam('productId');

        this.setState({ isProgressBarVisible: true });

        APIService.buyWithCallisto(phoneNumberToPay, productId)
            .then(res => {
                const { order: { extra: { description }, orderId } } = res;

                if (description === 'OK') {
                    this.onGetCallistoPaymentStatus(orderId);
                } else {
                    this.setState({ isProgressBarVisible: false });
                    showAlert(true, L('error'), L('if_try_write_us'), true);
                }
            })
            .catch(err => {
                console.log('Error buying with Callisto', err);
                this.setState({ isProgressBarVisible: false });
                showAlert(true, L('error'), L('if_try_write_us'), true);
            });
    };

    keyExtractor = (_, index: number): string => `${index}`;

    renderVerifiedPhoneNumber = (item: {}) => {
        const { item: { phoneNumber } } = item;
        const a = phoneNumber;
        const phoneNumberChanged = a.slice(0, 2) + ' (' + a.slice(2, 5) + ') '
            + a.slice(5, 8) + '-' + a.slice(8, 10) + '-' + a.slice(10, 12);

        return <PaymentMethodButton
            title={L('oplatasnomera', [phoneNumberChanged])}
            onPress={() => {
                this.setState({
                    phoneNumberToPay: phoneNumber,
                    isBalancePaymentConfirmationModalVisible: true,
                });
            }} />;
    };

    onShowSuccessfulSubscriptionModal = async (isMinutes: boolean) => {
        const {
            showThanksForMinutesPurchaseModal,
            showSuccessfulSubscriptionModal,
            navigation: { getParam },
        } = this.props;
        const backTo = getParam('backTo');

        if (backTo) {
            NavigationService.navigate(backTo);
        };

        showThanksForMinutesPurchaseModal(isMinutes);
        showSuccessfulSubscriptionModal(true);
    };

    onShowHideBalancePaymentConfirmationModal = () => {
        const { isBalancePaymentConfirmationModalVisible } = this.state;

        this.setState({
            isBalancePaymentConfirmationModalVisible:
                !isBalancePaymentConfirmationModalVisible,
        });
    };

    openProgressbar = (title: string) => {
        this.setState({ isProgress: true, progressTitle: title });
    };

    hideProgressbar = () => {
        this.setState({ isProgress: false });
    };

    async onBuyPremium(kind: string) {
        const { navigation: { getParam }, showAlert } = this.props;
        const onHide = getParam('onHide');

        this.openProgressbar(L('processing_purchase'));

        const result = await IAP.buyPremium(this, kind);
        const { purchase, cancelled, error } = result;

        if (error === 'E_ALREADY_OWNED') {
            showAlert(true, L('premium_account'), L('premium_already_purchased'));
            this.hideProgressbar();
            return;
        };

        if (error || cancelled) {
            this.hideProgressbar();

            return;
        };

        const ok = await IAP.verifyPurchase(purchase);

        if (ok) {
            await IAP.tryConsumeProducts(async (purchase) => {
                await RNIap.finishTransaction(purchase).then(() => {
                    console.log('approved IAP Premium', purchase);
                });
            });

            this.hideProgressbar();
            onHide();
            setTimeout(() => this.onShowSuccessfulSubscriptionModal(false), 500);
        } else {
            setTimeout(() => {
                showAlert(
                    true,
                    L('menu_premium'),
                    L('failed_to_proceed_purchase',
                        [error ? ', ' + L('error') + ': ' + error : '']),
                );
            }, 250);
            return;
        };
    };

    async buyMinutes(kind: string, productId: string) {
        this.openProgressbar(L('processing_purchase'));
        const result = await IAP.buyLiveWire(this, kind);
        const { purchase, cancelled, error } = result;
        if (error) {
            this.hideProgressbar();

            return;
        };

        if (cancelled) {
            // TODO: dirty hack for android due to billing bug somewhere in iap native module
            if ('android' === Platform.OS && 'E_UNKNOWN' === error) {
                console.log('RNIap: BUG WORKAROUND: consuming all items...');
                try {
                    await this.consumeAll();
                } catch (e) {
                    console.warn(e);
                };
            };

            this.hideProgressbar();
            return;
        };

        try {
            await this.consumeAll();
            this.onShowSuccessfulSubscriptionModal(productId !== MONTHLY_AND_VOICE);
        } catch (e) {
            console.warn(e);
        };

        this.hideProgressbar();
        return purchase;
    };

    async consumeAll() {
        try {
            const ts = new Date().getTime();
            console.log('RNIap: LIVE: waiting for connection...');
            await waitForConnection(60);
            const ms = new Date().getTime() - ts;
            console.log('RNIap: LIVE: got connection in ' + ms + 'ms');
            Rest.get().debug({ LIVE_connection: ms + 'ms' });
        } catch (e) {
            console.warn('RNIap: LIVE: failed to get connection', e);
            Rest.get().debug({ LIVE_connection: 'timeout' });
        };

        await IAP.tryConsumeProducts(async (purchase) => {
            if (
                purchase.productId === IAP.MIN_30_LIVE_WIRE_PRODUCT.productId ||
                purchase.productId === IAP.MIN_180_LIVE_WIRE_PRODUCT.productId
            ) {
                const approved = await this.approvePurchase(purchase);

                if (approved && purchase.productId === IAP.MIN_30_LIVE_WIRE_PRODUCT.productId) {
                    UserPrefs.setPurchase_30Minutes('');
                };

                if (approved && purchase.productId === IAP.MIN_180_LIVE_WIRE_PRODUCT.productId) {
                    UserPrefs.setPurchase_180Minutes('');
                };

                return approved;
            } else {
                await RNIap.finishTransaction(purchase).then(() => {
                    console.log('approved IAP Wire Promo Sub', purchase);
                });

                return true;
            };
        });

        await this.reloadBalance();
    };

    async approvePurchase(purchase) {
        const { purchaseLiveWire, setOnlineSoundBalance } = this.props;

        let promise = new Promise(async function (resolve, reject) {
            const params = {
                debug: __DEV__ ? true : false,
                purchase,
                products: IAP.MY_PRODUCTS,
            };

            purchaseLiveWire(params, (pr, packet) => {
                console.log(packet);
                const data = packet && packet.data ? packet.data : null;
                if (data && 0 === data.result) {
                    setOnlineSoundBalance(data.balance);
                    return resolve(true);
                }
                return resolve(false);
            });
        });

        return promise;
    };

    render() {
        const {
            isStorePaymentDisabled,
            verifiedPhoneNumbers,
            isProgressBarVisible,
            isBalancePaymentConfirmationModalVisible,
            phoneNumberToPay,
            isProgress,
            progressTitle,
        } = this.state;
        const { navigation: { getParam } } = this.props;
        const {
            container,
            title,
            subtitle,
            simCardIcon,
            notAvailableText,
            plusIcon,
            storeIcon,
            modalContainer,
            activityIndicatorWrapper,
        } = styles;
        const productId = getParam('productId');
        const backTo = getParam('backTo');
        const isSubscription = getParam('isSubscription');
        const kind = getParam('kind');
        const storeIconSrc = isStorePaymentDisabled
            ? require('../img/bank_card_grey.png')
            : require('../img/bank_card_pink.png');
        const paddingTop = 56 + Constants.statusBarHeight;

        return (
            <View style={[container, { paddingTop }]}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}>
                    <Text style={title}>{L('viberite')}</Text>
                    <PaymentMethodField
                        title={L('mobilnii_oplata')}
                        renderIcon={() =>
                            <Image
                                source={require('../img/sim_card.png')}
                                style={simCardIcon}
                                resizeMode='contain' />} />
                    <Text style={subtitle}>{L('oplata_with')}</Text>
                    {verifiedPhoneNumbers &&
                        <FlatList
                            data={verifiedPhoneNumbers}
                            renderItem={this.renderVerifiedPhoneNumber}
                            keyExtractor={this.keyExtractor} />}
                    <PaymentMethodButton
                        title={L('dobavit_nomer')}
                        renderIcon={() =>
                            <Image
                                source={require('../img/plus.png')}
                                style={plusIcon} />}
                        onPress={() =>
                            NavigationService.navigate('AddPhoneNumber', { backTo, productId })} />
                    <PaymentMethodField
                        title={L('bank_card')}
                        renderIcon={() =>
                            <Image
                                source={require('../img/bank_card_pink.png')}
                                style={storeIcon} />}
                        viewStyle={{ marginTop: 60 }} />
                    <Text style={subtitle}>{L('oplata_bank')}</Text>
                    <PaymentMethodButton
                        title={L('bank_with')}
                        onPress={() =>
                            NavigationService.navigate('PayWithBankCard', { productId, backTo, showPremium: false })} />
                    <PaymentMethodField
                        title={L('store_oplata')}
                        renderIcon={() => <Image source={storeIconSrc} style={storeIcon} />}
                        viewStyle={{ marginTop: 60 }}
                        isDisabled={isStorePaymentDisabled} />
                    <PaymentMethodButton
                        title={L('oplatastoreclick')}
                        onPress={() => isSubscription
                            ? this.onBuyPremium(kind)
                            : this.buyMinutes(kind, productId)}
                        style={{ marginBottom: 10 }} />
                    {isStorePaymentDisabled &&
                        <Text style={notAvailableText}>{L('sankcii')}</Text>}
                    <Modal visible={isProgressBarVisible} transparent={true}>
                        <View style={modalContainer}>
                            <View style={activityIndicatorWrapper}>
                                <MyActivityIndicator size='small' />
                            </View>
                        </View>
                    </Modal>
                    <BalancePaymentConfirmationModal
                        isVisible={isBalancePaymentConfirmationModalVisible}
                        onCloseModal={this.onShowHideBalancePaymentConfirmationModal}
                        onPay={() => this.onBuyWithCallisto()}
                        phoneNumber={phoneNumberToPay} />
                    <CustomProgressBar visible={isProgress} title={progressTitle} />
                </ScrollView>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 21,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: width / 21,
        fontWeight: '500',
        color: BLACK_COLOR,
        marginTop: 30,
        marginBottom: 21,
    },
    subtitle: {
        fontSize: width / 34.5,
        fontWeight: '400',
        color: GREY_COLOR_2,
        marginLeft: 32,
        marginTop: 6,
    },
    simCardIcon: {
        width: width / 17,
        height: height / 49,
    },
    notAvailableText: {
        fontSize: width / 34.5,
        fontWeight: '400',
        color: RED_COLOR,
        marginTop: 8,
        marginLeft: 32,
    },
    plusIcon: {
        width: width / 22,
        height: height / 49,
    },
    storeIcon: {
        width: width / 17,
        height: height / 37,
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
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        showThanksForMinutesPurchaseModal: bindActionCreators(popupActionCreators.showThanksForMinutesPurchaseModal, dispatch),
        showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
        getOnlineSoundBalance: bindActionCreators(controlActionCreators.getOnlineSoundBalance, dispatch),
        setOnlineSoundBalance: bindActionCreators(authActionCreators.setOnlineSoundBalance, dispatch),
        purchaseLiveWire: bindActionCreators(controlActionCreators.purchaseLiveWire, dispatch),
        showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
        showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodPage);
