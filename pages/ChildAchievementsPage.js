import React, { Component } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, BackHandler } from 'react-native';
import AchievementMenuList from '../components/organisms/AchievementMenuList';
import ChildTaskList from '../components/organisms/ChildTaskList';
import KsAlign from '../components/atom/KsAlign';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { L } from '../lang/Lang';
import HeaderTitleWithSpinner from '../components/molecules/HeaderTitleWithSpinner';
import NavigationService from '../navigation/NavigationService';
import { Icon } from 'react-native-elements';

export class ChildAchievementsPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitleWithSpinner title={L('menu_achievments')}></HeaderTitleWithSpinner>,
      headerBackground: (
        <LinearGradient
          style={{ flex: 1 }}
          colors={['#ef4c77', '#fe6f5f', '#ff8048']}
          start={[0, 1]}
          end={[1, 0]}
          locations={[0, 0.5, 1.0]}></LinearGradient>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            const backTo = navigation.getParam('backTo');
            if (backTo) {
              NavigationService.navigate(backTo);
            } else {
              NavigationService.back();
            }
          }}>
          <Icon name="chevron-left" type="material-community" color="white" size={34}>
            Back
          </Icon>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 16,
      },
    };
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  onBackButtonPress = () => {
    NavigationService.back();
    return true;
  };

  render() {
    return (
      <SafeAreaView>
        <ScrollView style={{ height: hp('100%'), backgroundColor: '#F8F7F5' }}>
          <KsAlign style={styles.container} elementsGap={60}>
            <AchievementMenuList />
            <KsAlign elementsGap={20}>
              <ChildTaskList />
            </KsAlign>
          </KsAlign>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
  },
});

export default ChildAchievementsPage;
