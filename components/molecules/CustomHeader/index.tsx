import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, ViewStyle, Platform, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { L } from '../../../lang/Lang';
import { Header } from 'react-navigation';

interface CustomHeaderProps {
  style?: ViewStyle | ViewStyle[];
  backgroundColor?: string;
}
const headerHeight = Header.HEIGHT;

const CustomHeader: React.FC<CustomHeaderProps> = ({ style, children, backgroundColor }) => {
  return (
    <View style={{ backgroundColor: backgroundColor ?? 'transparent', borderBottomWidth: 0 }}>
      <View style={[styles.page_header, style]}>
        <LinearGradient
          style={styles.gradient}
          colors={['#ef4c77', '#fe6f5f', '#ff8048']}
          start={[0, 1]}
          end={[1, 0]}
          locations={[0, 0.5, 1.0]}></LinearGradient>
        {children}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  demo_container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  text: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  share_hint: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 5,
    textAlign: 'center',
  },
  bigText: {
    paddingTop: 0,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    backgroundColor: 'white',
    color: '#ff4663',
    width: '100%',
  },
  logo: {
    marginTop: 20,
    maxWidth: 120,
    maxHeight: 120,
  },
  share_button: {
    marginTop: 5,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  try_button: {
    marginBottom: 0,
    backgroundColor: '#eb6f6f',
    borderRadius: 6,
  },

  whatsappLogo: {
    width: 50,
    height: 50,
    marginLeft: 250,
    marginTop: -42,
  },

  whatsAppTouch: {
    width: 320,
    height: 60,
    backgroundColor: '#FF666F',
    borderRadius: 6,
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
  },
  textDiv: {
    width: 200,
    marginLeft: -60,
    marginTop: 10,
    textAlign: 'center',
  },
  page_header: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: Header.HEIGHT + 40,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  hdr_big: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  hdr_small: {
    marginTop: 10,
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
  },
  hdr_image: {
    maxWidth: 200,
    resizeMode: 'contain',
    marginLeft: -25,
  },
  image_outer: {
    margin: 20,
    borderRadius: 75,
    width: 150,
    height: 150,
    backgroundColor: '#ffffff2f',
  },
  button: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 45,
    backgroundColor: '#e04881',
    borderRadius: 23,
  },
  button_text: {
    color: 'white',
    paddingRight: 10,
  },
  button_outer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#f9f6f6',
  },
  code_outer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  button_inner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  code_arrow: {
    paddingRight: 20,
  },
  code_content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderLeftWidth: 1,
    borderLeftColor: '#e6e6e6',
    paddingLeft: 20,
  },
  add_text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
