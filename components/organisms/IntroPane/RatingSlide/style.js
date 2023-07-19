import {StyleSheet} from "react-native";
import {borders} from "../style";

const style = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:borders,
  },
  header: {
    display:"flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft:10,
    paddingRight:10,
    borderWidth:borders,
  },
  topWrapper: {
    width:"100%",
    display:"flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:borders,
  },
  centerWrapper: {
    width:"100%",

    display:"flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:borders,
  },
  bottomWrapper: {
    width:"100%",
    display:"flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:borders,
  },
  textTitle: {fontSize:25,fontWeight:"bold",color:"#FFF",marginTop:10,textAlign:"center"},
  textMain: {fontSize:10,color:"#FFF",marginTop:10,textAlign:"center"},
  textAuthor: {fontSize:10,color:"#FFF",marginTop:10,textAlign:"center"},
});

export default style;
