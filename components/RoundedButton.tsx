import React, { FunctionComponent } from 'react';
import {
    TouchableOpacity,
    Text,
    TouchableOpacityProps,
    StyleSheet,
    TextStyle,
    Dimensions,
} from 'react-native';
import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { GREY_COLOR_3, BLACK_COLOR } = NewColorScheme;

interface RoundedButtonProps {
    title: string;
    buttonStyle?: TouchableOpacityProps;
    textStyle?: TextStyle;
    onPress: () => void;
};

const RoundedButton: FunctionComponent<RoundedButtonProps> = props => {
    const { title, buttonStyle, textStyle, onPress } = props;
    const { btn, text } = styles;

    return <TouchableOpacity onPress={onPress} style={[btn, buttonStyle]}>
        <Text style={[text, textStyle]}>{title}</Text>
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    btn: {
        width: '41.5%',
        borderRadius: 26,
        height: width / 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: GREY_COLOR_3,
    },
    text: {
        fontSize: width / 26,
        fontWeight: '500',
        fontFamily: 'Roboto-Medium',
        color: BLACK_COLOR,
    },
});

export default RoundedButton;
