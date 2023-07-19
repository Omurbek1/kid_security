import React from 'react';
import { View, StyleSheet, Image, SectionList } from 'react-native';
import Constants from 'expo-constants';
import { getHeader } from '../shared/getHeader';
import { DateItem, MessageItem } from '../components';
import { APIService } from '../Api';
import { NewColorScheme } from '../shared/colorScheme';
import { tsToDateConverter, tsToTimeConverter } from '../Utils';

const { ORANGE_COLOR_2_RGB } = NewColorScheme;

interface MessengerChatPageProps {
    navigation: {};
};

interface MessengerChatPageState {
    listFiltered: [];
};

class MessengerChatPage extends React.Component
    <MessengerChatPageProps, MessengerChatPageState> {
    static navigationOptions = (props) => {
        const { navigation: { state: { params: { name, withImage } } } } = props;

        return {
            ...getHeader({ title: name, isOldHeader: false }),
            headerRight: withImage ? <Image
                source={require('../img/chat_photo_placeholder.png')}
                style={styles.image} /> : null,
        };
    };

    state = {
        listFiltered: null,
    };

    componentDidMount() {
        const { getParam } = this.props.navigation;
        const id = getParam('id');

        this.getMessagesOfChat(id);
    };

    getMessagesOfChat = (roomId: number) => {
        APIService.getMessagesOfChat(roomId)
            .then(res => {
                const { messageList } = res;

                let listFiltered = [{
                    title: tsToDateConverter(messageList[0].ts, true),
                    data: [],
                }];

                for (let i in messageList) {
                    const time = tsToDateConverter(messageList[i].ts, true);

                    if (!listFiltered.some(item => item.title === time)) {
                        listFiltered.unshift({ title: time, data: [] });
                    };

                    for (let j in listFiltered) {
                        if (listFiltered[j].title === time) {
                            listFiltered[j].data.unshift(messageList[i]);
                        };
                    };
                };

                this.setState({ listFiltered });
            })
            .catch(err => {
                console.log('Error getting messages of chat', err);
            });
    };

    getMoreMessages = (roomId: number, baseTs: number) => {
        APIService.getMessagesOfChat(roomId, 30, baseTs)
            .then(res => {
                const { messageList } = res;
                const { listFiltered } = this.state;

                const moreChats = listFiltered;

                for (let i in messageList) {
                    const time = tsToDateConverter(messageList[i].ts, true);

                    if (!moreChats.some(item => item.title === time)) {
                        moreChats.unshift({ title: time, data: [] });
                    };

                    for (let j in moreChats) {
                        if (moreChats[j].title === time) {
                            if (!moreChats[j].data.some(item => item.id === messageList[i].id)) {
                                moreChats[j].data.unshift(messageList[i]);
                            };
                        };
                    };
                };

                this.setState({ listFiltered: moreChats });
            })
            .catch(err => {
                console.log('Error getting messages of chat', err);
            });
    };

    previousUserId = null;

    keyExtractor = (_, index: number): string => `${index}`;

    renderMessage = (item) => {
        const { index, item: { userName, text, ts, userId } } = item;
        const { listFiltered } = this.state;
        const { getParam } = this.props.navigation;
        let activeIndex = 0;

        for (let i in listFiltered) {
            if (listFiltered[i].title === tsToDateConverter(ts, true)) {
                activeIndex = i;
            };
        };

        const time = tsToTimeConverter(ts);
        const prevUserId = this.previousUserId;

        let name = getParam('name');
        name = userName === name ? null : userName;
        this.previousUserId = userId;
        const isPhotoVisible = name
            ? ((listFiltered[activeIndex].data.length === index + 1 ||
                listFiltered[activeIndex].data[index + 1].userId !== userId) && true) : false;
        const isMarginVisible = name && (!prevUserId || prevUserId !== userId || prevUserId === userId);

        return (
            <MessageItem
                name={prevUserId === userId ? null : name}
                message={text}
                time={time}
                viewStyle={{ marginBottom: !name ? 20 : 10 }}
                isPhotoVisible={isPhotoVisible}
                isMarginVisible={isMarginVisible} />
        );
    };

    render() {
        const {
            container,
            sectionList,
        } = styles;
        const { listFiltered } = this.state;
        const { getParam } = this.props.navigation;
        const id = getParam('id');
        const paddingTop = 56 + Constants.statusBarHeight;

        return <View style={[container, { paddingTop }]}>
            {listFiltered && <SectionList
                sections={listFiltered}
                keyExtractor={(item, index) => item + index}
                renderItem={this.renderMessage}
                renderSectionHeader={({ section: { title } }) => (
                    <DateItem title={title} />
                )}
                contentContainerStyle={sectionList}
                showsVerticalScrollIndicator={false}
                inverted
                onEndReached={() => this.getMoreMessages(id, listFiltered[0].data[0].ts)}
                onEndReachedThreshold={0.2}
                stickySectionHeadersEnabled={false} />}
        </View>
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ORANGE_COLOR_2_RGB,
        paddingHorizontal: 21,
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 21,
    },
    sectionList: {
        bottom: 20,
        flexDirection: 'column-reverse',
    },
});

export default MessengerChatPage;
