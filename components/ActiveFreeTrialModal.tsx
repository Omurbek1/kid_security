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

const { width, height } = Dimensions.get('window');
const { BLACK_COLOR, PINK_COLOR_1 } = NewColorScheme;

interface ActiveFreeTrialModalProps {
    onClose: () => void;
    isVisible: boolean;
};

const ActiveFreeTrialModal: FunctionComponent<ActiveFreeTrialModalProps> = props => {
    const { onClose, isVisible } = props;
    const {
        container,
        wrapper,
        closeBtn,
        closeImg,
        image,
        title,
        bottomText,
        subtitleTopText,
        subtitleBottomText,
    } = styles;

    return (
        <Modal visible={isVisible} transparent={true}>
            <View style={container}>
                <View style={wrapper}>
                    <TouchableOpacity onPress={onClose} style={closeBtn}>
                        <Image source={require('../img/close_black.png')} style={closeImg} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={title}>{L('congrats')}</Text>
                        <Image
                            source={require('../img/free_trial_active.png')}
                            style={image} />
                        <Text style={subtitleTopText}>{L('vi_podkluchili')}</Text>
                        <Text style={subtitleBottomText}>{L('premium_acc')}</Text>
                        <Text style={bottomText}>{L('vam_dostupni')}</Text>
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
    },
    wrapper: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        width: '85%',
    },
    closeBtn: {
        alignSelf: 'flex-end',
        paddingTop: 20,
        paddingBottom: 6,
        paddingHorizontal: 20,
        width: '20%',
    },
    closeImg: {
        width: 16,
        height: 16,
        alignSelf: 'flex-end',
    },
    image: {
        width: width / 3,
        height: height / 5.5,
        marginVertical: 10,
    },
    title: {
        fontSize: width / 21,
        fontWeight: '500',
        fontFamily: 'Roboto-Medium',
        color: PINK_COLOR_1,
    },
    bottomText: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
        textAlign: 'center',
        marginVertical: 26,
    },
    subtitleTopText: {
        fontSize: width / 26,
        fontWeight: '500',
        fontFamily: 'Roboto-Medium',
        color: BLACK_COLOR,
    },
    subtitleBottomText: {
        fontSize: width / 23,
        fontWeight: '700',
        fontFamily: 'Roboto-Medium',
        color: PINK_COLOR_1,
    },
});

export default ActiveFreeTrialModal;
