import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    ImageProps,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface MessengerItemProps {
    imgSource: ImageProps;
    onPress: () => void;
    logo: ImageProps;
};

class MessengerItem extends React.Component<MessengerItemProps> {
    render() {
        const { imgSource, onPress, logo } = this.props;
        const { messengerImageWrapper, messengerBtn, messenger } = styles;

        return (
            <ImageBackground source={imgSource} style={messengerImageWrapper} resizeMode='contain'>
                <TouchableOpacity
                    style={messengerBtn}
                    onPress={onPress}>
                    <Image source={logo} style={messenger} />
                </TouchableOpacity>
            </ImageBackground>
        );
    };
};

const styles = StyleSheet.create({
    messengerImageWrapper: {
        height: 68,
        width: '100%',
        marginBottom: height / 29,
    },
    messengerBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messenger: {
        width: width / 9,
        height: width / 9,
        marginRight: 3,
    },
});

export default MessengerItem;
