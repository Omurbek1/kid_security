import React, { FunctionComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Modal,
    Image,
} from 'react-native';
import { L } from '@lang';

import UserPrefs from '../UserPrefs';
import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from '../components';

const { BLACK_COLOR } = NewColorScheme;

interface PaymentProblemModalProps {
    onCloseModal: () => void;
    isVisible: boolean;
    onHide?: () => void;
};

const PaymentProblemModal: FunctionComponent<PaymentProblemModalProps> = props => {
    const { onCloseModal, isVisible, onHide } = props;
    const {
        gradient,
        text,
        container,
        wrapper,
        goBtnText,
        closeBtn,
        closeImg,
        mediumWrapper,
    } = styles;

    const isRussian = UserPrefs.all.language === 'ru';

    const onOpenURL = () => {
        Linking.openURL('https://pay.kidsecurity.net');
        onCloseModal();
        onHide && onHide();
    };

    return (
        <Modal visible={isVisible && isRussian} transparent={true}>
            <View style={container}>
                <View style={wrapper}>
                    <TouchableOpacity onPress={() => {
                        onCloseModal(); onHide && onHide();
                    }} style={closeBtn}>
                        <Image source={require('../img/close_black.png')} style={closeImg} />
                    </TouchableOpacity>
                    <View style={mediumWrapper}>
                        <Text style={text}>{L('pay_kidsecurity')}</Text>
                        <GradientButton
                            title={L('rate')}
                            onPress={onOpenURL}
                            gradientStyle={gradient}
                            titleStyle={goBtnText} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    gradient: {
        width: 154,
        marginTop: 31,
        marginBottom: 39,
    },
    text: {
        fontSize: 18,
        fontWeight: '700',
        color: BLACK_COLOR,
        textAlign: 'center',
        marginHorizontal: 58,
    },
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
    goBtnText: {
        fontWeight: '800',
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
    },
});

export default PaymentProblemModal;
