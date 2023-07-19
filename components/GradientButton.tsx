import React, { FunctionComponent } from 'react';
import {
    Text,
    TextStyle,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NewColorScheme } from '../shared/colorScheme';

const { PINK_COLOR_1, ORANGE_COLOR_1 } = NewColorScheme;

interface GradientButtonProps extends TouchableOpacityProps {
    title: string;
    gradientColors?: string[];
    titleStyle?: TextStyle;
    gradientStyle?: ViewStyle;
};

const GradientButton: FunctionComponent<GradientButtonProps> = props => {
    const {
        title,
        gradientColors = [PINK_COLOR_1, ORANGE_COLOR_1],
        titleStyle,
        gradientStyle,
    } = props;
    const { gradient, nextBtn, nextTxt } = styles;

    return <LinearGradient
        colors={gradientColors}
        start={[0, 0]}
        end={[1, 0]}
        locations={[0, 1.0]}
        style={[gradient, gradientStyle]}>
        <TouchableOpacity
            style={nextBtn}
            {...props}>
            <Text style={[nextTxt, titleStyle]}>{title}</Text>
        </TouchableOpacity>
    </LinearGradient>;
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 26,
        height: 48,
    },
    nextBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextTxt: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Roboto-Medium',
        color: '#FFFFFF',
    },
});

export default GradientButton;
