import React from 'react';
import { View, FlatList, Text } from 'react-native';
import KsAlign from '../../atom/KsAlign/index';
import TaskPane from '../../molecules/TaskPane';
import { connect } from 'react-redux';
import { L } from '../../../lang/Lang';
import { KidSecurityState } from '../../../store/types';
import { ChildDream, LoadingObject } from '../../../store/achievements/types';

interface ChildCompletedDreamListProps {
  dispatch: any;
  data: ChildDream[];
  loading: LoadingObject;
}

const ChildCompletedDreamList: React.FC<any> = ({ dispatch, data, loading, fullFillDream }) => {
  return typeof data !== 'undefined' && data ? (
    <React.Fragment>
      <FlatList
        data={data}
        style={{ padding: 3 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <TaskPane
              dev
              removeCancel
              submitButtonTitle={L('redeem')}
              style={{ marginBottom: 10 }}
              title={item.name}
              loadingSumbit={
                loading.action?.type === 'FULFILL_CHILD_DREAM_REQUESTED' && loading.action?.payload.id === item.id
              }
              onSubmit={() => fullFillDream(item.id)}
              points={item.price}></TaskPane>
          );
        }}></FlatList>
    </React.Fragment>
  ) : null;
};

const mapStateToProps = (state: KidSecurityState) => {
  return {
    data: state.achievementReducer.redemeedDreamList,
    loading: state.achievementReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fullFillDream: (id) => dispatch({ type: 'FULFILL_CHILD_DREAM_REQUESTED', payload: { id } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChildCompletedDreamList);
