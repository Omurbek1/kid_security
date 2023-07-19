import React, { FunctionComponent } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    Dimensions,
} from 'react-native';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from './';

const { width } = Dimensions.get('window');
const { PINK_COLOR_1, BLACK_COLOR } = NewColorScheme;

interface RejectFreeTrialModalProps {
    isVisible: boolean;
    onDone: () => void;
    onActivateFreeTrial: () => void;
};

const RejectFreeTrialModal: FunctionComponent<RejectFreeTrialModalProps> = props => {
    const { isVisible, onDone, onActivateFreeTrial } = props;
    const {
        container,
        title,
        closeBtn,
        closeImg,
        topWrapper,
        subtitle,
        bottomText,
        innerContainer,
        button,
        bottomWrapper,
        firstLaunch,
    } = styles;

    return <Modal
        visible={isVisible}
        transparent={true}>
        <View style={container}>
            <View style={innerContainer}>
                <View style={topWrapper}>
                    <TouchableOpacity onPress={onDone} style={closeBtn}>
                        <Image source={require('../img/close_white.png')} style={closeImg} />
                    </TouchableOpacity>
                    <Text style={title}>
                        {L('otkaz_ot_free')}
                    </Text>
                </View>
                <View style={bottomWrapper}>
                    <Text style={subtitle}>
                        {L('akcionaya_cena')}{'\n'}
                        <Text style={firstLaunch}>{L('tolko_pri_pervomm')}</Text>
                    </Text>
                    <Text style={bottomText}>
                        {L('bolshinstvo')}
                    </Text>
                    <GradientButton
                        title={L('poprobovat_besplatno')}
                        gradientStyle={button}
                        onPress={onActivateFreeTrial} />
                </View>
            </View>
        </View>
    </Modal>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: width / 16,
        fontWeight: '700',
        fontFamily: 'Roboto-Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 17,
        width: '90%',
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
    topWrapper: {
        backgroundColor: PINK_COLOR_1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
        textAlign: 'center',
        marginVertical: 22,
    },
    bottomText: {
        fontSize: width / 34.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
        textAlign: 'center',
    },
    innerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '85%',
    },
    button: {
        marginTop: 25,
        marginBottom: 37,
        width: '100%',
    },
    bottomWrapper: {
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    firstLaunch: {
        fontWeight: '700',
        fontFamily: 'Roboto-Bold',
    },
});

export default RejectFreeTrialModal;
