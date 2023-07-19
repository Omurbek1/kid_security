import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import { L } from '@lang';

import { GradientButton } from '../components';
import { NewColorScheme } from '../shared/colorScheme';

const { width, height } = Dimensions.get('window');
const {
    ORANGE_COLOR_2,
    RED_COLOR,
    BLACK_COLOR,
    GREY_COLOR_1,
    GREY_COLOR_3,
    PINK_COLOR_1,
    ORANGE_COLOR_1,
} = NewColorScheme;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'clear'];
const PIN_CODE = [0, 1, 2, 3, 4, 5];

interface PinCodeViewProps {
    isCountdownCompleted: boolean;
    onRestartCountdown: () => void;
    onVerifyPinCodeAndPay: (pinCode: string) => void;
    isPinCodeCorrect: boolean;
    clearPinCode: () => void;
    onDidNotReceivePinCode: () => void;
};

interface PinCodeViewState {
    pinCode: string;
    activeDigit: number;
    clearBtnPressed: boolean;
};

class PinCodeView extends React.Component<PinCodeViewProps, PinCodeViewState> {
    state = {
        pinCode: '',
        activeDigit: null,
        clearBtnPressed: false,
    };

    onChangePinCode = (digit: number) => {
        const { pinCode } = this.state;

        this.setState({ activeDigit: digit });

        if (pinCode.length < 6) {
            this.setState({ pinCode: pinCode + digit });
        };

        setTimeout(() => this.setState({ activeDigit: null }), 200);
    };

    onRemoveDigit = () => {
        const { clearPinCode } = this.props;
        const { pinCode } = this.state;

        if (clearPinCode) clearPinCode();

        if (pinCode.length !== 0) {
            this.setState({
                clearBtnPressed: true,
                pinCode: pinCode.slice(0, -1),
            });
        };

        setTimeout(() => this.setState({ clearBtnPressed: false }), 200);
    };

    keyExtractor = (_, index: number): string => `${index}`;

    render() {
        const {
            isCountdownCompleted,
            onRestartCountdown,
            isPinCodeCorrect,
            onVerifyPinCodeAndPay,
            onDidNotReceivePinCode,
        } = this.props;
        const {
            pinCode,
            activeDigit,
            clearBtnPressed,
        } = this.state;
        const {
            input,
            container,
            incorrect,
            sendAgain,
            noCode,
            clear,
            digitsRow,
            digitStyle,
            digitBtn,
            codeDigitStyle,
            gradientStyle,
            codeWrapper,
        } = styles;
        const inputStyle = [input,
            !isPinCodeCorrect && { borderWidth: 1, borderColor: RED_COLOR }];
        const isPaymentDisabled = pinCode.length < 6 || !isPinCodeCorrect;
        const gradientColors = !isPaymentDisabled
            ? [PINK_COLOR_1, ORANGE_COLOR_1] : [GREY_COLOR_3, GREY_COLOR_3];
        const focusedDigitStyle =
            { borderRadius: 30, borderWidth: 1, borderColor: ORANGE_COLOR_2 };

        const getCodeDigit = (index: number) => {
            let digit = '';

            switch (index) {
                case 0:
                    digit = pinCode && pinCode[0];
                    break;
                case 1:
                    digit = pinCode && pinCode.length >= 2 && pinCode[1];
                    break;
                case 2:
                    digit = pinCode && pinCode.length >= 3 && pinCode[2];
                    break;
                case 3:
                    digit = pinCode && pinCode.length >= 4 && pinCode[3];
                    break;
                case 4:
                    digit = pinCode && pinCode.length >= 5 && pinCode[4];
                    break;
                case 5:
                    digit = pinCode && pinCode.length === 6 && pinCode[5];
                    break;
                default:
                    break;
            };

            return digit;
        };

        const renderDigit = (item: {}) => {
            const digit = item.item;

            return <TouchableOpacity
                style={[digitBtn, (activeDigit === digit ||
                    (clearBtnPressed && digit === 'clear')) && focusedDigitStyle]}
                disabled={digit === ''}
                onPress={() => digit === 'clear'
                    ? this.onRemoveDigit() : this.onChangePinCode(digit)}>
                {digit === 'clear'
                    ? <Image
                        source={require('../img/clear.png')}
                        style={clear} />
                    : <Text style={digitStyle}>{digit}</Text>}
            </TouchableOpacity>;
        };

        const renderCodeDigit = (item: {}) => {
            const { index } = item;

            return <View style={inputStyle}>
                <Text style={codeDigitStyle}>{getCodeDigit(index)}</Text>
            </View>;
        };

        return (
            <View style={container}>
                <FlatList
                    data={PIN_CODE}
                    keyExtractor={this.keyExtractor}
                    renderItem={renderCodeDigit}
                    contentContainerStyle={codeWrapper}
                    style={{ flexGrow: 0 }}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false} />
                <Text style={incorrect}>{!isPinCodeCorrect ? L('kode_not') : ''}</Text>
                <Text
                    onPress={onRestartCountdown}
                    style={sendAgain}>
                    {isCountdownCompleted ? L('send_code_try') : ''}
                </Text>
                <GradientButton
                    title={L('payment')}
                    disabled={isPaymentDisabled}
                    gradientStyle={gradientStyle}
                    gradientColors={gradientColors}
                    onPress={() => onVerifyPinCodeAndPay(pinCode)} />
                <Text style={noCode} onPress={onDidNotReceivePinCode}>{L('notcode')}</Text>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={DIGITS}
                    renderItem={renderDigit}
                    numColumns={3}
                    columnWrapperStyle={digitsRow}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false} />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    input: {
        width: width / 8,
        height: height / 14,
        borderRadius: 10,
        backgroundColor: ORANGE_COLOR_2,
        marginRight: width / 41,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        marginBottom: 10,
    },
    incorrect: {
        fontSize: width / 34.5,
        fontWeight: '400',
        color: RED_COLOR,
        marginTop: 8,
        textAlign: 'center',
    },
    sendAgain: {
        fontSize: width / 29.5,
        fontWeight: '400',
        color: GREY_COLOR_1,
        textAlign: 'center',
        marginTop: 30,
    },
    noCode: {
        fontSize: width / 29.5,
        fontWeight: '500',
        color: GREY_COLOR_1,
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: 'center',
    },
    clear: {
        width: 29,
        height: 17,
    },
    digitsRow: {
        width: '60%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    digitStyle: {
        fontSize: width / 14,
        fontWeight: '300',
        color: GREY_COLOR_1,
    },
    digitBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        paddingHorizontal: 21,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    codeDigitStyle: {
        fontSize: width / 14,
        fontWeight: '700',
        color: BLACK_COLOR,
        textAlign: 'center',
    },
    gradientStyle: {
        width: 162,
        marginVertical: width / 16.5,
        alignSelf: 'center',
    },
    codeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default PinCodeView;
