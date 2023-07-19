import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EventRegister } from 'react-native-event-listeners';
import { controlActionCreators } from '../reducers/controlRedux';
import {
  mapCancelBtnActionCreators,
  popupActionCreators,
} from '../reducers/popupRedux';
import { L } from '@lang';

import NavigationService from '../navigation/NavigationService';

const imageSourceStub = require('../img/child_without_photo_bottom_tab.png');
const imageSourceLoader = require('../img/ic_loading.png');

const defaultProps = {
  title: 'Unnamed',
  titleStyle: {},
  onPress: null,
  active: false,
  imageSource: imageSourceStub,
  loadingIndicatorSource: imageSourceLoader,
};

class ObjectBarItem extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);
    this.state = {
      axisX: 0,
      axisY: 0,
      elHeight: 0,
      elWidth: 0,
      isProgress: false,
      progressTitle: null,
      cancelBtn: false,
      errorLoadingImage: false,
    };
    this.myRef = React.createRef();
    this.shakeAnimation = new Animated.Value(0);
    this.componentDidMount = this.componentDidMount.bind(this);
  };

  componentDidMount() {
    EventRegister.addEventListener('clickOutsideDeleteBtn', () => {
      const { cancelBtn } = this.state;
      if (cancelBtn) this.setState({ cancelBtn: false });
    });
  };

  componentWillUnmount() {
    EventRegister.removeEventListener('clickOutsideDeleteBtn');
  };

  //BOUNCE ANIMATION START
  startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.shakeAnimation, { toValue: 2, duration: 250, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -2, duration: 250, useNativeDriver: true }),
      ]),
      { iterations: Infinity }
    ).start();
  };

  //BOUNCE ANIMATION STOP
  stopShake() {
    Animated.loop(Animated.timing(this.shakeAnimation, { toValue: 0, duration: 150, useNativeDriver: true }), {
      iterations: 1,
    }).start();
  };

  //SPINNER CONTROLS
  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  // DELETE CHILD ACTION FUNCTION
  performDelete() {
    const {
      deleteObject,
      removeObjectFromList,
      objects,
      oid,
      setRandomOidAndCenter,
      showAlert,
    } = this.props;
    let objectCount = Object.keys(objects).length;
    this.openProgressbar(L('deleting_device'));
    const hideProgressbar = this.hideProgressbar;
    this.props.toggleCancelBtn(false);
    deleteObject(oid, (pr, packet) => {
      const { data } = packet;
      hideProgressbar();
      if (0 === data.result) {
        showAlert(false, '', '');

        if (objectCount > 1) {
          if (setRandomOidAndCenter) {
            setRandomOidAndCenter(oid);
          };

          setTimeout(() => removeObjectFromList(oid), 500);

          return;
        } else {
          return NavigationService.forceReplace('Main', { isAfterDeletion: true });
        };
      };

      showAlert(true, L('error'), L('failed_to_delete_device', [data.error]));
      this.ChangeCancelState();
    });
  };

  //DELETE CHILD PROMPT FUNCTION
  onDelete() {
    const { objects, oid, showAlert } = this.props;
    const object = objects[oid + ''];
    if (!object) {
      return;
    };

    showAlert(
      true,
      L('disconnecting'),
      L('delete_device_confirmation', [object.name]),
      false,
      '',
      L('disconnect'),
      [this.performDelete.bind(this), () =>
      (this.stopShake(),
        this.setState({ cancelBtn: false }),
        this.props.toggleCancelBtn(false)
      )],
    );
  };

  ChangeCancelState() {
    this.setState({ cancelBtn: false });
  };

  componentDidUpdate() {
    !this.state.cancelBtn && this.stopShake();
  };

  render() {
    const props = { ...defaultProps, ...this.props };
    const {
      active,
      imageSource,
      loadingIndicatorSource,
      onPress,
      toggleCancelBtn,
    } = props;
    const { cancelBtn, errorLoadingImage } = this.state;
    const {
      container,
      activeIcon,
      inactiveIcon,
      childWithPhoto,
      deleteBtn,
      objectBtn,
      deleteIcon,
    } = styles;
    const imgStyle = active ? activeIcon : inactiveIcon;

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={() =>
        (this.startShake(),
          this.setState({ cancelBtn: true }),
          toggleCancelBtn(true),
          this.props.setClick(this.ChangeCancelState.bind(this)))}
        style={objectBtn}>
        <Animated.View style={[
          container,
          { transform: [{ translateY: this.shakeAnimation }] },
        ]}>
          <View>
            {(imageSource && !errorLoadingImage)
              ? <Image
                source={imageSource}
                style={[imgStyle, childWithPhoto]}
                loadingIndicatorSource={loadingIndicatorSource}
                resizeMode="cover"
                onError={() => this.setState({ errorLoadingImage: true })} />
              : <Image
                source={imageSourceStub}
                style={imgStyle}
                loadingIndicatorSource={loadingIndicatorSource}
                resizeMode="contain" />}
          </View>
          {cancelBtn &&
            <TouchableOpacity
              onPress={this.onDelete.bind(this)}
              style={deleteBtn}>
              <Image
                source={require('../img/close_gray.png')}
                style={deleteIcon} />
            </TouchableOpacity>}
        </Animated.View>
      </TouchableOpacity>
    );
  };
};

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;
  const { userProps } = state.authReducer;

  return {
    objects,
    userProps,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteObject: bindActionCreators(controlActionCreators.deleteObject, dispatch),
    removeObjectFromList: bindActionCreators(controlActionCreators.removeObjectFromList, dispatch),
    toggleCancelBtn: bindActionCreators(mapCancelBtnActionCreators.mainMapShowHideCancelBtn, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectBarItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    maxWidth: 100,
    marginRight: 10,
    position: 'relative',
    height: 80,
  },
  activeIcon: {
    width: 71,
    height: 71,
    marginLeft: 19,
  },
  inactiveIcon: {
    width: 47,
    height: 47,
    marginLeft: 19,
    borderRadius: 100,
  },
  childWithPhoto: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  deleteBtn: {
    backgroundColor: '#FFFFFF',
    width: 25,
    height: 25,
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'flex-start',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    left: 10,
  },
  objectBtn: {
    height: 90,
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 11,
    height: 11,
  },
});
