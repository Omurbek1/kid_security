import React from 'react';
import {
    StyleSheet,
    Modal,
    View,
    TouchableWithoutFeedback,
    BackHandler,
    TouchableOpacity,
    Image,
    ViewStyle,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { NewColorScheme } from '../shared/colorScheme';

const { GREY_COLOR_3 } = NewColorScheme;

interface BottomModalProps {
    isVisible: boolean;
    onHide: () => void;
    modalStyle: ViewStyle;
    renderView: () => JSX.Element;
};

class BottomModal extends React.Component<BottomModalProps> {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
    };

    onBackButtonPress = () => {
        const { isVisible, onHide } = this.props;

        if (isVisible) {
            onHide();
            return true;
        };

        return false;
    };

    render() {
        const { isVisible, onHide, modalStyle, renderView } = this.props;
        const {
            container,
            innerContainer,
            header,
            topWrapper,
            flexStyle,
            closeBtn,
            closeImg,
        } = styles;

        return <GestureRecognizer
            style={flexStyle}
            onSwipeDown={onHide}>
            <Modal
                visible={isVisible}
                transparent={true}
                onRequestClose={this.onBackButtonPress}>
                <View style={container}>
                    <TouchableWithoutFeedback style={flexStyle} onPress={onHide}>
                        <View style={flexStyle} />
                    </TouchableWithoutFeedback>
                    <View style={[innerContainer, modalStyle]}>
                        <View style={topWrapper}>
                            <View style={header} />
                            <TouchableOpacity onPress={onHide} style={closeBtn}>
                                <Image source={require('../img/close_gray.png')} style={closeImg} />
                            </TouchableOpacity>
                        </View>
                        {renderView && renderView()}
                    </View>
                </View>
            </Modal>
        </GestureRecognizer>;
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    innerContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: 'center',
        paddingTop: 7,
        height: '90%',
    },
    header: {
        width: 75,
        height: 6,
        backgroundColor: GREY_COLOR_3,
        borderRadius: 15,
    },
    topWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    flexStyle: {
        flex: 1,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 23,
        marginTop: 12,
    },
    closeImg: {
        width: 24,
        height: 24,
    },
});

export default BottomModal;
