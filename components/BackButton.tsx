import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';
import { popupActionCreators } from '../reducers/popupRedux';

interface BackButtonProps {
    onBack: () => void;
    showPremiumModal: (isPremiumModalVisible: boolean) => void;
    showPremium: boolean;
};

class BackButton extends Component<BackButtonProps> {
    render() {
        const { onBack, showPremiumModal, showPremium = true } = this.props;

        return <HeaderBackButton tintColor="white" onPress={() => {
            onBack();
            { showPremium && showPremiumModal(true) }
        }} />
    };
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BackButton);
