import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const defaultProps = {
    buttonImageUrl: '',
    onPress: null,
};

export default class OssButton extends Component {
    render() {
        const props = { ...defaultProps, ...this.props };
        //const icon = props.buttonImageUrl;
        const icon = { uri: 'https://api.kidsecurity.tech/oss-app/button.png' };
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.wrapper} onPress={props.onPress}>
                    <Image source={icon} style={styles.icon} />
                </TouchableOpacity>
            </View>
        )
    };
};



const styles = {
    container: {
        width: 120,
        height: 40,
        flex: 1,
        marginRight: 10,
        
    },
    wrapper: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 15,
    },
    icon: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
};