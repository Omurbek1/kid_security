import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    Dimensions,
    BackHandler,
} from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface DeleteAccountErrorModalProps {
    onCloseModal: () => void;
    isVisible: boolean;
};

class DeleteAccountErrorModal extends React.Component<DeleteAccountErrorModalProps>{
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
        const { onCloseModal, isVisible } = this.props;
        const {
            container,
            wrapper,
            closeBtn,
            closeImg,
            title,
            subtitle,
        } = styles;

        return (
            <Modal
                visible={isVisible}
                transparent={true}
                onRequestClose={this.onBackButtonPress}>
                <View style={container}>
                    <View style={wrapper}>
                        <TouchableOpacity onPress={onCloseModal} style={closeBtn}>
                            <Image source={require('../img/close_black.png')} style={closeImg} />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, justifyContent: 'space-around' }}>
                            <View>
                                <Text style={title}>{L('error')}</Text>
                                <Text style={subtitle}>{L('dont_delete_error')}</Text>
                            </View>
                            <Text style={subtitle}>{L('try_again_lateragin')}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
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
        borderRadius: 12,
        width: '75%',
        height: '25%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 15,
        paddingHorizontal: 24,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        paddingTop: 10,
        width: '10%',
    },
    closeImg: {
        width: 16,
        height: 16,
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: width / 23,
        fontWeight: '700',
        fontFamily: 'Roboto-Bold',
        color: BLACK_COLOR,
        marginBottom: 17,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
        textAlign: 'center',
    },
});

export default DeleteAccountErrorModal;
