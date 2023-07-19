import React, { useState, useEffect } from 'react';
import KsAlign from '../../atom/KsAlign';
import TaskPane from '../../molecules/TaskPane';
import ConfirmTaskDialog from '../../organisms/ConfirmTaskDialog';
import { Button, ScrollView, View, FlatList, Text } from 'react-native';
import { ChildTaskListTypes } from './type';
import AddTaskDialog from '../AddTaskDialog/index';
import NewDreamDialog from '../NewDreamDialog/index';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { L } from '../../../lang/Lang';
import { KidSecurityState } from '../../../store/types';
import Typography from '../../atom/KsTypography/index';

const ChildTaskList: React.FC<ChildTaskListTypes.ChildTaskListProps> = (props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [confirmedTaskData, setConfirmedTaskData] = useState<any>({});
  useEffect(() => {
    props.dispatch({ type: 'FETCH_UCONFIRMED_TASKS_LIST_REQUESTED' });
  }, []);

  const { style, loading } = props;

  const FinishedTasksList = (
    <FlatList
      data={props.data}
      style={[{ padding: 3 }, style]}
      renderItem={({ item }) => {
        return (
          <TaskPane
            title={item.name}
            points={item.reward ? item.reward : null}
            dev={item.origin === 'DEVELOPER'}
            loadingSumbit={
              loading.action?.type === 'CONFIRM_CHILD_TASK_REQUESTED' &&
              loading.action?.payload.finishedTaskId === item.id
            }
            loadingCancel={
              loading.action?.type === 'DECLINE_CHILD_TASK_REQUESTED' &&
              loading.action?.payload.finishedTaskId === item.id
            }
            onSubmit={() => {
              setShowDialog(true);
              setConfirmedTaskData(item);
            }}
            onCancel={() => {
              props.dispatch({
                type: 'DECLINE_CHILD_TASK_REQUESTED',
                payload: { finishedTaskId: item.id },
              });
            }}></TaskPane>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }}></View>}
      ListFooterComponent={() => <View style={{ marginBottom: '30%' }}></View>}
      keyExtractor={(item) => item.id.toString()}></FlatList>
  );

  return (
    <KsAlign elementsGap={20}>
      <Typography fontSize={16} fontWeight="600" style={{ color: '#B1B1B1' }}>
        {props.data && props.data.length > 0 ? L('child_finished_tasks') : L('no_child_finished_tasks')}
      </Typography>
      <React.Fragment>
        {props.data && props.data.length > 0 ? FinishedTasksList : null}
        <ConfirmTaskDialog
          reward={confirmedTaskData.reward}
          visible={showDialog}
          onTouchOutside={() => setShowDialog(false)}
          onSumbit={(value) => {
            const payload = {
              finishedTaskId: confirmedTaskData.id,
              praiseComment: value.praiseComment,
            };
            if (confirmedTaskData.origin === 'CHILD') {
              payload['reward'] = value.reward;
            }
            props.dispatch({
              type: 'CONFIRM_CHILD_TASK_REQUESTED',
              payload,
            });
            setShowDialog(false);
          }}
        />
      </React.Fragment>
    </KsAlign>
  );
};

const mapStateToProps = (state: KidSecurityState) => {
  return {
    data: state.achievementReducer.unconfirmedTasksList,
    loading: state.achievementReducer.loading,
  };
};

export default connect(mapStateToProps)(ChildTaskList);
