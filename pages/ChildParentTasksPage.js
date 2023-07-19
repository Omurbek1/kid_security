import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import KsAlign from '../components/atom/KsAlign';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import TaskPane from '../components/molecules/TaskPane';
import KsButton from '../components/atom/KsButton';
import ChildUnconfirmedTaskList from '../components/organisms/ChildUnconfirmedTaskList';
import { L } from '../lang/Lang';
import HeaderTitleWithSpinner from '../components/molecules/HeaderTitleWithSpinner';
import AlertPane from '../components/AlertPane';
import NavigationService from '../navigation/NavigationService';
export class ChildParentTasksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
  }
  static navigationOptions = () => {
    return {
      headerTitle: () => <HeaderTitleWithSpinner title={L('parent_tasks')}></HeaderTitleWithSpinner>,
      headerBackground: (
        <LinearGradient
          style={{ flex: 1 }}
          colors={['#ef4c77', '#fe6f5f', '#ff8048']}
          start={[0, 1]}
          end={[1, 0]}
          locations={[0, 0.5, 1.0]}></LinearGradient>
      ),
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 16,
      },
    };
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8F7F5' }}>
        <ScrollView>
          <KsAlign style={styles.container} elementsGap={60}>
            <ChildUnconfirmedTaskList
              showAddKidAlert={() => {
                this.setState({ showAlert: true });
              }}></ChildUnconfirmedTaskList>
          </KsAlign>
        </ScrollView>
        <AlertPane
          visible={this.state.showAlert}
          titleText={L('add_photo_name')}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
          // cancelButtonText={L('cancel')}
          // onPressCancel={() => this.setState({ needPremiumVisible: false })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default ChildParentTasksPage;
