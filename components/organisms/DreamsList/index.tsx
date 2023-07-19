import React, { useEffect } from 'react';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import ChildDreamsList from '../ChildDreamsList';
import { connect } from 'react-redux';
import ChildCompletedDreamList from '../ChildCompletedDreamsList/index';
import { View } from 'react-native';
import NoDreamsPlaceholder from './NoDreamsPlaceholder';
import ConfirmedDreamsList from '../ConfirmedDreamsList';
import FulfilledDreamsList from '../FulfilledDreamsList';
import DeclinedDreamsList from '../DeclinedDreamsList';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { L } from '../../../lang/Lang';

const DreamsList = (props) => {
  const {
    dreamsList,
    dispatch,
    newDreamsList,
    confirmedDreamsList,
    canceledDreamsList,
    redemeedDreamList,
    fulfilledDreamsList,
    childWallet,
    loading,
  } = props;

  useEffect(() => {
    dispatch({ type: 'CHILD_DREAMS_LIST_REQUESTED' });
  }, []);

  const isAnyDream = () => {
    return (
      (confirmedDreamsList && confirmedDreamsList.length > 0) ||
      (redemeedDreamList && redemeedDreamList.length > 0) ||
      (fulfilledDreamsList && fulfilledDreamsList.length > 0) ||
      (newDreamsList && newDreamsList.length > 0)
    );
  };

  return isAnyDream() ? (
    <View style={{ flex: 1 }}>
      {newDreamsList && newDreamsList.length > 0 ? (
        <KsAlign elementsGap={20}>
          <Typography fontSize={16} fontWeight="600" style={{ color: '#000', textAlign:'center' }}>
            {L('estimate_new_child_dream')}
          </Typography>

          <ChildDreamsList></ChildDreamsList>
        </KsAlign>
      ) : null}
      {(confirmedDreamsList && confirmedDreamsList.length > 0) ||
      (redemeedDreamList && redemeedDreamList.length > 0) ||
      (fulfilledDreamsList && fulfilledDreamsList.length > 0) ? (
        <KsAlign elementsGap={20}>
          <Typography fontSize={16} fontWeight="600" style={{ color: '#000', textAlign:'center' }}>
            {L('child_dream_subtitle')}
          </Typography>
          <ChildCompletedDreamList></ChildCompletedDreamList>
          <ConfirmedDreamsList data={{ confirmedDreamsList, childWallet }}></ConfirmedDreamsList>
          <FulfilledDreamsList data={fulfilledDreamsList}></FulfilledDreamsList>
          <DeclinedDreamsList data={canceledDreamsList}></DeclinedDreamsList>
        </KsAlign>
      ) : null}
    </View>
  ) : loading.isLoading ? (
    <View style={{ height: hp('100%') }}></View>
  ) : (
    <NoDreamsPlaceholder showAddKidAlert={props.showAddKidAlert}></NoDreamsPlaceholder>
  );
};

const mapStateToProps = (state) => {
  return {
    dreamsList: state.achievementReducer.dreamsList,
    newDreamsList: state.achievementReducer.newDreamsList,
    confirmedDreamsList: state.achievementReducer.confirmedDreamsList,
    redemeedDreamList: state.achievementReducer.redemeedDreamList,
    canceledDreamsList: state.achievementReducer.canceledDreamsList,
    fulfilledDreamsList: state.achievementReducer.fulfilledDreamsList,
    childWallet: state.achievementReducer.childWallet,
    loading: state.achievementReducer.loading,
  };
};

export default connect(mapStateToProps)(DreamsList);
