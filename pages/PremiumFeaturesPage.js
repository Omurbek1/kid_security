import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { popupActionCreators } from '../reducers/popupRedux';
import AppIntroSlider from '../components/slider/AppIntroSlider';
import NavigationService from '../navigation/NavigationService';
import UserPrefs from '../UserPrefs';
import { L } from '../lang/Lang';

let slides = [];

function initSlides() {
  slides = [
    {
      key: '1',
      image: require('../img/premiumFeature1.png'),
      text: L('prem_feature_1'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '2',
      image: require('../img/premiumFeature2.png'),
      text: L('prem_feature_2'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '3',
      image: require('../img/premiumFeature3.png'),
      text: L('prem_feature_3'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '4',
      image: require('../img/premiumFeature4.png'),
      text: L('prem_feature_4'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '5',
      image: require('../img/premiumFeature5.png'),
      text: L('prem_feature_5'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
  ];
}

class PremiumFeaturesPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  state = {
    currentIndex: 0,
  };

  UNSAFE_componentWillMount() {
    initSlides();
  }

  buttonTitles = [
    {
      title: L('intro_1_button'),
    },
    {
      title: L('intro_2_button'),
    },
    {
      title: L('intro_3_button'),
    },
    {
      title: L('intro_4_button'),
    },
    {
      title: L('intro_5_button'),
    },
  ];
  _renderNextButton = () => {
    const buttonTitle = this.buttonTitles[this.state.currentIndex]?.title ?? L('next');
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonNext}>
          <Text style={styles.text}>{buttonTitle}</Text>
        </View>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonDone}>
          <Text style={styles.text}>{L('buy_premium')}</Text>
        </View>
      </View>
    );
  };

  _renderItem = ({ item, dimensions }) => (
    <View
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: item.backgroundColor,
        },
      ]}>
      <Image source={item.image} resizeMode="contain" style={[item.imageStyle, {}]} />
      <View style={styles.header}>
        <Text style={styles.headerText}>{item.text}</Text>
      </View>
    </View>
  );

  doSkip() {
    this.slider.goToSlide(slides.length - 1);
  }

  onShowHidePremiumModal = () => {
    const { isPremiumModalVisible, showPremiumModal } = this.props;

    showPremiumModal(!isPremiumModalVisible);
  };

  render() {
    const { navigation, objects } = this.props;

    const backToProp = navigation.getParam('backTo');
    const objectsLength = Object.keys(objects).length;
    const backTo = backToProp ? backToProp : 'Main';

    return (
      <>
        <AppIntroSlider
          activeDotStyle={(style = { backgroundColor: '#FF666F' })}
          backgroundColor="white"
          ref={(ref) => (this.slider = ref)}
          slides={slides}
          onDone={this._onDone}
          renderItem={this._renderItem}
          hideNextButton={false}
          renderNextButton={this._renderNextButton}
          renderDoneButton={this._renderDoneButton}
          showSkipButton={false}
          bottomButton={true}
          onSkip={this.doSkip.bind(this)}
          onSlideChange={(index, lastIndex) => {
            this.setState({ currentIndex: index });
          }}
          onDone={async () => {
            await UserPrefs.setPremiumFeaturesShown(true);
            NavigationService.navigate(backTo);
            this.onShowHidePremiumModal();
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;
  const { isPremiumModalVisible } = state.popupReducer;

  return { objects, isPremiumModalVisible };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PremiumFeaturesPage);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  image: {
    width: '82%',
    height: '68%',
    marginTop: 30,
    paddingBottom: 30,
  },
  buttonNext: {
    width: 250,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF666F',
  },
  buttonDone: {
    width: 250,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4466d6',
  },
  buttonContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  headerText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
  },
  header: {
    paddingLeft: 30,
    paddingRight: 30,
  },
});
