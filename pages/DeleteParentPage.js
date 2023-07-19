import React from 'react';
import { Text, Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar } from '../Utils';
import { L } from '../lang/Lang';

class DeleteParentPage extends React.Component {
  static navigationOptions = () => {
    return {
      title: L('parent'),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onAskDelete() {
    const { navigation } = this.props;
    const oid = navigation.getParam('oid');
    Alert.alert(
      L('deleting'),
      L('parent_deletion_confirmation', [object.name]),
      [
        { text: L('cancel'), style: 'cancel' },
        { text: L('delete'), style: 'destructive', onPress: this.onDelete.bind(this) },
      ],
      { cancellable: true }
    );
  }
  onDelete() {
    const { navigation, manageUserRightsForObject } = this.props;
    const oid = navigation.getParam('oid');
    const username = navigation.getParam('username');
    this.openProgressbar(L('saving_settings'));
    const hideProgressbar = this.hideProgressbar;
    manageUserRightsForObject(oid, username, [], ['object_control'], (pr, packet) => {
      hideProgressbar();
      const { data } = packet;
      console.log(data);
      if (0 === data.result) {
        return NavigationService.back();
      }
      const msg = L('failed_to_delete_parent', [data.error]);
      Alert.alert(L('error'), msg, [{ text: 'OK', style: 'cancel' }], { cancellable: true });
    });
  }

  render() {
    const { authorized, navigation } = this.props;
    const oid = navigation.getParam('oid');
    const username = navigation.getParam('username');

    return (
      <View style={styles.container}>
        <Text style={styles.hint}>{L('this_parent_able_to_see_kid_on_the_map')}</Text>
        <Text style={styles.username}>{username}</Text>
        <Button
          buttonStyle={styles.buttonDelete}
          color="red"
          title={L('delete_parent')}
          onPress={this.onAskDelete.bind(this)}
        />
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
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
    manageUserRightsForObject: bindActionCreators(controlActionCreators.manageUserRightsForObject, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteParentPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
  },
  hint: {
    textAlign: 'center',
  },
  buttonDelete: {
    marginTop: 50,
    backgroundColor: 'white',
    borderColor: 'red',
  },
  username: {
    fontSize: 32,
    color: '#FF666F',
  },
});
