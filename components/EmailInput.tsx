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

interface EmailInputProps {
    email: string;
    onEmailChange: (email: string) => void;
    viewStyle?: ViewStyle;
    isEmailValid?: boolean;
};

class EmailInput extends React.Component<EmailInputProps> {
    render() {
        const {
            email,
            onEmailChange,
            viewStyle = {},
            isEmailValid,
        } = this.props;
        const { inputText, enterText, dontExist } = styles;
        const inputBorderStyle = !isEmailValid && { borderColor: RED_COLOR };

        return <View style={viewStyle}>
            <Text style={enterText}>{L('vveditemail')}</Text>
            <TextInput
                keyboardType='email-address'
                value={email}
                placeholder='e-mail'
                placeholderTextColor={GREY_COLOR_3}
                style={[inputText, inputBorderStyle]}
                onChangeText={onEmailChange} />
            {!isEmailValid && <Text style={dontExist}>{L('mailnevernii')}</Text>}
        </View>
    };
};

const styles = StyleSheet.create({
    inputText: {
        height: 36,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: ORANGE_COLOR_1,
        paddingHorizontal: 12,
        width: '100%',
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
        paddingVertical: 0,
    },
    enterText: {
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
        marginBottom: 10,
    },
    dontExist: {
        fontSize: width / 34.5,
        fontWeight: '400',
        color: RED_COLOR,
        marginTop: 2,
    },
});

export default EmailInput;
