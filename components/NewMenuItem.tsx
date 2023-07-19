import React, { FunctionComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ImageSourcePropType,
    Dimensions,
    ImageStyle,
    TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

interface NewMenuItemProps {
    title: string;
    iconSrc: ImageSourcePropType;
    iconStyle: ImageStyle;
    onPress: () => void;
};

const NewMenuItem: FunctionComponent<NewMenuItemProps> = props => {
    const { title, iconSrc, iconStyle, onPress } = props;
    const { imgWrapper, text, container } = styles;

    return <TouchableOpacity
        onPress={onPress}
        style={container}>
        <View style={imgWrapper}>
            <Image source={iconSrc} style={iconStyle} />
        </View>
        <Text style={text}>{title}</Text>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    imgWrapper: {
        width: width / 4.3,
        height: width / 4.3,
        backgroundColor: 'white',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: '#3D3C3C',
        textAlign: 'center',
        marginTop: 8,
        width: '80%',
    },
    container: {
        width: width / 3,
        alignItems: 'center',
    },
});

export default NewMenuItem;
