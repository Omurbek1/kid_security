import React, { Component } from 'react';
import { FlatList, ViewStyle, StyleSheet } from 'react-native';
import { ChildDataTypes } from '../shared/types';
import ObjectBarItem from './ObjectBarItem';

const defaultProps = {
  style: {},
  objects: {},
  onPress: null,
  activeOid: null,
  pulse: true,
};

interface ObjectBarProps {
  style: ViewStyle;
  objects: ChildDataTypes.ChildData[];
  onPress: (oid: string) => void;
  activeOid: string;
  onAddPhone?: () => void;
  pulse?: boolean;
  demoPage?: boolean;
  setRandomOidAndCenter: () => void;
};

export default class ObjectBar extends Component<ObjectBarProps> {
  render() {
    const props = { ...defaultProps, ...this.props };

    return (
      <FlatList
        pointerEvents="box-none"
        inverted
        showsHorizontalScrollIndicator={false}
        data={Object.values(props.objects)}
        keyExtractor={(item) => item.oid.toString()}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <ObjectBarItem
            setClick={this.props.setClick}
            navigation={props.navigation}
            oid={item?.oid}
            demoPage={this.props.demoPage || false}
            active={props.activeOid === item.oid ? true : false}
            key={'' + item.oid}
            title={item.name}
            imageSource={item.photoUrl ? { uri: item.photoUrl } : null}
            onPress={() => {
              props.onPress ? props.onPress(item.oid) : null;
            }}
            setRandomOidAndCenter={props.setRandomOidAndCenter} />
        )}
        contentContainer={[props.style, styles.container]}
        style={[{ marginRight: 11 }, props.style]}
        horizontal={true} />
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },
  contentContainer: {
    overflow: 'visible',
    alignItems: 'center',
  },
});
