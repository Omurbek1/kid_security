import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import AchievementMenuList from '../components/organisms/AchievementMenuList';
import ChildTaskList from '../components/organisms/ChildTaskList';
import KsAlign from '../components/atom/KsAlign';
import Typography from '../components/atom/KsTypography';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import ChildTasksHistory from '../components/organisms/ChildTasksHistory';
import ChildDreamsList from '../components/organisms/ChildDreamsList';
import ChildCompletedDreamList from '../components/organisms/ChildCompletedDreamsList';
import { L } from '../lang/Lang';
import DreamsList from '../components/organisms/DreamsList';
import HeaderTitleWithSpinner from '../components/molecules/HeaderTitleWithSpinner';
import NavigationService from '../navigation/NavigationService';
import AlertPane from '../components/AlertPane';

export class ChildDreamsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
  }

  static navigationOptions = () => {
    return {
      headerTitle: () => <HeaderTitleWithSpinner title={L('child_dreams')}></HeaderTitleWithSpinner>,
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
            <DreamsList
              showAddKidAlert={() => {
                this.setState({ showAlert: true });
              }}></DreamsList>
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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default ChildDreamsPage;
