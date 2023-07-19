import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    BackHandler,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from '../components';

const { width } = Dimensions.get('window');
const { GREY_COLOR_3, BLACK_COLOR } = NewColorScheme;

interface BalancePaymentConfirmationModalProps {
    onCloseModal: () => void;
    isVisible: boolean;
    onPay: () => void;
    phoneNumber: string;
};

class BalancePaymentConfirmationModal extends React.Component<BalancePaymentConfirmationModalProps> {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    onBackButtonPress = () => {
        const { isVisible, onCloseModal } = this.props;

        if (isVisible) {
            onCloseModal();
            return true;
        };

        return false;
    };

    render() {
        const { onCloseModal, isVisible, onPay, phoneNumber } = this.props;
        const {
            container,
            wrapper,
            closeBtn,
            closeImg,
            header,
            title,
            subtitle,
            payBtn,
        } = styles;
        const a = phoneNumber;
        const phoneNumberChanged = a.slice(0, 2) + ' (' + a.slice(2, 5) + ') '
            + a.slice(5, 8) + '-' + a.slice(8, 10) + '-' + a.slice(10, 12);

        return (
            <GestureRecognizer
                style={{ flex: 1 }}
                onSwipeDown={onCloseModal}>
                <Modal
                    visible={isVisible}
                    transparent={true}
                    onRequestClose={this.onBackButtonPress}>
                    <View style={container}>
                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onCloseModal}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>
                        <View style={wrapper}>
                            <View style={header} />
                            <TouchableOpacity onPress={onCloseModal} style={closeBtn}>
                                <Image source={require('../img/close_black.png')} style={closeImg} />
                            </TouchableOpacity>
                            <Text style={title}>{L('podtverdite_pokupku')}</Text>
                            <Text style={subtitle}>{L('oplata_budet', [phoneNumberChanged])}</Text>
                            <GradientButton
                                title={L('payment')}
                                gradientStyle={payBtn}
                                onPress={() => {
                                    onCloseModal();
                                    onPay();
                                }} />
                        </View>
                    </View>
                </Modal>
            </GestureRecognizer>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 7,
        paddingHorizontal: 22,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        width: '50%',
        marginBottom: 17,
    },
    closeImg: {
        width: 16,
        height: 16,
        alignSelf: 'flex-end',
    },
    header: {
        width: 75,
        height: 6,
        backgroundColor: GREY_COLOR_3,
        borderRadius: 15,
    },
    title: {
        fontSize: width / 23,
        fontWeight: '700',
        color: BLACK_COLOR,
        opacity: 0.7,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: width / 26,
        fontWeight: '500',
        color: BLACK_COLOR,
        marginTop: 43,
        marginBottom: 53,
        textAlign: 'center',
    },
    payBtn: {
        width: '100%',
        marginBottom: width / 5,
    },
});

export default BalancePaymentConfirmationModal;
