import React from 'react';
import { Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from '../components';

const { PINK_COLOR_1, ORANGE_COLOR_1 } = NewColorScheme;

interface ActivatePremiumViewProps {
    gradientColors: string[];
    isFeatureAvailable: boolean;
    onActivate: () => void;
    setIsPremiumViewVisible: () => void;
};

interface ActivatePremiumViewState {
    opacity: Animated.Value;
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

class ActivatePremiumView extends React.Component
    <ActivatePremiumViewProps, ActivatePremiumViewState> {
    state = {
        opacity: new Animated.Value(0),
    };

    render() {
        const { opacity } = this.state;
        const { gradientColors, isFeatureAvailable, onActivate, setIsPremiumViewVisible } = this.props;
        const {
            animatedLinearGradient,
            premiumWrapper,
            activateText,
        } = styles;

        if (!isFeatureAvailable) {
            Animated.timing(opacity, {
                delay: 800,
                duration: 300,
                toValue: 1,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setIsPremiumViewVisible();
                };
            });
        };

        return (
            !isFeatureAvailable &&
            <AnimatedLinearGradient
                colors={[PINK_COLOR_1, ORANGE_COLOR_1]}
                start={[0, 1]}
                end={[1, 0]}
                locations={[0, 1.0]}
                style={[animatedLinearGradient, { opacity }]}>
                <Animated.View style={[premiumWrapper, { opacity }]}>
                    <Text style={activateText}>{L('active_correspondence')}</Text>
                    <GradientButton
                        title={L('active_on')}
                        onPress={onActivate}
                        gradientColors={gradientColors} />
                </Animated.View>
            </AnimatedLinearGradient>
        );
    };
};

const styles = StyleSheet.create({
    animatedLinearGradient: {
        borderRadius: 12,
        position: 'absolute',
        marginTop: 75,
        right: 0,
        left: 0,
    },
    premiumWrapper: {
        height: 154,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 21,
        paddingHorizontal: 41,
        justifyContent: 'space-between',
        margin: 1,
    },
    activateText: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
    },
});

export default ActivatePremiumView;
