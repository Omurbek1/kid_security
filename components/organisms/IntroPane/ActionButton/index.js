import {Text, TouchableOpacity} from "react-native";
import React from "react";
import {L} from "../../../../lang/Lang";
import {LinearGradient} from "expo-linear-gradient";

const ActionButton = ({label = undefined,style = {}, onPress = ()=>{}, labelStyle = {}, gradient = undefined, children = undefined}) => {
  const TextStyled = ({text}) => <Text
    style={{
      textAlignVertical:"center",
      color:"#FFFFFF",
      fontSize:20,
      ...labelStyle
    }}
  >
    {text}
  </Text>

  return <TouchableOpacity
    style={{
      flexDirection: 'column',
      height:50,
      width:250,
      alignItems:"center",
      justifyContent: 'center',
      borderRadius:25,
      backgroundColor:"#FF6670",
      ...style
    }}
    onPress={onPress}
  >
    {gradient ?
      <LinearGradient
        style={{
          flexDirection: 'column',
          height:50,
          width:250,
          alignItems:"center",
          justifyContent: 'center',
          borderRadius:25,
        }}
        colors={gradient}
      >
        {label && <TextStyled text={label}/>}
        {children !== undefined && children}
      </LinearGradient>
      :
      <>
        {label && <TextStyled text={label}/>}
        {children !== undefined && children}
      </>
    }
  </TouchableOpacity>
}

export default ActionButton
