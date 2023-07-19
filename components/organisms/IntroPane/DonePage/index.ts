import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from '../../../../navigation/NavigationService';
import UserPrefs from '../../../../UserPrefs';

const DonePage = ({ objects }) => {
  const doneHandler = async () => {
    StatusBar.setHidden(false, 'fade');
    UserPrefs.setIntroShown(true).then();
    NavigationService.navigate('Main');
  };

  useEffect(() => {
    doneHandler().then();
  }, []);

  return null;
};

const mapStateToProps = (state) => {
  let { objects } = state.controlReducer;

  return { objects };
};

export default connect(mapStateToProps)(DonePage);
