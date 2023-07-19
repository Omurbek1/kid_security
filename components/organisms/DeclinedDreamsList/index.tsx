import React from 'react';
import connect from '../ChildDreamsList/index';
import { FlatList, View } from 'react-native';
import TaskPane from '../../molecules/TaskPane/index';
import { L } from '../../../lang/Lang';

const DeclinedDreamsList = ({ data }) => {
  return (
    <React.Fragment>
      <FlatList
        style={{ padding: 5 }}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }}></View>}
        keyExtractor={(item) => item.id.toString()}
        data={data}
        renderItem={({ item }) => (
          <TaskPane
            removeCancel
            outlineSubmit={true}
            submitButtonColor="red"
            submitButtonTitle={L('declined')}
            title={item.name}></TaskPane>
        )}></FlatList>
    </React.Fragment>
  );
};

export default DeclinedDreamsList;
