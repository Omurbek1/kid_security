import React from 'react';
import { View, Text, Image } from 'react-native';
import KsButton from '../../atom/KsButton';
import Pane from '../../atom/Pane';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import { TaskPaneTypes } from './type';
import { L } from '../../../lang/Lang';

const renderPointsElement = (points, isFromDev): JSX.Element => {
  const greenCoin = require('../../../img/ic_coin_g.png');
  const yellowCoin = require('../../../img/ic_coin_y.png');
  const coinIcon = isFromDev ? yellowCoin : greenCoin;
  const pointsColor = isFromDev ? '#FFB25E' : '#00C69B';
  return (
    <KsAlign axis="horizontal" alignItems="flex-end" elementsGap={5}>
      <Image source={coinIcon} style={{ height: 20, width: 20 }} />
      <Typography fontSize={14} fontWeight="900" style={{ color: pointsColor }}>
        {points || 0} {L('points')}
      </Typography>
    </KsAlign>
  );
};

const TaskPane: React.FC<TaskPaneTypes.TaskPaneProps> = ({
  title,
  outlineSubmit,
  removeSubmit,
  removeCancel,
  submitButtonTitle,
  cancelButtonTitle,
  style,
  customPointBar,
  submitButtonColor,
  points,
  dev,
  onSubmit,
  onCancel,
  createdDate,
  removeActions,
  loadingCancel,
  loadingSumbit,
}) => {
  if (loadingCancel || loadingSumbit) {
    console.log('task pane: ', loadingSumbit);
  }

  const submitButtonTitleValue = submitButtonTitle || L('confirm');
  const cancelButtonTitleValue = cancelButtonTitle || L('cancel');
  const actions = (
    <KsAlign axis="horizontal" elementsGap={10}>
      <KsButton
        color={submitButtonColor}
        onPress={onSubmit}
        hidden={removeSubmit}
        title={submitButtonTitleValue}
        outlined={outlineSubmit}
        loading={loadingSumbit}
      />
      <KsButton
        onPress={onCancel}
        hidden={removeCancel}
        outlined
        title={cancelButtonTitleValue}
        loading={loadingCancel}
      />
    </KsAlign>
  );

  let day;
  let month;

  if (createdDate) {
    day = createdDate.getDate() < 10 ? `0${createdDate.getDate()}` : createdDate.getDate();
    month = createdDate.getMonth() < 10 ? `0${createdDate.getMonth() + 1}` : createdDate.getMonth() + 1;
    console.log(createdDate.getMonth());
  }

  const dateString = createdDate ? `${day}.${month}.${createdDate.getFullYear()}` : null;

  return (
    <Pane padding={{ horizontal: 20, vertical: 10 }} style={style}>
      <KsAlign elementsGap={20}>
        <KsAlign axis="horizontal" style={{ justifyContent: 'space-between' }}>
          <KsAlign elementsGap={5} style={{ maxWidth: '80%' }}>
            <Typography fontSize={14} fontWeight="600">
              {title}
            </Typography>
            {customPointBar ? customPointBar() : null}
            {points && !customPointBar ? renderPointsElement(points, dev) : null}
          </KsAlign>
          <View>
            <Typography style={{ textAlign: 'right', fontSize: 14, fontWeight: '600', color: '#6E7C8A' }}>
              {dateString}
            </Typography>
          </View>
        </KsAlign>
        {removeActions ? null : actions}
      </KsAlign>
    </Pane>
  );
};

export default TaskPane;
