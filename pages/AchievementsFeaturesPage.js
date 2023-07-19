import React from 'react';
import { Text, StyleSheet, View, Image, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import AppIntroSlider from '../components/slider/AppIntroSlider';
import NavigationService from '../navigation/NavigationService';
import UserPrefs from '../UserPrefs';
import { L } from '../lang/Lang';


let slides = [];

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
  title: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
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

// ach_feature_title_1: 'Давайте задания',
// ach_feature_text_1:'Дайте ребенку задание, которое будет развивать его',
// ach_feature_button_1:'Далее',
// ach_feature_title_2: 'Мотивируйте наградами!  ',
// ach_feature_text_2:'Мотивируйте ребенка выполнять задания. Наградой может быть, то что он давно просит',
// ach_feature_button_2:'Отлично',
// ach_feature_title_3: 'Учите достигать цели!',
// ach_feature_text_3:'Выполняя задания, ребенок копит монеты, которые может обменять на награды!',
// ach_feature_button_3:'Класс! Вперед!',

function initSlides() {
  slides = [
    {
      key: '1',
      image: require('../img/ic_ach_feature_1.png'),
      text: L('ach_feature_text_1'),
      title: L('ach_feature_title_1'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '2',
      image: require('../img/ic_ach_feature_2.png'),
      text: L('ach_feature_text_2'),
      title: L('ach_feature_title_2'),
      imageStyle: styles.image,
      backgroundColor: 'white',
    },
    {
      key: '3',
      image: require('../img/ic_ach_feature_3.png'),
      text: L('ach_feature_text_3'),
      title: L('ach_feature_title_3'),
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

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  };

  onBackButtonPress = () => {
    NavigationService.back();
    return true;
  };

  UNSAFE_componentWillMount() {
    initSlides();
  }
  buttonTitles = [
    {
      title: L('ach_feature_button_1'),
    },
    {
      title: L('ach_feature_button_2'),
    },
    {
      title: L('ach_feature_button_3'),
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
          <Text style={styles.text}>{L('ach_feature_button_3')}</Text>
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
        <Text style={styles.title}>{item.title}</Text>
        <View style={{ height: 20 }}></View>
        <Text style={styles.headerText}>{item.text}</Text>
      </View>
    </View>
  );

  doSkip() {
    this.slider.goToSlide(slides.length - 1);
  }

  render() {
    const { authorized, navigation } = this.props;

    return (
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
          await UserPrefs.setAchievementFeaturesShown(true);
          NavigationService.navigate('ChildAchievements', { jumpReg: true, backTo: 'Main' });
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PremiumFeaturesPage);
