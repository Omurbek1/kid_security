import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, Text } from 'react-native';
import TaskPane from '../../molecules/TaskPane';
import KsAlign from '../../atom/KsAlign/index';
import { connect } from 'react-redux';
import NewDreamDialog from '../NewDreamDialog';
import { L } from '../../../lang/Lang';
import { KidSecurityState } from '../../../store/types';

const ChildDreamsList = (props) => {
  const { loading } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  console.log('data:', props.data);
  return props.data && props.data.length > 0 ? (
    <React.Fragment>
      <NewDreamDialog
        visible={showDialog}
        onTouchOutside={() => {
          setShowDialog(false);
        }}
        onSubmit={(values) => {
          props.dispatch({
            type: 'CONFIRM_CHILD_DREAM_REQUESTED',
            payload: {
              id: currentId,
              price: values.price,
            },
          });
          setShowDialog(false);
        }}></NewDreamDialog>
      <FlatList
        data={props.data}
        style={{ padding: 3 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <TaskPane
              onSubmit={() => {
                setShowDialog(true);
                setCurrentId(item.id);
              }}
              loadingSumbit={
                loading.action?.type === 'CONFIRM_CHILD_DREAM_REQUESTED' && loading.action?.payload.id === item.id
              }
              loadingCancel={
                loading.action?.type === 'DECLINE_CHILD_DREAM_REQUESTED' && loading.action?.payload.id === item.id
              }
              onCancel={() => {
                ('hi');
                props.dispatch({
                  type: 'DECLINE_CHILD_DREAM_REQUESTED',
                  payload: {
                    id: item.id,
                  },
                });
              }}
              style={{ marginBottom: 10 }}
              title={item.name}
              points={item.price}
              submitButtonTitle={L('estimate')}
              cancelButtonTitle={L('decline')}></TaskPane>
          );
        }}></FlatList>
    </React.Fragment>
  ) : null;
};

const mapStateToProps = (state: KidSecurityState) => {
  return {
    data: state.achievementReducer.newDreamsList,
    loading: state.achievementReducer.loading,
  };
};
export default connect(mapStateToProps)(ChildDreamsList);
