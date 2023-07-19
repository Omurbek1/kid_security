import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import { ChildDataTypes } from '../../../shared/types';
import { getConfigurationAletsCount } from '../../../Utils';
import { L } from '../../../lang/Lang';
import { NewColorScheme } from '../../../shared/colorScheme';
import SwitchItem from '../../ABTesting/realtimeSwitcher/SwitchItem/SwitchItem';


const { width } = Dimensions.get('window');
const { GREY_COLOR_3, RED_COLOR, BLACK_COLOR, GREY_COLOR_2 } = NewColorScheme;

interface ChildDataPaneProps {
  child: ChildDataTypes.ChildData;
  visible: boolean;
  onShowHideKidPhoneProblemsModal?: () => void;
  isExample?: boolean;
  defaultValue?: boolean;
  onChangeRealtimeSwitcher?: () => void;
}
const ChildDataPane = (props: ChildDataPaneProps) => {
  const [isRealtimeSwitchActive, setIsRealtimeSwitchActive] = useState(false);
  useEffect(() => {
    const realtime_switcher_design = remoteConfig().getValue('realtime_switcher_design').asString();
    setIsRealtimeSwitchActive(realtime_switcher_design === '2');
  }, []);

  const {
    child,
    visible,
    onShowHideKidPhoneProblemsModal,
    isExample = false,
    defaultValue,
    onChangeRealtimeSwitcher,
  } = props;
  const {
    states: { dndEnabled },
    name,
    oid,
    accuracy,
    voltage,
  } = child;
  const problemsCount = getConfigurationAletsCount(child).alertsCount;
  const muted = '1' === dndEnabled;
  const soundIcon = muted ? require('../../../img/muted.png') : require('../../../img/unmuted.png');
  return child && visible ? (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.leftTopContainer}>
            <Text style={styles.childName} numberOfLines={1}>
              {name}
            </Text>
            {problemsCount > 0 && !isExample && (
              <TouchableOpacity onPress={onShowHideKidPhoneProblemsModal}>
                <View style={styles.countWrapper}>
                  <Text style={styles.count}>{problemsCount}</Text>
                </View>
                <View style={styles.notSetWrapper}>
                  <Text style={styles.notSet}>{L('not_configured')}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>
              <Text style={styles.accuracyText}>{L('accuracy')}: </Text>
              <Text style={styles.meters}>
                {accuracy} {L('meters_short')}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Image source={require('../../../img/battery.png')} style={styles.icon} />
            <Text style={styles.voltageSoundText}>{voltage}%</Text>
          </View>
          <View style={styles.row}>
            <Image source={soundIcon} style={styles.icon} />
            <Text style={styles.voltageSoundText}>{muted ? L('mode_muted') : L('mode_unmuted')}</Text>
          </View>
        </View>
      </View>
      {!isExample && isRealtimeSwitchActive && (
        <View
          style={{
            borderTopWidth: 1,
            borderColor: '#C4C4C4',
            paddingTop: 4,
            marginTop: 10,
            marginBottom: -(width / 34.5) + 6,
          }}>
          <SwitchItem defaultValue={defaultValue} onChange={onChangeRealtimeSwitcher}>
            {L('map_position_in_real_time')}
          </SwitchItem>
        </View>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    width: '89%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: width / 34.5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  leftTopContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  childName: {
    fontSize: width / 23,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    width: '60%',
  },
  countWrapper: {
    width: 19,
    height: 19,
    borderRadius: 100,
    backgroundColor: RED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    zIndex: 1,
    position: 'absolute',
    bottom: 14,
    left: -10,
  },
  count: {
    fontSize: width / 34.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FFFFFF',
  },
  notSetWrapper: {
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED_COLOR,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  notSet: {
    fontSize: width / 41.4,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: 'white',
    textAlign: 'center',
  },
  accuracyText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: GREY_COLOR_2,
    width: '50%',
  },
  meters: {
    fontSize: width / 29.5,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    width: '50%',
  },
  separator: {
    height: '85%',
    width: 1,
    backgroundColor: GREY_COLOR_3,
    borderRadius: 10,
    alignSelf: 'center',
    marginHorizontal: width / 34.5,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  voltageSoundText: {
    fontSize: width / 29.5,
    fontWeight: '700',
    fontFamily: 'Roboto-Bold',
    color: BLACK_COLOR,
    width: '70%',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  leftContainer: {
    flex: 2,
    justifyContent: 'space-evenly',
  },
});

export default ChildDataPane;
