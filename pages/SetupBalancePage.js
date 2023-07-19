import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthInput from '../components/AuthInput';
import { controlActionCreators } from '../reducers/controlRedux';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar } from '../Utils';
import * as Utils from '../Utils';
import { L } from '../lang/Lang';

class SetupBalancePage extends React.Component {
  static _onSave = null;

  static navigationOptions = () => {
    return {
      title: L('balance_settings'),
      headerRight: (
        <TouchableOpacity onPress={() => _onSave()} style={[styles.navbarButton, { opacity: 1 }]}>
          <Text style={styles.btnSave}>{L('done')}</Text>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    bigProgress: false,
    isProgress: false,
    ussdInput: '*102#',
  };

  componentDidMount() {
    _onSave = this.onSave.bind(this);

    const { navigation, objects } = this.props;
    const oid = navigation.getParam('oid');

    let activeObject = {
      props: {
        ussdBalanceRequest: null,
      },
    };
    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    let { ussdBalanceRequest } = activeObject.props;

    if (ussdBalanceRequest) {
      this.setState({ ussdInput: ussdBalanceRequest });
    }
  }

  openProgressbar = (title) => {
    this.setState({ bigProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ bigProgress: false });
  };

  onSave() {
    const { navigation, changeObjectCard } = this.props;
    const oid = navigation.getParam('oid');
    this.openProgressbar(L('saving_settings'));
    const hideProgressbar = this.hideProgressbar;
    const card = {
      ussdBalanceRequest: this.state.ussdInput,
    };
    changeObjectCard(oid, card, (pr, packet) => {
      hideProgressbar();
      const { data } = packet;
      if (0 === data.result) {
        NavigationService.back();
      } else {
        Alert.alert(L('error'), L('failed_to_save_settings', [data.error]), [{ text: 'OK', style: 'cancel' }], {
          cancellable: true,
        });
      }
    });
  }

  onRefreshBalance() {
    const ussd = this.state.ussdInput.trim();

    const { navigation, executeUssdRequest } = this.props;
    const oid = navigation.getParam('oid');
    this.setState({ inProgress: true });
    executeUssdRequest(oid, ussd, (pr, packet) => {
      this.setState({ inProgress: false });
      const { data } = packet;
      console.log(data);
    });
  }

  render() {
    const { objects, navigation } = this.props;
    const oid = navigation.getParam('oid');

    let activeObject = {
      states: {
        ussdBalance: null,
      },
    };
    const obj = objects[oid + ''];
    activeObject = obj ? obj : activeObject;
    let { ussdBalance } = activeObject.states;
    let balance = '0.00';
    let balance_ts = '';
    try {
      const b = JSON.parse(ussdBalance);
      if (b.balance) {
        balance = b.balance;
      }
      if (b.currency) {
        balance += ' ' + b.currency;
      }
      if (b.ts) {
        balance_ts = Utils.makeElapsedDate(new Date(b.ts));
      }
      if (b.error) {
        switch (b.error) {
          case 'perm':
            balance_ts = L('balance_no_permissions');
            break;
          case 'supp':
            balance_ts = L('balance_not_supported');
            break;
          default:
            balance_ts = L('balance_error', [b.error]);
        }
      }
    } catch (e) {}
    return (
      <View style={styles.container}>
        <Text style={styles.hint}>{L('specify_ussd_for_balance')}</Text>
        <AuthInput
          style={styles.auth_input}
          icon={null}
          font="material"
          hint={L('hint_ussd_request')}
          keyboardType="phone-pad"
          editable={!this.state.isProgress}
          value={this.state.ussdInput}
          iconColor="black"
          palceholderTextColor="rgba(0,0,0,0.5)"
          selectionColor="blue"
          textColor="black"
          onChangeText={(text) => {
            this.setState({ ussdInput: text });
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
          title={this.state.isProgress ? L('checking') : L('check_balance')}
          onPress={this.onRefreshBalance.bind(this)}
        />
        <Text style={styles.balance}>
          {L('balance')}: {balance}
        </Text>
        <Text style={styles.balance_ts}>{balance_ts}</Text>
        <CustomProgressBar visible={this.state.bigProgress} title={this.state.progressTitle} />
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
    changeObjectCard: bindActionCreators(controlActionCreators.changeObjectCard, dispatch),
    executeUssdRequest: bindActionCreators(controlActionCreators.executeUssdRequest, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupBalancePage);

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
  balance: {
    marginTop: 20,
    fontSize: 32,
  },
  btnSave: {
    color: 'white',
    marginRight: 10,
  },
});
