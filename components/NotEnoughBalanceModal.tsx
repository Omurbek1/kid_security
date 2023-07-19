import React, { FunctionComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    Dimensions,
} from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface NotEnoughBalanceModalProps {
    onCloseModal: () => void;
    isVisible: boolean;
};

const NotEnoughBalanceModal: FunctionComponent<NotEnoughBalanceModalProps> = props => {
    const { onCloseModal, isVisible } = props;
    const {
        container,
        wrapper,
        closeBtn,
        closeImg,
        mediumWrapper,
        title,
        subtitle,
        image,
    } = styles;

    return (
        <Modal visible={isVisible} transparent={true}>
            <View style={container}>
                <View style={wrapper}>
                    <TouchableOpacity onPress={onCloseModal} style={closeBtn}>
                        <Image source={require('../img/close_black.png')} style={closeImg} />
                    </TouchableOpacity>
                    <View style={mediumWrapper}>
                        <Image source={require('../img/not_enough_balance.png')} style={image} />
                        <Text style={title}>{L('net_balansa')}</Text>
                        <Text style={subtitle}>{L('try_balanse_pul')}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 34,
    },
    wrapper: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    closeBtn: {
        alignSelf: 'flex-end',
        paddingTop: 25,
        paddingBottom: 15,
        paddingHorizontal: 23,
        width: '50%',
    },
    closeImg: {
        width: 16,
        height: 16,
        alignSelf: 'flex-end',
    },
    mediumWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 70,
    },
    title: {
        fontSize: width / 23,
        fontWeight: '700',
        color: BLACK_COLOR,
        textAlign: 'center',
        marginBottom: 28,
    },
    subtitle: {
        fontSize: width / 29.5,
        fontWeight: '400',
        color: BLACK_COLOR,
        textAlign: 'center',
        marginBottom: 56,
    },
    image: {
        width: width / 3,
        height: width / 3,
        marginBottom: 30,
    },
});

export default NotEnoughBalanceModal;
