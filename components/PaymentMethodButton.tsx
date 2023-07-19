import React, { FunctionComponent } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    ViewStyle,
} from 'react-native';
import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR, ORANGE_COLOR_1 } = NewColorScheme;

interface PaymentMethodButtonProps {
    title: string;
    renderIcon?: () => JSX.Element;
    onPress: () => void;
    style?: ViewStyle;
};

const PaymentMethodButton: FunctionComponent<PaymentMethodButtonProps> = props => {
    const { title, renderIcon, onPress, style } = props;
    const { container, text } = styles;

    return (
        <TouchableOpacity style={[container, style]} onPress={onPress}>
            <Text style={text}>{title}</Text>
            {renderIcon && renderIcon()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 10,
        padding: 13,
        borderWidth: 1,
        borderColor: ORANGE_COLOR_1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginLeft: 32,
    },
    text: {
        fontSize: width / 29.5,
        fontWeight: '400',
        color: BLACK_COLOR,
        textAlign: 'left',
    },
});

export default PaymentMethodButton;
