import React from 'react';
import { Image, Text, View, Dimensions, Platform } from 'react-native';
import { L } from '../../../../lang/Lang';
import UserPrefs from '../../../../UserPrefs';
import { GradientButton } from '../../../../components';
import { slideTypes } from '../types';
import Slide from '../Slide';
import styles from './style';
import { firebaseAnalitycsLogEvent } from '../../../../analytics/firebase/firebase';

const { width, height } = Dimensions.get('window');

interface CompletePageProps {
  context: {};
  setContext: any;
}

interface CompletePageState {
  country: string;
}

class CompletePage extends React.Component<CompletePageProps, CompletePageState> {
  state = {
    country: '',
  };

  async componentDidMount() {
    firebaseAnalitycsLogEvent(
      'open_slide',
      {
        screen_name: 'onboardingGamification',
        slide_name: 'onboardingEverythingReady',
      },
      true
    );
    const country = UserPrefs.all.userLocationCountry;

    this.setState({ country });
  }

  render() {
    const { context, setContext } = this.props;
    const { country } = this.state;

    const SlideData = {
      id: 1,
      skip: false,
      centerView: (
        <View>
          <View style={{ flex: 2 }}>
            <Image source={require('../../../../img/intro_complete.png')} style={styles.img} />
          </View>
          <View style={styles.bottomWrapper}>
            <View>
              <Text style={styles.title}>{L('ready', [context.name])}</Text>
              <Text style={styles.subtitle}>{L('prilozhenie_nastroeno')}</Text>
            </View>
            <GradientButton
              title={L('nachat_polzovatsya')}
              onPress={() => {
                const isRusshianAndAndroid = country === 'Russia' && Platform.OS === 'android';
                setContext((prev) => ({
                  ...prev,
                  type: context.hasPremium || isRusshianAndAndroid? slideTypes.DONE : slideTypes.STORE,
                }));
              }}
            />
          </View>
        </View>
      ),
    };

    return <Slide node={{ item: SlideData }} width={width} height={height} page="complete" />;
  }
}

export default CompletePage;
