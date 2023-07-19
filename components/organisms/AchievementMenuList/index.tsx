import React, { useEffect } from 'react';
import ClickableTitledItem from '../../molecules/ClickableTitledItem';
import KsAlign from '../../atom/KsAlign';
import { AchievementMenuListTypes } from './type';
import NavigationService from '../../../navigation/NavigationService';
import { connect } from 'react-redux';
import KsButton from '../../atom/KsButton';
import { L } from '../../../lang/Lang';
import { Button } from 'react-native';
import { APIService } from '../../../Api';

const AchievementMenuList: React.FC<AchievementMenuListTypes.AchievementMenuListProps> = (props: any) => {
  const { style, dispatch } = props;
  useEffect(() => {
    props.dispatch({
      type: 'FETCH_COUNTERS_REQUESTED',
    });
  }, []);
  return (
    <KsAlign style={style} elementsGap={10}>
      <ClickableTitledItem
        onItemPress={() => NavigationService.navigate('ChildDreams')}
        title={L('child_dreams')}
        count={props.data.unprocessedDaydreamCount}
      />
      <ClickableTitledItem
        onItemPress={() => NavigationService.navigate('ChildTasksHistory')}
        title={L('task_history')}
      />
      <ClickableTitledItem
        onItemPress={() => NavigationService.navigate('ChildParentTasks')}
        title={L('parent_tasks')}
        count={props.data.unconfirmedParentTaskCount}
      />
    </KsAlign>
  );
};

function mapStateToProps(state) {
  return {
    data: state.achievementReducer.counters,
  };
}

export default connect(mapStateToProps)(AchievementMenuList);
