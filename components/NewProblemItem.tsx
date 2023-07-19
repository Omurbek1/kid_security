import React, { Component } from 'react'
import {
    TouchableOpacity,
    View,
    Image,
    Text,
    Dimensions,
    StyleSheet,
    Linking,
} from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from '../components';

const { width } = Dimensions.get('window');
const {
    ORANGE_COLOR_2,
    BLACK_COLOR,
    RED_COLOR,
    GREY_COLOR_3,
} = NewColorScheme;

interface NewProblemItemProps {
    item: {};
    isVisible: boolean;
};

interface NewProblemItemState {
    isClicked: boolean;
};

class NewProblemItem extends Component<NewProblemItemProps, NewProblemItemState> {
    state = {
        isClicked: false,
    };

    onShowHideMoreInfo = () => {
        const { isClicked } = this.state;

        this.setState({ isClicked: !isClicked });
    };

    onOpenInstructionsLink = () => {
        Linking.openURL(L('instructions_url'));
    };

    render() {
        const {
            item:
            {
                title,
                subtitle,
                iconSrc,
                iconStyle,
                isPinCode = false,
                isInstructions = false,
                onDontWant = null,
                onWant = null,
            },
            isVisible,
        } = this.props;
        const { isClicked } = this.state;
        const arrowIcon = isClicked
            ? require('../img/arrow_up_gray.png') : require('../img/arrow_down_red.png');
        const {
            problemBtn,
            problemText,
            arrow,
            problemWrapper,
            center,
            subtitleText,
            instructions,
            dontWantBtn,
            btnsWrapper,
            optionText,
        } = styles;

        return isVisible
            ? <TouchableOpacity
                onPress={this.onShowHideMoreInfo}
                style={[problemBtn, !isClicked && center]}>
                <View style={[problemWrapper, !isClicked && center]}>
                    <Image
                        source={iconSrc}
                        style={iconStyle} />
                    <View style={{ marginLeft: 11 }}>
                        <Text style={problemText}>{title}</Text>
                        {isClicked &&
                            <View>
                                <Text style={subtitleText}>{subtitle}</Text>
                                {isPinCode &&
                                    <View style={btnsWrapper}>
                                        <TouchableOpacity
                                            onPress={onDontWant}
                                            style={dontWantBtn}>
                                            <Text style={optionText}>{L('not_want')}</Text>
                                        </TouchableOpacity>
                                        <GradientButton
                                            title={L('yes_want')}
                                            onPress={onWant}
                                            gradientStyle={{ width: '45%' }}
                                            titleStyle={[optionText, { color: '#FFFFFF' }]} />
                                    </View>}
                                {isInstructions &&
                                    <Text
                                        onPress={this.onOpenInstructionsLink}
                                        style={instructions}>
                                        kidsecurity.net/instructions
                                    </Text>}
                            </View>}
                    </View>
                </View>
                <Image
                    source={arrowIcon}
                    style={arrow} />
            </TouchableOpacity>
            : null;
    };
};

const styles = StyleSheet.create({
    problemBtn: {
        borderRadius: 26,
        borderWidth: 1,
        borderColor: ORANGE_COLOR_2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
    },
    problemText: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
    },
    arrow: {
        width: 17,
        height: 17,
    },
    problemWrapper: {
        flexDirection: 'row',
        width: '80%',
    },
    center: {
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: RED_COLOR,
        marginTop: 6,
    },
    instructions: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
        textDecorationLine: 'underline',
        marginTop: 9,
    },
    btnsWrapper: {
        width: '110%',
        right: 20,
        marginTop: 11,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dontWantBtn: {
        width: '45%',
        borderRadius: 26,
        borderWidth: 1,
        borderColor: GREY_COLOR_3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: width / 29.5,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: BLACK_COLOR,
    },
});

export default NewProblemItem;
