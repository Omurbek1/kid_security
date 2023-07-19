import React from 'react';
import connect from '../ChildDreamsList/index';
import { FlatList, View } from 'react-native';
import TaskPane from '../../molecules/TaskPane/index';
import { L } from '../../../lang/Lang';

const FulfilledDreamsList = ({ data }) => {
  return (
    <React.Fragment>
      <FlatList
        style={{ padding: 5 }}
        data={data}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }}></View>}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskPane
            removeCancel
            submitButtonColor="#00c69b"
            submitButtonTitle={L('redeemed')}
            title={item.name}></TaskPane>
        )}></FlatList>
    </React.Fragment>
  );
};

export default FulfilledDreamsList;
