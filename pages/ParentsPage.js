import React from 'react';
import {
  Text,
  Alert,
  Linking,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, List, ListItem, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthInput from '../components/AuthInput';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { ActionCreators as WsActionCreators } from '../wire/WsMiddleware';
import AppIntroSlider from 'react-native-app-intro-slider';
import NavigationService from '../navigation/NavigationService';
import { underConstruction, CustomProgressBar } from '../Utils';
import { L } from '../lang/Lang';
import MyActivityIndicator from '../components/MyActivityIndicator';

class ParentsPage extends React.Component {
  static _gotoAddParent;

  static navigationOptions = ({ navigation }) => {
    return {
      title: L('parents'),
      headerRight: (
        <TouchableOpacity style={[styles.navbarButton, { opacity: 1 }]} onPress={() => _gotoAddParent()}>
          <Icon iconStyle={styles.addparent} name="ios-add" type="ionicon" size={40} />
        </TouchableOpacity>
      ),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    users: [],
    loading: true,
  };

  componentDidMount() {
    const { navigation } = this.props;
    const oid = navigation.getParam('oid');
    this.reloadParents(oid);

    navigation.addListener('didFocus', (payload) => {
      this.reloadParents(oid);
    });

    _gotoAddParent = this.gotoAddParent.bind(this);
  }

  reloadParents(oid) {
    const { getObjectUserRights } = this.props;
    getObjectUserRights(oid, (pr, packet) => {
      const data = packet.data;
      let users = null;
      console.log(data);
      if (0 === data.result) {
        users = data.users;
      }
      if (users) {
        this.setState({ users: users, loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  gotoAddParent() {
    const { navigation } = this.props;
    const oid = navigation.getParam('oid');
    NavigationService.navigate('AddParent', { oid: oid });
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  render() {
    const { authorized, navigation } = this.props;
    const { users, loading } = this.state;
    const oid = navigation.getParam('oid');
    let hasUsers = false;
    for (let i in users) {
      hasUsers = true;
      break;
    }

    return loading ? (
      <View style={styles.progress_outer}>
        <MyActivityIndicator size="large" />
      </View>
    ) : hasUsers ? (
      <View containerStyle={styles.list_wrapper}>
        <List containerStyle={styles.listContainer}>
          {Object.values(users).map((user) => {
            return (
              <ListItem
                key={user.name}
                containerStyle={styles.itemContainer}
                title={user.name}
                onPress={() =>
                  NavigationService.navigate('DeleteParent', { oid: navigation.getParam('oid'), username: user.name })
                }
              />
            );
          })}
        </List>
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.noparents}>{L('second_parent_not_yet_added')}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;

  return {
    objects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectUserRights: bindActionCreators(controlActionCreators.getObjectUserRights, dispatch),
    manageUserRightsForObject: bindActionCreators(controlActionCreators.manageUserRightsForObject, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParentsPage);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDelete: {
    marginTop: 50,
    backgroundColor: 'white',
    borderColor: 'red',
  },
  list_wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  listContainer: {},
  noparents: {
    opacity: 0.5,
    padding: 20,
  },
  progress_outer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addparent: {
    color: '#fff',
    marginRight: 10,
  },
});
