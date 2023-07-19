import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import Pane from '../../atom/Pane';
import Typography from '../../atom/KsTypography';
import KsAlign from '../../atom/KsAlign';
import { ClickableTitledItemTypes } from './type';

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    color: 'red',
  },
});

const ClickableTitledItem: React.FC<ClickableTitledItemTypes.ClickableTitledItemProps> = (props) => {
  const { title, count, style, onItemPress } = props;
  const shevronRightIcon = require('../../../img/ic_chevron_right4.png');

  const countElement = (
    <Typography type="h3" style={styles.count}>
      ({count})
    </Typography>
  );

  return (
    <TouchableOpacity onPress={onItemPress}>
      <Pane padding={20} style={style}>
        <View style={styles.horizontal}>
          <KsAlign axis="horizontal" elementsGap={3}>
            <Typography style={{ color: '#000' }} type="h3">
              {title}
            </Typography>
            {count && count > 0 ? countElement : null}
          </KsAlign>

          <View style={{ justifyContent: 'center' }}>
            <Image style={{ height: 20, resizeMode: 'contain' }} source={shevronRightIcon}></Image>
          </View>
        </View>
      </Pane>
    </TouchableOpacity>
  );
};

export default ClickableTitledItem;
