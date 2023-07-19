import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
  wrapper:{
    display:"flex",
    margin:10
  },
  top:{
    borderWidth:0,
    alignItems:"center"
  },
  center:{
    borderWidth:0,
    height:240,
    alignItems:"center"
  },
  bottom:{
    borderWidth:0,
    alignItems:"center"
  },
  scrollView:{
    flex:1,
    borderWidth:0,
    alignItems: 'center',
    justifyContent:"space-around",
    minWidth:"100%",
    margin:0,
    padding:0,
  },
  addFriendDialog: {
    display:"flex",
    padding: 10,
    paddingTop:25,
  },
  addFriendPaneContent: {
    marginTop:10,
    marginBottom:-10,
    borderWidth:1,
    alignItems: 'center',
    minWidth:"100%",
  },
  horizontalSplit: {
    borderBottomColor: '#AAA',
    borderBottomWidth: 1,
    width:"100%",
    marginBottom:5
  },
  image: {
    width: 150,
    height: 150,
    marginBottom:1,
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 35,
    backgroundColor: '#FF666F',
    borderRadius: 6,
    marginBottom:5,
  },
  button_text: {
    color: 'white',
  },
  cancel_button: {
    position: 'absolute',
    right: 0,
    borderWidth: 0,
  },
});

export default styles;
