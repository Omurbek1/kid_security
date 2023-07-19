import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    ViewStyle,
} from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const {
    GREY_COLOR_3,
    ORANGE_COLOR_1,
    BLACK_COLOR,
    RED_COLOR,
} = NewColorScheme;

interface PhoneNumberInputProps {
    onPhoneNumberChange: (phoneNumber: string) => void;
    isPhoneNumberValid: boolean;
    phoneNumber: string;
    viewStyle?: ViewStyle;
};

class PhoneNumberInput extends React.Component<PhoneNumberInputProps> {
    onPhoneNumberChange = (value: string) => {
        const { onPhoneNumberChange } = this.props;

        let phoneNumber = '';
        let cleaned = ('' + value).replace(/\D/g, '');
        for (let i = 0; i < cleaned.length; i++) {
            if (i === 0) {
                phoneNumber = '(';
            } else if (i === 3) {
                phoneNumber = phoneNumber + ') ';
            } else if (i === 6) {
                phoneNumber = phoneNumber + '-';
            } else if (i === 8) {
                phoneNumber = phoneNumber + '-';
            };

            phoneNumber = phoneNumber + cleaned[i];
        };

        onPhoneNumberChange(phoneNumber);
    };

    render() {
        const {
            isPhoneNumberValid,
            phoneNumber,
            viewStyle = {},
        } = this.props;
        const { input, numbers, dontExist, inputText, enterText } = styles;
        const inputBorderStyle = !isPhoneNumberValid && { borderColor: RED_COLOR };
        const doesntExist = L('not_true_number');
        const noSuchNumberText = doesntExist.charAt(0).toUpperCase() + doesntExist.slice(1);

        return <View style={viewStyle}>
            <Text style={enterText}>
                {L('input_number_belarus')}
            </Text>
            <View style={[input, inputBorderStyle]}>
                <Text style={numbers}>+ 7 </Text>
                <TextInput
                    keyboardType='phone-pad'
                    value={phoneNumber}
                    placeholder='(___) ___-__-__'
                    placeholderTextColor={GREY_COLOR_3}
                    style={inputText}
                    onChangeText={this.onPhoneNumberChange}
                    maxLength={15} />
            </View>
            {!isPhoneNumberValid && <Text style={dontExist}>{noSuchNumberText}</Text>}
        </View>
    };
};

const styles = StyleSheet.create({
    input: {
        height: 36,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: ORANGE_COLOR_1,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
    },
    numbers: {
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
    },
    dontExist: {
        fontSize: width / 34.5,
        fontWeight: '400',
        color: RED_COLOR,
        marginTop: 2,
    },
    inputText: {
        width: '90%',
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
        padding: 0,
    },
    enterText: {
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
        marginBottom: 10,
    },
});

export default PhoneNumberInput;
