import React, { FunctionComponent } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { NewColorScheme } from '../shared/colorScheme';

const { PINK_COLOR_1, ORANGE_COLOR_1 } = NewColorScheme;

interface GradientTextProps {
    style: StyleProp<TextStyle>;
    colors?: string[];
};

const GradientText: FunctionComponent<GradientTextProps> = props => {
    const { style, colors = [PINK_COLOR_1, ORANGE_COLOR_1] } = props;

    return <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
            colors={colors}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0, 1.0]}>
            <Text {...props} style={[style, { opacity: 0 }]} />
        </LinearGradient>
    </MaskedView>;
};

export default GradientText;
