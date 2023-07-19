import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface AvailableFeaturesModalProps {
  isVisible: boolean;
  onHide: () => void;
}

class AvailableFeaturesModal extends React.Component<AvailableFeaturesModalProps> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { isVisible, onHide } = this.props;

    if (isVisible) {
      onHide();
      return true;
    }

    return false;
  };

  render() {
    const { isVisible, onHide } = this.props;
    const {
      container,
      closeBtn,
      closeImg,
      featureWrapper,
      name,
      innerContainer,
      title,
      bottomTextStarIcon,
      bottomWrapper,
      bottomText,
      featureStarIcon,
    } = styles;
    const FEATURES_LIST = [
      {
        title: L('child_location'),
        icon: require('../img/location.png'),
        style: {
          width: 15,
          height: 20,
        },
      },
      {
        title: L('kid_achievements'),
        icon: require('../img/achievements.png'),
        style: {
          width: 15,
          height: 16,
        },
      },
      {
        title: L('zapic_zvuka'),
        icon: require('../img/sound.png'),
        withStar: true,
      },
      {
        title: L('podacha'),
        icon: require('../img/signal.png'),
        style: {
          width: 15,
          height: 17,
        },
      },
      {
        title: L('app_statistics'),
        icon: require('../img/statistics.png'),
        withStar: true,
      },
      {
        title: L('child_movement'),
        icon: require('../img/movement_history.png'),
        style: {
          width: 14,
          height: 15,
        },
      },
      {
        title: L('chats_control'),
        icon: require('../img/chats_control.png'),
        withStar: true,
      },
    ];

    const keyExtractor = (_, index: number): string => `${index}`;

    const renderFeatureItem = (item: {}) => {
      const {
        item: { title, icon, withStar, style = { width: 15, height: 15 } },
      } = item;

      return (
        <View style={featureWrapper}>
          <Image source={icon} style={style} />
          <Text style={name}>{title}</Text>
          {withStar && <Image source={require('../img/star.png')} style={featureStarIcon} />}
        </View>
      );
    };

    return (
      <Modal visible={isVisible} transparent={true} onRequestClose={this.onBackButtonPress}>
        <View style={container}>
          <View style={innerContainer}>
            <TouchableOpacity onPress={onHide} style={closeBtn}>
              <Image source={require('../img/close_black.png')} style={closeImg} />
            </TouchableOpacity>
            <Text style={title}>{L('what_included')}</Text>
            <FlatList
              data={FEATURES_LIST}
              keyExtractor={keyExtractor}
              renderItem={renderFeatureItem}
              scrollEnabled={false}
              style={{ marginTop: 31 }}
            />
            <View style={bottomWrapper}>
              <Image source={require('../img/star.png')} style={bottomTextStarIcon} />
              <Text style={bottomText}>{L('if_iphone')}</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 23,
    width: '50%',
  },
  closeImg: {
    width: 16,
    height: 16,
    alignSelf: 'flex-end',
  },
  featureWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: width / 29.5,
    fontWeight: '400',
    color: BLACK_COLOR,
    marginLeft: 12,
  },
  innerContainer: {
    width: width / 1.2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: width / 23,
    fontWeight: '700',
    color: BLACK_COLOR,
    textAlign: 'center',
    width: '80%',
  },
  bottomTextStarIcon: {
    width: 12,
    height: 12,
    marginTop: 1,
    marginRight: 7,
  },
  bottomWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 34,
    marginBottom: 52,
  },
  bottomText: {
    fontSize: width / 34.5,
    fontWeight: '400',
    color: BLACK_COLOR,
  },
  featureStarIcon: {
    width: 7,
    height: 7,
    marginLeft: 4,
    marginBottom: 5,
  },
});

export default AvailableFeaturesModal;
