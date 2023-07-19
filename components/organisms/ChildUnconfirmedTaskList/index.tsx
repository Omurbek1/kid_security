import React, { useEffect, useState } from 'react';
import KsAlign from '../../atom/KsAlign';
import KsButton from '../../atom/KsButton';
import TaskPane from '../../molecules/TaskPane';
import { connect } from 'react-redux';
import { Text, View, FlatList } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AddTaskDialog from '../AddTaskDialog';
import { AchievementsTypes } from '../../../shared/types';
import { L } from '../../../lang/Lang';
import { KidSecurityState } from '../../../store/types';
import { LoadingObject, ParentTask } from '../../../store/achievements/types';
import { actionChannel } from 'redux-saga/effects';

interface ChildUnconfirmedTaskListProps {
  loading: LoadingObject;
  dispatch: any;
  activeOid: any;
  data: ParentTask[];
  showAddKidAlert: () => void;
}

const ChildUnconfirmedTaskList = (props: ChildUnconfirmedTaskListProps) => {
  const { loading } = props;
  console.log('props', props);
  useEffect(() => {
    props.dispatch({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED' });
  }, []);

  console.log('loading:', loading);

  const renderTaskItem = (item: ParentTask) => {
    const uncompletedTask = (
      <View>
        <TaskPane
          style={{ marginBottom: 10 }}
          title={item.name}
          points={item.reward}
          cancelButtonTitle={L('delete')}
          loadingCancel={
            loading.action?.type === 'CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED' &&
            loading.action.payload.taskId === item.id
          }
          removeSubmit={item.completions?.length === 0}
          onCancel={() => {
            props.dispatch({ type: 'CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED', payload: { taskId: item.id } });
          }}
        />
      </View>
    );

    const completedTask = (
      <TaskPane
        style={{ marginBottom: 10 }}
        title={item.name}
        points={item.reward}
        cancelButtonTitle={L('delete')}
        loadingSumbit={
          loading.action?.type === 'CONFIRM_CHILD_TASK_REQUESTED' &&
          loading.action.payload.finishedTaskId === item.completions[0]?.finishedTaskId
        }
        onCancel={() => {
          props.dispatch({
            type: 'DECLINE_CHILD_TASK_REQUESTED',
            payload: { finishedTaskId: item.completions.pop().finishedTaskId },
          });
        }}
        onSubmit={() => {
          console.log('item confirm: ', item.completions);
          props.dispatch({
            type: 'CONFIRM_CHILD_TASK_REQUESTED',
            payload: {
              finishedTaskId: item.completions.pop().finishedTaskId,
              praiseComment: '',
            },
          });
        }}
      />
    );

    if (item.completions?.length > 0) return completedTask;

    return uncompletedTask;
  };

  const [showDialog, setShowDialog] = useState(false);
  console.log('activeOID', props.activeOid);
  return (
    <KsAlign elementsGap={10}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <KsButton
          style={{ paddingVertical: 20 }}
          titleStyle={{ fontSize: 16 }}
          outlined
          loading={loading.action?.type === 'ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED'}
          title={'+ ' + L('add_new_task')}
          onPress={() => {
            !props.activeOid ? props.showAddKidAlert() : setShowDialog(true);
          }}
        />
      </View>

      <FlatList
        data={props.data}
        style={{ width: '100%', paddingHorizontal: 20 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderTaskItem(item)}></FlatList>
      <AddTaskDialog
        visible={showDialog}
        onTouchOutside={() => setShowDialog(false)}
        loading={loading.isLoading}
        onSubmit={(data) => {
          props.dispatch({
            type: 'ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED',
            payload: { title: data.title, reward: data.reward },
          });
          setShowDialog(false);
        }}></AddTaskDialog>
    </KsAlign>
  );
};

const mapStateToProps = (state: KidSecurityState) => {
  return {
    data: state.achievementReducer.unconfirmedParentTasksList,
    loading: state.achievementReducer.loading,
    activeOid: state.controlReducer.activeOid,
  };
};

export default connect(mapStateToProps)(ChildUnconfirmedTaskList);
