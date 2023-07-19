import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Dimensions,
    Modal,
    ScrollView,
    Linking,
    TouchableOpacity,
    BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Constants from 'expo-constants';
import { APIService } from '../Api';
import { popupActionCreators } from '../reducers/popupRedux';
import { getHeader } from '../shared/getHeader';
import { L } from '../lang/Lang';
import * as IAP from '../purchases/Purchases';
import { NewColorScheme } from '../shared/colorScheme';
import NavigationService from '../navigation/NavigationService';
import { GradientButton, PhoneNumberInput } from '../components';
import MyActivityIndicator from '../components/MyActivityIndicator';

const { width } = Dimensions.get('window');
const { MONTHLY_AND_VOICE } = IAP;
const {
    BLACK_COLOR,
    GREY_COLOR_4,
    PINK_COLOR_1,
    GREY_COLOR_3,
    ORANGE_COLOR_1,
    ORANGE_COLOR_2,
    GREY_COLOR_1,
} = NewColorScheme;
const megafonInfoLink = 'https://moscow.megafon.ru/download/~federal/oferts/oferta_m_platezhi.pdf';
const OPERATORS = [
    {
        title: 'MTS',
        icon: require('../img/operators/mts.png'),
    },
    {
        title: 'Megafon',
        icon: require('../img/operators/megafon.png'),
    },
    {
        title: 'TELE2',
        icon: require('../img/operators/tele2.png'),
    },
    {
        title: 'Yota',
        icon: require('../img/operators/yota.png'),
    },
    {
        title: 'Beeline',
        icon: require('../img/operators/beeline.png'),
    },
];

