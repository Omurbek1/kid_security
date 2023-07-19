import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TextInput, View, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { APIService } from '../../../../Api';
import { L } from '../../../../lang/Lang';
import UserPrefs from '../../../../UserPrefs';
import * as Utils from '../../../../Utils';
import { NewColorScheme } from '../../../../shared/colorScheme';
import { slideTypes } from '../types';
import Slide from '../Slide';
import styles from './style';
import { firebaseAnalitycsLogEvent, firebaseAnalyticsForNavigation } from '../../../../analytics/firebase/firebase';

const { width, height } = Dimensions.get('window');
const { PINK_COLOR_1, ORANGE_COLOR_1, GREY_COLOR_2, RED_COLOR } = NewColorScheme;

const WelcomeSlider = ({ context, setContext }) => {
  let timeSliderRef = useRef(null);
  let currentIndex = useRef(0);
  let shakeAnimation = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuresList, setFeaturesList] = useState([
    {
      title: L('znat_mestopolozhenie'),
      isSelected: false,
    },
    {
      title: L('controlirovat'),
      isSelected: false,
    },
    {
      title: L('podat'),
      subtitle: L('esli_u_rebenka'),
      isSelected: false,
    },
    {
      title: L('slushat'),
      isSelected: false,
    },
    {
      title: L('znat_kto_chto'),
      isSelected: false,
    },
    {
      title: L('intro_geofance'),
      isSelected: false,
    },
    {
      title: L('davat_zadaniya'),
      isSelected: false,
    },
  ]);
  const [amountList, setAmountList] = useState([
    { title: '1', isSelected: false, subtitle: '' },
    { title: '2', isSelected: false, subtitle: '' },
    { title: '3', isSelected: false, subtitle: '' },
    { title: '4', isSelected: false, subtitle: L('i_bolee') },
  ]);
  const [isEmptyName, setIsEmptyName] = useState(false);

  useEffect(() => {
    firebaseAnalitycsLogEvent(
      'open_slide',
      {
        screen_name: 'onboardingGamification',
        slide_name: 'onboardingUserName',
      },
      true
    );
    firebaseAnalyticsForNavigation('WelcomeSlider');
  }, []);

  const startShaking = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 20, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -20, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 20, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const nextSlideHandler = (index) => {
    const slideAnaliticsMap = {
      1: 'onboardingWhatFeatures',
      2: 'onboardingHowManyChildren',
      3: 'onboardingGreetings',
    };
    firebaseAnalitycsLogEvent(
      'open_slide',
      {
        screen_name: 'onboardingGamification',
        slide_name: slideAnaliticsMap[index],
      },
      true
    );
    if (currentIndex.current < slidesData.length - 1) {
      currentIndex.current = index;
    }

    if (context.name) {
      setActiveIndex(index);
    }

    if (index === 1 && !UserPrefs.all.userLocationCountry) {
      Utils.getLocationCountry();
    }

    timeSliderRef?.current?.scrollToIndex({ animated: true, index: currentIndex.current });
  };

  const scipSlide = (index: number) => {
    const slideAnaliticsMap = {
      1: 'onboardingUserName',
      2: 'onboardingWhatFeatures',
      3: 'onboardingHowManyChildren',
      4: 'onboardingGreetings',
    };
    return async () => {
      firebaseAnalitycsLogEvent(
        'tap_skip',
        {
          screen_name: 'onboardingGamification',
          slide_name: slideAnaliticsMap[index],
        },
        true
      );
      const country = UserPrefs.all.userLocationCountry;
      const isRusshianAndAndroid = country === 'Russia' && Platform.OS === 'android';
      
      setContext((prev) => ({
        ...prev,
        type: context.hasPremium || isRusshianAndAndroid ? slideTypes.DONE : slideTypes.STORE,
      }));
    };
  };

  const keyExtractor = (_, index) => `${index}`;

  const renderFeature = (item) => {
    const {
      index,
      item: { title, subtitle, isSelected },
    } = item;

    return (
      <TouchableOpacity
        style={styles.featureItem}
        onPress={() => {
          let newList = featuresList;

          newList.map((item, idx) => {
            if (idx === index) newList[idx].isSelected = !isSelected;
          });

          setFeaturesList([...newList]);
        }}>
        <View
          style={[styles.checkFeature, isSelected && { backgroundColor: PINK_COLOR_1, borderColor: PINK_COLOR_1 }]}
        />
        <View style={styles.titleWrapper}>
          <Text style={styles.featureTitle}>{title}</Text>
          {subtitle && <Text style={styles.featureSubtitle}>{subtitle}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAmount = (item) => {
    const {
      index,
      item: { title, isSelected, subtitle },
    } = item;
    const gradientColors = isSelected ? [PINK_COLOR_1, PINK_COLOR_1] : [PINK_COLOR_1, ORANGE_COLOR_1];
    const amountStyle = {
      backgroundColor: isSelected ? PINK_COLOR_1 : '#FFFFFF',
      paddingHorizontal: index === 0 ? 52 : index === 3 ? 37 : 50,
    };
    const gradientStyle = {
      borderRadius: 20,
      marginLeft: index === 1 || index == 3 ? 23 : 0,
      shadowColor: ORANGE_COLOR_1,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 6,
      shadowOpacity: 0.25,
    };

    return (
      <LinearGradient colors={gradientColors} start={[0, 1]} end={[1, 0]} locations={[0, 1.0]} style={gradientStyle}>
        <TouchableOpacity
          style={[styles.amountItem, amountStyle]}
          onPress={() => {
            let newList = amountList;

            newList.map((item, idx) => {
              if (newList[idx].isSelected) newList[idx].isSelected = false;
              if (idx === index) newList[idx].isSelected = !isSelected;
            });

            setAmountList([...newList]);
          }}>
          <Text style={[styles.amount, isSelected && { color: '#FFFFFF' }]}>{title}</Text>
          {subtitle.length > 0 && (
            <Text style={[styles.amountSubtitle, isSelected && { color: '#FFFFFF' }]}>{subtitle}</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const interestingText = L('interesting').charAt(0).toLowerCase() + L('interesting').slice(1);

  const slidesData = [
    {
      id: 1,
      skip: scipSlide(1),
      require: [!context.loading],
      centerView: (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Image source={require('../../../../img/intro_welcome.png')} style={styles.welcomeImg} />
          </View>
          <View style={{ flex: 2, justifyContent: 'space-around' }}>
            <Text style={styles.welcomeTitle}>{L('welcome')}</Text>
            <View>
              <Text style={styles.parentName}>{L('parent_name')}</Text>
              <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
                <TextInput
                  placeholder={L('your_name')}
                  style={styles.nameInput}
                  onChangeText={(name) => {
                    setIsEmptyName(false);
                    setContext({ name });
                  }}
                  value={context.name}
                  placeholderTextColor={isEmptyName ? RED_COLOR : GREY_COLOR_2}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      ),
      bottomButton: {
        title: L('next'),
        onPress: () => {
          if (context.name) {
            nextSlideHandler(1);
          } else {
            setIsEmptyName(true);
            startShaking();
          }
        },
      },
      activeIndex,
    },
    {
      id: 2,
      skip: scipSlide(2),
      require: [context.name, !context.loading],
      centerView: (
        <View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.questionTitle}>{context.name + ', ' + interestingText}</Text>
          </View>
          <View style={{ flex: 4 }}>
            <FlatList
              data={featuresList}
              renderItem={renderFeature}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.featureList}
            />
          </View>
        </View>
      ),
      bottomButton: {
        title: L('next'),
        onPress: () => {
          const parentFormData = {
            "Know the child's location": featuresList[0].isSelected,
            "Monitor playtime on your child's phone": featuresList[1].isSelected,
            'Send a loud signal': featuresList[2].isSelected,
            'Listen to the sounds around the baby': featuresList[3].isSelected,
            'Knowing who and what is texting my child': featuresList[4].isSelected,
            'Receive notifications when a child has left/entered a certain place': featuresList[5].isSelected,
            'To give tasks to a child': featuresList[6].isSelected,
          };

          APIService.saveParentFormData(parentFormData);
          nextSlideHandler(2);
        },
      },
      activeIndex,
    },
    {
      id: 3,
      skip: scipSlide(3),
      require: [context.name, !context.loading],
      centerView: (
        <View>
          <View style={{ flex: 1.5, justifyContent: 'center' }}>
            <Text style={styles.questionTitle}>{L('intro_how_child', [context.name])}</Text>
          </View>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <FlatList
              data={amountList}
              renderItem={renderAmount}
              numColumns={2}
              contentContainerStyle={[styles.amountList, { alignItems: 'center' }]}
              columnWrapperStyle={{ marginBottom: width / 9 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.childrenSubtitle}>{L('vi_mozhete_dobavlyat')}</Text>
          </View>
        </View>
      ),
      bottomButton: {
        title: L('next'),
        onPress: () => nextSlideHandler(3),
      },
      activeIndex,
    },
    {
      id: 4,
      skip: scipSlide(4),
      require: [context.name, !context.loading],
      centerView: (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Image source={require('../../../../img/intro_statistics.png')} style={styles.statisticsImg} />
          </View>
          <View style={{ flex: 2, justifyContent: 'space-evenly' }}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={styles.statisticsTitle}>{L('polzovatelei')}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
              <View>
                <Text style={styles.statisticsSubtitle}>{L('stali_menshe')}</Text>
                <View style={styles.pinkSeparator} />
              </View>
              <View>
                <Text style={styles.statisticsSubtitle}>{L('ispolzuut_app')}</Text>
                <View style={styles.pinkSeparator} />
              </View>
            </View>
          </View>
        </View>
      ),
      bottomButton: {
        title: L('next'),
        onPress: () => setContext((prev) => ({ ...prev, type: slideTypes.LOADING })),
      },
      activeIndex,
    },
  ];

  return (
    <FlatList
      keyExtractor={(item) => item.id.toString()}
      ref={timeSliderRef}
      data={slidesData}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      style={{ backgroundColor: '#FFFFFF' }}
      renderItem={(node) => <Slide width={width} height={height} node={node} page="welcome" />}
    />
  );
};

export default WelcomeSlider;
