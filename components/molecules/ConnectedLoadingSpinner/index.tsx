import React from 'react';
import { connect } from 'react-redux';
import { KidSecurityState } from '../../../store/types';
import { ActivityIndicator, View } from 'react-native';

const ConnectedLoadingSpinner = ({ loading, color }) => {
  return loading.isLoading ? <ActivityIndicator animating={true} color={color || '#fff'} /> : null;
};

const mapStateToProps = (state: KidSecurityState) => {
  return {
    loading: state.achievementReducer.loading,
  };
};

export default connect(mapStateToProps)(ConnectedLoadingSpinner);
