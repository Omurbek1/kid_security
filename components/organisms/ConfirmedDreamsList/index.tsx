import React from 'react';
import connect from '../ChildDreamsList/index';
import { FlatList, View, Text } from 'react-native';
import TaskPane from '../../molecules/TaskPane/index';
import { L } from '../../../lang/Lang';

const ConfirmedDreamsList = ({ data }) => {
  return (
    <View>
      <FlatList
        style={{ padding: 5 }}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }}></View>}
        keyExtractor={(item) => item.id.toString()}
        data={data.confirmedDreamsList}
        renderItem={({ item }) => (
          <TaskPane
            removeActions
            customPointBar={() => {
              const walletSum = data.childWallet.dailyScore + data.childWallet.parentScore;
              const price = item.price;
              let barText = '';
              if (price <= walletSum) {
                barText = `${price} ${L('points')}`;
              } else {
                barText = `${L('got')} ${walletSum} ${L('from')} ${price} ${L('points')}`;
              }
              return (
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#FFB25E' }}>{barText}</Text>
                </View>
              );
            }}
            title={item.name}></TaskPane>
        )}></FlatList>
    </View>
  );
};

export default ConfirmedDreamsList;
