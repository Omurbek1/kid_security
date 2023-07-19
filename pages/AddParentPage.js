import React from 'react';
import { Text, Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthInput from '../components/AuthInput';
import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import { L } from '../lang/Lang';

class AddParentPage extends React.Component {
  static navigationOptions = () => {
    return {
      title: L('menu_add_parent'),
    };
  };

  state = {
    isProgress: false,
    phoneInput: '+',
  };

  onAdd() {
    const phone = this.state.phoneInput.trim();
    if (0 !== phone.indexOf('+')) {
      // show alert
      return;
    }

    const { navigation, manageUserRightsForObject } = this.props;
    const oid = navigation.getParam('oid');
    this.setState({ inProgress: true });
    manageUserRightsForObject(oid, phone, ['object_control'], [], (pr, packet) => {
      this.setState({ inProgress: false });
      const { data } = packet;
      console.log(data);
      if (0 === data.result && data.rolesAdded && data.rolesAdded.length > 0) {
        return NavigationService.back();
      }
      let msg = 7000 === data.error ? L('user_with_phone_not_found', [phone]) : L('failed_to_add_parent', [data.error]);
      if (!data.error) {
        msg = L('parent_already_added', [phone]);
      }
      Alert.alert(L('error'), msg, [{ text: 'OK', style: 'cancel' }], { cancellable: true });
    });
  }

  render() {
    const { authorized, navigation } = this.props;
    const oid = navigation.getParam('oid');

    return (
      <View style={styles.container}>
        <Text style={styles.hint}>{L('install_app_to_parents_phone')}</Text>
        <AuthInput
          style={styles.auth_input}
          icon="user"
          hint={L('hint_phone_number_starts_with_7')}
          keyboardType="phone-pad"
          editable={!this.state.isProgress}
          value={this.state.phoneInput}
          iconColor="black"
          palceholderTextColor="rgba(0,0,0,0.5)"
          selectionColor="blue"
          textColor="black"
          onChangeText={(text) => {
            this.setState({ phoneInput: text });
          }}
        />
        <Button
          style={styles.buttonAdd}
          loading={this.state.isProgress}
          containerViewStyle={{ width: '100%' }}
          buttonStyle={{ height: 50 }}
          backgroundColor="#FF666F"
          borderRadius={100}
          rounded={true}
          title={this.state.isProgress ? L('adding') : L('menu_add_parent')}
          onPress={this.onAdd.bind(this)}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddParentPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
  },
  buttonAdd: {
    padding: 0,
    margin: 0,
  },
  itemContainer: {},
  auth_input: {
    marginTop: 15,
    marginBottom: 30,
    borderColor: 'black',
  },
  hint: {
    textAlign: 'center',
  },
});
