import {StyleSheet} from "react-native";

const style = StyleSheet.create({
  container: {
    flexDirection:"column",
    justifyContent:"center",
    marginTop:25,
    padding:10,
    borderWidth:0,
    width:"100%"
  },
  column:{
    flex:1,
    flexDirection:"column",
    justifyContent:"space-around",
    borderWidth:0,
  },
  row:{
    flexDirection:"row",
    minHeight:70,
    justifyContent:"space-around",
    borderWidth:0,
  },
  checkboxItem:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    margin:5,
    borderWidth:0,
    borderRadius:30,
    padding:10,
    paddingLeft:25,
    backgroundColor:"#FFB1B7"
  },
  itemLeft:{
    flex:1,
    borderWidth:0,
    alignContent:"center",
    justifyContent:"center",
  },
  itemRight:{

  },
  itemCheckbox:{
    width:20,
    height:20,
    borderWidth: 0,
  },
  itemText:{
    color:"#000000",
    fontSize:12,
    textAlign:"center",
    alignSelf:"center",
    justifyContent:"center",
    borderWidth:0,
    fontWeight:"bold"
  }
});

export default style;