interface AddPhoneNumberPageProps {
    navigation: {};
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

interface AddPhoneNumberPageState {
    phoneNumber: string;
    isProgressBarVisible: boolean;
    isPhoneNumberValid: boolean;
    operators: [];
};

class AddPhoneNumberPage extends React.Component
    <AddPhoneNumberPageProps, AddPhoneNumberPageState> {
    static navigationOptions = () => {
        return {
            ...getHeader({ title: L('mobilnii_oplata'), isOldHeader: false }),
            headerRight: null,
        };
    };

    state = {
        phoneNumber: '',
        isProgressBarVisible: false,
        isPhoneNumberValid: true,
        operators: null,
    };

    componentDidMount = () => {
        const { navigation: { getParam } } = this.props;
        const productId = getParam('productId');
        const caseUsage = productId === MONTHLY_AND_VOICE ? 'SUB' : 'BUY';

        APIService.getMobileOperators(caseUsage)
            .then(res => {
                const { mobileOperatorList } = res;

                const newList = OPERATORS.filter(item => {
                    const { title } = item;

                    for (let i in mobileOperatorList) {
                        const condition = title.toUpperCase() === mobileOperatorList[i].name;

                        if (condition) {
                            return condition;
                        };
                    };
                });

                this.setState({ operators: newList });
            })
            .catch(err => console.log('Error getting mobile operators list', err));

        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    onBackButtonPress = () => {
        NavigationService.back();

        return true;
    };

    keyExtractor = (_, index: number): string => `${index}`;

    onPhoneNumberChange = (phoneNumber: string) => {
        this.setState({
            isPhoneNumberValid: true,
            phoneNumber,
        });
    };

    onNextPress = () => {
        const { navigation: { getParam }, showAlert } = this.props;
        const { phoneNumber } = this.state;
        const backTo = getParam('backTo');
        const productId = getParam('productId');
        const phoneNumberToVerify = '+7' + phoneNumber.replace(/\D/g, "");

        if (phoneNumber.length !== 15) {
            this.setState({ isPhoneNumberValid: false });
        } else {
            this.setState({ isProgressBarVisible: true });

            if (productId === MONTHLY_AND_VOICE) {
                APIService.createIFreeSubscription(phoneNumberToVerify)
                    .then(res => {
                        const { success, subscription: { errorDescription, statusName, authorizeUrl } } = res;

                        this.setState({ isProgressBarVisible: false });

                        if (success && !errorDescription &&
                            statusName === 'REQUEST_ACCEPTED' && authorizeUrl) {
                            Linking.openURL(authorizeUrl);
                            NavigationService.navigate(backTo);
                        } else {
                            console.log('Error creating ifree subscription', errorDescription, statusName);
                            showAlert(true, L('error'), L('if_try_write_us'), true);
                        };
                    })
                    .catch(err => {
                        console.log('Error creating ifree subscription', err);
                        this.setState({ isProgressBarVisible: false });
                        showAlert(true, L('error'), L('if_try_write_us'), true);
                    });
            } else {
                APIService.startPhoneNumberVerification(phoneNumberToVerify)
                    .then(res => {
                        const { contract: { extra: { description } } } = res;

                        this.setState({ isProgressBarVisible: false });

                        if (description === 'OK') {
                            NavigationService.navigate('PhoneNumberConfirmation',
                                { phoneNumber: phoneNumberToVerify, backTo, productId });
                        } else {
                            showAlert(true, L('error'), L('if_try_write_us'), true);
                        };
                    })
                    .catch(err => {
                        console.log('Error starting phone number verification', err);
                        this.setState({ isProgressBarVisible: false });
                        showAlert(true, L('error'), L('if_try_write_us'), true);
                    });
            };
        };
    };

    render() {
        const { isProgressBarVisible, isPhoneNumberValid, phoneNumber, operators } = this.state;
        const { navigation: { getParam } } = this.props;
        const {
            container,
            title,
            subtitle,
            operatorsContainer,
            operator,
            separator,
            operatorIcon,
            operatorWrapper,
            operatorBtn,
            bottomWrapper,
            operatorContainer,
            bottomContainer,
            modalContainer,
            activityIndicatorWrapper,
            megafonTitle,
            megafonSubtitle,
        } = styles;
        const gradientColors = phoneNumber.length === 15
            ? [PINK_COLOR_1, ORANGE_COLOR_1] : [GREY_COLOR_3, GREY_COLOR_3];
        const paddingTop = 56 + Constants.statusBarHeight;
        const productId = getParam('productId');
        const isMonthlyAndVoice = productId === MONTHLY_AND_VOICE;
        const megafon = OPERATORS[1];

        return (
            <KeyboardAvoidingView
                style={[container, { paddingTop }]}
                behavior='height'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}>
                    <Text style={title}>{L('dobavit_nomer')}</Text>
                    <View style={bottomWrapper}>
                        <PhoneNumberInput
                            onPhoneNumberChange={this.onPhoneNumberChange}
                            phoneNumber={phoneNumber}
                            viewStyle={{ marginTop: width / 11.5 }}
                            isPhoneNumberValid={isPhoneNumberValid} />
                    </View>
                    <Text style={subtitle}>{L('podder_oper')}</Text>
                    <View style={bottomContainer}>
                        <View style={operatorsContainer}>
                            {isMonthlyAndVoice
                                ? <View style={operatorBtn}>
                                    <View style={operatorContainer}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(megafonInfoLink)}>
                                                <Image
                                                    source={megafon.icon}
                                                    style={[operatorIcon, { bottom: 5 }]} />
                                            </TouchableOpacity>
                                            <View style={{ width: '75%' }}>
                                                <Text style={megafonTitle}>{megafon.title}</Text>
                                                <Text style={megafonSubtitle}>
                                                    {L('for_megafon')}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={separator} />
                                </View>
                                : <FlatList
                                    data={operators}
                                    keyExtractor={this.keyExtractor}
                                    renderItem={(item: {}) => {
                                        const { index, item: { title, icon } } = item;
                                        const btnStyle = { marginTop: index !== 0 ? 18 : 0 };
                                        const isSeparatorVisible = operators.length > 1;

                                        return <View style={[operatorBtn, btnStyle]}>
                                            <View style={operatorContainer}>
                                                <View style={operatorWrapper}>
                                                    <Image source={icon} style={operatorIcon} />
                                                    <Text style={operator}>{title}</Text>
                                                </View>
                                            </View>
                                            {isSeparatorVisible && <View style={separator} />}
                                        </View>
                                    }}
                                    showsVerticalScrollIndicator={false} />}
                        </View>
                    </View>
                    <GradientButton
                        title={L('next')}
                        onPress={this.onNextPress}
                        gradientColors={gradientColors}
                        gradientStyle={{ marginTop: width / 14, marginBottom: '7%' }} />
                    <Modal visible={isProgressBarVisible} transparent={true}>
                        <View style={modalContainer}>
                            <View style={activityIndicatorWrapper}>
                                <MyActivityIndicator size='small' />
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginTop: width / 14,
    },
    subtitle: {
        fontSize: width / 26,
        fontWeight: '500',
        color: GREY_COLOR_1,
        marginBottom: 10,
    },
    operatorsContainer: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: ORANGE_COLOR_2,
        paddingHorizontal: 14,
        paddingTop: 20,
        paddingBottom: 27,
    },
    operator: {
        fontSize: width / 29.5,
        fontWeight: '400',
        color: BLACK_COLOR,
        marginVertical: width / 26,
    },
    separator: {
        borderWidth: 0.5,
        borderColor: GREY_COLOR_4,
    },
    operatorIcon: {
        width: 60,
        height: 29,
        marginRight: 16,
    },
    operatorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    operatorBtn: {
        paddingLeft: 12,
        paddingRight: 17,
        borderRadius: 25,
    },
    bottomWrapper: {
        justifyContent: 'space-between',
        marginBottom: width / 10.5,
    },
    operatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'space-between',
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
    megafonTitle: {
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
        marginBottom: 5,
    },
    megafonSubtitle: {
        fontSize: width / 34.5,
        fontWeight: '400',
        color: '#000000',
        marginTop: 2,
    },
});

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPhoneNumberPage);
