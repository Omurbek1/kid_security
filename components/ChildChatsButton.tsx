import React, { FunctionComponent } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

interface ChildChatsButtonProps {
    onPress: () => void;
};

const ChildChatsButton: FunctionComponent<ChildChatsButtonProps> = props => {
    const { onPress } = props;
    const { chatsBtn, image } = styles;

    return (
        <TouchableOpacity style={chatsBtn} onPress={onPress}>
            <Image
                source={require('../img/chats.png')}
                style={image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chatsBtn: {
        alignSelf: 'flex-end',
    },
    image: {
        width: 55,
        height: 55,
        marginLeft: 5,
    },
});

export default ChildChatsButton;
