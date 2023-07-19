import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import AppIntroSlider from '../components/slider/AppIntroSlider';
import NavigationService from '../navigation/NavigationService';
import UserPrefs from '../UserPrefs';
import { L } from '../lang/Lang';
import * as Metrica from '../analytics/Analytics';

let slides = [];

function initSlides() {
  slides = [
    {
      key: '1',
      image: require('../img/intro_1.png'),
      text: L('intro_1'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '2',
      image: require('../img/intro_2.png'),
      text: L('intro_2'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    /*{
      key: '3',
      image: require('../img/intro_3.png'),
      text: L('intro_3'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '4',
      image: require('../img/intro_4.png'),
      text: L('intro_4'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '5',
      image: require('../img/intro_5.png'),
      text: L('intro_5'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '6',
      image: require('../img/intro_6.png'),
      text: L('intro_6'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '7',
      image: require('../img/intro_7.png'),
      text: L('intro_7'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '8',
      image: require('../img/intro_8.png'),
      text: L('intro_8'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '9',
      image: require('../img/intro_9.png'),
      text: L('intro_9'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },*/
    {
      key: '10',
      image: require('../img/intro_10.png'),
      text: L('intro_10'),
      imageStyle: [styles.image],
      backgroundColor: 'white',
    },
  ];
}

class IntroPage extends React.Component {
  static navigationOptions = () => {
    return {
      //header: null
    };
  };

  UNSAFE_componentWillMount() {
    initSlides();
  }

  componentDidMount() { }

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

  _renderNextButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonNext}>
          <Text style={styles.text}>{L('next')}</Text>
        </View>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonDone}>
          <Text style={styles.text}>{L('start_using_the_app')}</Text>
        </View>
      </View>
    );
  };

  doSkip() {
    this.slider.goToSlide(slides.length - 1);
  }

  render() {
    const { authorized } = this.props;

    return (
      <AppIntroSlider
        activeDotStyle={(style = { backgroundColor: '#FF666F' })}
        backgroundColor="white"
        ref={(ref) => (this.slider = ref)}
        slides={slides}
        renderItem={this._renderItem}
        hideNextButton={false}
        renderNextButton={this._renderNextButton}
        renderDoneButton={this._renderDoneButton}
        showSkipButton={false}
        bottomButton={true}
        onSkip={this.doSkip.bind(this)}
        onSlideChange={(index, lastIndex) => {
          Metrica.event('funnel_intro', { mode: 'sliding', index, lastIndex: slides.length - 1 });
        }}
        onDone={async () => {
          Metrica.event('funnel_intro', { mode: 'finished' });
          await UserPrefs.setIntroShown(true);
          NavigationService.forceReplace('Main');
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { username, password } = state.authReducer;
  return {
    username,
    password,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroPage);

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
