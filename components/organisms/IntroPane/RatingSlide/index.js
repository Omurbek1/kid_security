import React, {Fragment} from "react";
import {Image, ImageBackground, PixelRatio, Text as NText, View} from "react-native";
import {L} from "../../../../lang/Lang";
import style from "./style";
import {borders} from "../style";
import textStyle from "../textStyles";

//title
//text
//author

const Text = (props) => <NText adjustsFontSizeToFit minimumFontScale={.5} allowFontScaling {...props}/>

const RatingSlide = ({node, width, height}) => {
  let slide = node.item;
  let Star = ({size = PixelRatio.get()}) => <View style={{borderWidth:borders}}>
    <Image
      source={require("../../../../img/assets/intro/star.png")}
      height={30*size/2.5}
      width={30*size/2.5}
      resizeMode="contain"
      style={{
        width: 30*size/2.5,
        height: 30*size/2.5,
      }}
    />
  </View>

  let Stars = ({current,max}) => {
    let render = []
    for (let i = 0 ; i < current; i++) {
      render.push(<Star key={i}/>);
    }
    return render;
  }
  return <View style={{...style.container,
    width:width||"100%", height:height||"100%",paddingLeft:20,paddingRight:20
  }}>
    <View
      style={{...style.topWrapper}}
    >
      <Stars max={slide.maxRating} current={slide.rating}/>
    </View>
    <View
      style={{...style.centerWrapper}}
    >
      <Text style={{...textStyle.h3TextWhite,fontWeight:"bold"}}>{slide.title}</Text>
      <Text style={{...textStyle.h4TextWhite}}>{slide.text}</Text>
    </View>
    <View
      style={{...style.bottomWrapper}}
    >
      <Text style={{...textStyle.h5TextWhite}}>{slide.author}</Text>
    </View>
  </View>
}

export default RatingSlide;
