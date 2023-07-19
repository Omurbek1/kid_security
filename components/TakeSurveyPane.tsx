import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '../lang/Lang';
import ModalWindow from './molecules/ModalWindow/index';

interface TakeSurveyPaneProps {
  visible: boolean;
  onPressCancel: () => void;
  onPressSurvey: () => void;
}

const styles = StyleSheet.create({
  addPhonePane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 6,

    maxWidth: 280,
  },
  image: {
    width: 120,
    height: 120,
  },
  text1: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text2: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text3: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    color: '#000',
  },
  button_text: {
    color: 'white',
  },
  buttons: {
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  cancel_button: {
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 6,
    borderColor: '#FF666F',
    borderWidth: 1,
  },
  cancel_button_text: { color: '#000' },
});

const TakeSurveyPane: React.FC<TakeSurveyPaneProps> = (props) => {
  return (
    <ModalWindow
      onTouchOutside={props.onPressCancel}
      visible={props.visible}
      style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.addPhonePaneContent}>
        <Text style={styles.text3}>{L('take_survey_and_get_free_minutes')}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancel_button} onPress={props.onPressCancel}>
            <Text style={styles.cancel_button_text}>{L('later')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (props.onPressSurvey) {
                props.onPressSurvey();
              }
              //NavigationService.navigate('BuyPremium');
            }}>
            <Text style={styles.button_text}>{L('take_survey')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalWindow>
  );
};

export default TakeSurveyPane;
