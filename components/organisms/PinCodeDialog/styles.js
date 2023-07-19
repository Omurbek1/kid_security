import {StyleSheet} from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  dialog:{
    display:"flex",
    flexDirection:"column",
    padding: 40,
    paddingTop:40,
  },
  wrapper:{
    display:"flex",
    flexDirection: "column",
    alignItems:"center",
    padding:20,
    paddingTop:40,
  },
  text1: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom:1,
  },
  text2: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom:5,
  },
  text3: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom:1,
  },
  button: {
    backgroundColor: '#EF4C77',
    borderRadius: 100,
    minWidth: 110,
    minHeight: 35,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#EF4C77',
  },

  infoDialog:{
    display:"flex",
    padding: 0,
    paddingTop:Constants.statusBarHeight,
  },
  infoWrapper:{
    flex: 1,
    display:"flex",
    flexDirection: "column",
    alignItems:"center",
    justifyContent: "center",
    padding:20,
    paddingTop:20,
    borderRadius: 0
  },
  infoWrapperRow:{
    display:"flex",
    flexDirection: "column",
    alignItems:"center",
  },
  infoImage1:{
    marginLeft:30,
    height:220,
    width:230,
  },
  infoImage2:{
    marginLeft:30,
    height:180,
    width:260,
  },

  pinWrapper:{
    display:"flex",
    flexDirection: "column",
    alignItems:"center",
    padding:20,
  },
});

export default styles;
