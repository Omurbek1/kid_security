import React, { FunctionComponent } from 'react';
import {
    StyleSheet,
    View,
    TextStyle,
    ViewStyle,
    Dimensions,
    Text,
} from 'react-native';
import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { PINK_COLOR_1, ORANGE_COLOR_1, GREY_COLOR_2 } = NewColorScheme;

interface PaymentMethodFieldProps {
    title: string;
    renderIcon: () => JSX.Element;
    titleStyle?: TextStyle;
    viewStyle?: ViewStyle;
    isDisabled?: boolean;
};

const PaymentMethodField: FunctionComponent<PaymentMethodFieldProps> = props => {
    const { title, renderIcon, titleStyle, viewStyle, isDisabled } = props;
    const { container, text } = styles;

    return (
        <View style={[container, viewStyle]}>
            {renderIcon && renderIcon()}
            <Text style={[text, titleStyle,
                { color: isDisabled ? GREY_COLOR_2 : PINK_COLOR_1 }]}>
                {title}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: width / 26,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default PaymentMethodField;
