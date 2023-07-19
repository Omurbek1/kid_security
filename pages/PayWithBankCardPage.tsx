import React from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    StyleSheet,
    Keyboard,
    Dimensions,
    BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { APIService } from '../Api';
import NavigationService from '../navigation/NavigationService';
import { popupActionCreators } from '../reducers/popupRedux';
import { getHeader } from '../shared/getHeader';
import { L } from '../lang/Lang';
import {
    PhoneNumberInput,
    GradientButton,
    EmailInput,
    BackButton,
} from '../components';
import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const {
    BLACK_COLOR,
    PINK_COLOR_1,
    ORANGE_COLOR_1,
    GREY_COLOR_3,
} = NewColorScheme;

interface PayWithBankCardPageProps {
    navigation: {};
    showPremiumModal: (isPremiumModalVisible: boolean) => void;
};

interface PayWithBankCardPageState {
    phoneNumber: string;
    isPhoneNumberValid: boolean;
    email: string;
    isEmailValid: boolean;
};

class PayWithBankCardPage extends React.Component
    <PayWithBankCardPageProps, PayWithBankCardPageState> {
    static navigationOptions = (props) => {
        const { navigation: { state: { params: { showPremium = true } } } } = props;

        return {
            ...getHeader({ title: L('oplata_with_card'), isOldHeader: false }),
            headerRight: null,
            headerLeft: <BackButton
                onBack={() => NavigationService.back()}
                showPremium={showPremium} />
        };
    };

    state = {
        phoneNumber: '',
        isPhoneNumberValid: true,
        email: '',
        isEmailValid: true,
    };

    async componentDidMount() {
        const email = await AsyncStorage.getItem('PAYMENT_EMAIL');
        const phoneNumber = await AsyncStorage.getItem('PAYMENT_PHONE_NUMBER');

        if (email) this.setState({ email });
        if (phoneNumber) this.setState({ phoneNumber });

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

    onPhoneNumberChange = (phoneNumber: string) => {
        this.setState({
            isPhoneNumberValid: true,
            phoneNumber,
        });
    };

    onPayWithBankCard = async () => {
        const { navigation: { getParam } } = this.props;
        const { phoneNumber, email } = this.state;
        const productId = getParam('productId');
        const phoneNumberToSend = '+7' + phoneNumber.replace(/\D/g, '');
        const backTo = getParam('backTo');

        Keyboard.dismiss();

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (!emailRegex.test(email)) {
            this.setState({ isEmailValid: false });
        };

        if (phoneNumber.length !== 15) {
            this.setState({ isPhoneNumberValid: false });
        };

        if (!emailRegex.test(email) || phoneNumber.length !== 15) {
            return;
        };

        await AsyncStorage.setItem('PAYMENT_EMAIL', email);
        await AsyncStorage.setItem('PAYMENT_PHONE_NUMBER', phoneNumber);

        APIService.buyWithYooKassa(productId, phoneNumberToSend, email)
            .then(res => {
                const { success, orderId = '' } = res;

                if (success) {
                    NavigationService.navigate('YooKassaPayment', { orderId, backTo, productId });
                };
            })
            .catch(err => {
                console.log('Error getting YooKassa orderId', err);
            });
    };

    onEmailChange = (email: string) => {
        this.setState({
            isEmailValid: true,
            email,
        });
    };

    render() {
        const {
            phoneNumber,
            isPhoneNumberValid,
            email,
            isEmailValid,
        } = this.state;
        const { container, title } = styles;
        const gradientColors = phoneNumber.length === 15
            ? [PINK_COLOR_1, ORANGE_COLOR_1] : [GREY_COLOR_3, GREY_COLOR_3];
        const paddingTop = 56 + Constants.statusBarHeight;

        return <KeyboardAvoidingView
            style={[container, { paddingTop }]}
            behavior='height'>
            <View style={{ height: '90%' }}>
                <Text style={title}>{L('dlyoplatikartoi')}</Text>
                <EmailInput
                    email={email}
                    onEmailChange={this.onEmailChange}
                    viewStyle={{ marginBottom: 40 }}
                    isEmailValid={isEmailValid} />
                <PhoneNumberInput
                    phoneNumber={phoneNumber}
                    onPhoneNumberChange={this.onPhoneNumberChange}
                    isPhoneNumberValid={isPhoneNumberValid} />
            </View>
            <GradientButton
                title={L('next')}
                onPress={this.onPayWithBankCard}
                gradientColors={gradientColors} />
        </KeyboardAvoidingView>;
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 21,
        paddingBottom: 21,
    },
    title: {
        fontSize: width / 29.5,
        fontWeight: '400',
        color: BLACK_COLOR,
        marginVertical: 32,
    },
});

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayWithBankCardPage);
