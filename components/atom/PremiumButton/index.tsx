import React, { Children, Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { L } from '../../../lang/Lang';

interface PremiumButtonProps {
  style?: ViewStyle;
  onPress: () => void;
  leftTop?: String;
  leftBot?: String;
  rightTop?: String;
  rightBot?: String;
  leftTopStyle?: TextStyle;
  leftBotStyle?: TextStyle;
  rightTopStyle?: TextStyle;
  rightBotStyle?: TextStyle;
  textBaseStyle?: TextStyle | TextStyle[];
  bestOffer?: boolean;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  onPress,
  style,
  leftTop,
  leftBot,
  rightBot,
  rightTop,
  textBaseStyle,
  leftBotStyle,
  leftTopStyle,
  rightBotStyle,
  rightTopStyle,
  bestOffer
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {
      bestOffer && 
      <View style={styles.bestOffer}>
        <Text style={{color: 'black',fontSize:12}}>{L('most_popular')}</Text>
      </View>
      }
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>

        <Text style={[textBaseStyle, leftTopStyle]}>{leftTop}</Text>

        <Text style={[textBaseStyle, rightTopStyle]}>{rightTop}</Text>
      </View>
      {leftBot && rightBot && (
        <Fragment>
          <View style={{ width: 10 }}></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {leftBot ? (
              <View style={{ marginTop: 10 }}>
                <Text style={[textBaseStyle, leftBotStyle]}> {leftBot}</Text>
              </View>
            ) : null}

            {rightBot ? (
              <View style={{ marginTop: 10 }}>
                <Text style={[textBaseStyle, rightBotStyle]}>{rightBot}</Text>
              </View>
            ) : null}
          </View>
        </Fragment>
      )}
    </TouchableOpacity>
  );
};

export default PremiumButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    // alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  bestOffer: {
    position: 'absolute', top: -10, right: -5, zIndex: 2, padding: 3, backgroundColor: '#FFE600', borderRadius:5
  }
});
