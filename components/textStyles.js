import {Dimensions, PixelRatio, StyleSheet} from "react-native";

const win = Dimensions.get('window');

const s = (size) => size/400*win.width;

const styles = StyleSheet.create({
  textSize:(size)=>({fontSize:s(size)})
});

export default styles;
