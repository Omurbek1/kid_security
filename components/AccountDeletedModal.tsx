import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Dimensions,
    Image,
    Text,
} from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface AccountDeletedModalProps {
    isVisible: boolean;
};

class AccountDeletedModal extends React.Component<AccountDeletedModalProps> {
    render() {
        const { isVisible } = this.props;
        const { container, title, check } = styles;

        return <Modal
            visible={isVisible}
            transparent={true}>
            <View style={container}>
                <Text style={title}>{L('delete_done')}</Text>
                <Image source={require('../img/check_green.png')} style={check} />
            </View>
        </Modal>;
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: width / 23,
        fontWeight: '700',
        fontFamily: 'Roboto-Bold',
        color: BLACK_COLOR,
        textAlign: 'center',
    },
    check: {
        width: 66,
        height: 47,
        marginTop: 40,
    },
});

export default AccountDeletedModal;
