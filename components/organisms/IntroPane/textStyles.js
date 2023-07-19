import {Dimensions, PixelRatio, StyleSheet} from "react-native";

const win = Dimensions.get('window');

const s = (size) => size/400*win.width;

const styles = StyleSheet.create({
  h1TextBlack: {fontSize:s(36),color:"#000",textAlign:"center",fontWeight:"bold"},
  h1TextWhite: {fontSize:s(36),color:"#FFF",textAlign:"center",fontWeight:"bold"},
  h1TextRed: {fontSize:s(36),color:"red",textAlign:"center",fontWeight:"bold"},
  h2TextBlack: {fontSize:s(26),color:"#000",textAlign:"center",fontWeight:"bold"},
  h2TextWhite: {fontSize:s(26),color:"#FFF",textAlign:"center",fontWeight:"bold"},
  h2TextRed: {fontSize:s(26),color:"red",textAlign:"center",fontWeight:"bold"},
  h3TextBlack: {fontSize:s(18),color:"#000",textAlign:"center"},
  h3TextWhite: {fontSize:s(18),color:"#FFF",textAlign:"center"},
  h3TextRed: {fontSize:s(18),color:"red",textAlign:"center"},
  h4TextBlack: {fontSize:s(14),color:"#000",textAlign:"center"},
  h4TextSemiBlack: {fontSize:s(14),color:"#454545",textAlign:"center"},
  h4TextWhite: {fontSize:s(14),color:"#FFF",textAlign:"center"},
  h4TextRed: {fontSize:s(14),color:"red",textAlign:"center"},
  h5TextBlack: {fontSize:s(10),color:"#000",textAlign:"center"},
  h5TextWhite: {fontSize:s(10),color:"#FFF",textAlign:"center"},
  h5TextRed: {fontSize:s(10),color:"red",textAlign:"center"},
  bold:{fontWeight:"bold"},
  textSize:(size)=>({fontSize:s(size)})
});

export default styles;
