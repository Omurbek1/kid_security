import {Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {L} from "../../../../lang/Lang";
import {LinearGradient} from "expo-linear-gradient";
import textStyle from "../textStyles";

const Brand = ({brand}) => {
  let source = brand?.img ? {source:brand?.img}:{};
  return <View style={{width:30,height:30,flexDirection:"row",alignItems:"center"}}>
    <Image
      {...source}
      height={30}
      width={30}
      resizeMode="contain"
      style={{
        width: 33,
        height: 33,
      }}
    />
    <View
      style={{
        backgroundColor:"#E19297",
        height:15,
        borderRadius:18,
        paddingLeft:5,
        paddingRight:5,
        justifyContent: "center"
      }}
    >
      <Text style={{...textStyle.h4TextBlack,fontWeight:"bold",width:"100%"}}>{brand?.text}</Text>
    </View>
  </View>
}

export default Brand
