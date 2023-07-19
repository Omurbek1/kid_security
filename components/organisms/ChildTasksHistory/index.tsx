import React, { useEffect } from 'react';
import { View, ScrollView, FlatList, Button } from 'react-native';
import TaskPane from '../../molecules/TaskPane';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

const ChildTasksHistory = ({ style, dispatch, data }) => {
  useEffect(() => {
    dispatch({ type: 'FETCH_CONFIRMED_TASK_LIST_REQUESTED' });
  }, []);

  return (
    <FlatList
      style={[{ padding: 20, flex: 1 }, style]}
      data={data}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={() => <View style={{ flex: 1 }}></View>}
      ListFooterComponent={() => <View style={{ marginBottom: '10%' }}></View>}
      renderItem={({ item }) => (
        <TaskPane
          style={{ marginBottom: 10 }}
          removeActions
          createdDate={new Date(item.finishTs)}
          dev={item.origin === 'DEVELOPER'}
          points={item.reward}
          title={item.name}></TaskPane>
      )}
      keyExtractor={(item) => {
        return item.id.toString();
      }}></FlatList>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.achievementReducer.confirmedTasksList,
  };
};
export default connect(mapStateToProps)(ChildTasksHistory);
