import React, { FunctionComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NewColorScheme } from '../shared/colorScheme';

const { GREY_COLOR_2 } = NewColorScheme;

interface DateItemProps {
    title: string;
};

const DateItem: FunctionComponent<DateItemProps> = props => {
    const { title } = props;
    const { dateWrapper, date } = styles;

    return (
        <View style={dateWrapper}>
            <Text style={date}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    dateWrapper: {
        backgroundColor: GREY_COLOR_2,
        borderRadius: 12,
        height: 20,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    date: {
        fontSize: 12,
        fontWeight: '400',
        color: '#FFFFFF',
    },
});

export default DateItem;
