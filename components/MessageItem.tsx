import React, { FunctionComponent } from 'react';
import { Text, View, StyleSheet, Image, ViewStyle, Dimensions } from 'react-native';
import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { GREY_COLOR_2 } = NewColorScheme;

interface MessageItemProps {
    name: string;
    message: string;
    time: string;
    viewStyle: ViewStyle;
    isPhotoVisible: boolean;
    isMarginVisible: boolean;
};

const MessageItem: FunctionComponent<MessageItemProps> = props => {
    const { name, message, time, viewStyle, isPhotoVisible, isMarginVisible } = props;
    const {
        textWrapper,
        messageStyle,
        timeStyle,
        messageName,
        image,
        container,
    } = styles;

    return (
        <View style={container}>
            {isPhotoVisible ?
                <Image source={require('../img/user_chat_photo_placeholder.png')} style={image} />
                : (isMarginVisible && <View style={image} />)}
            <View style={[textWrapper,
                { maxWidth: isPhotoVisible || isMarginVisible ? width - 83 : width - 42 },
                viewStyle]}>
                {name && <Text style={messageName}>{name}</Text>}
                <Text style={messageStyle}>{message}</Text>
                <Text style={timeStyle}>{time}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textWrapper: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        padding: 15,
        minWidth: 85,
    },
    messageStyle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        marginRight: 40,
    },
    timeStyle: {
        fontSize: 12,
        fontWeight: '400',
        color: '#727272',
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10,
        right: 15,
    },
    messageName: {
        fontSize: 12,
        fontWeight: '400',
        color: GREY_COLOR_2,
    },
    image: {
        width: 34,
        height: 34,
        marginRight: 7,
        alignSelf: 'flex-end',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default MessageItem;
