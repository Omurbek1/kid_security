import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {bindActionCreators} from "redux";
import {popupActionCreators, popupSelectors} from "../../../reducers/popupRedux";
import {connect} from "react-redux";
import Dialog from "react-native-popup-dialog";
import {controlActionCreators} from "../../../reducers/controlRedux";
import styles from "./styles";
import textStyles from "../../textStyles";
import {L} from "../../../lang/Lang";
import {isPinCodeHintShown,setPinCodeHintShown} from "../../../UserPrefs";
import * as Utils from "../../../Utils";

const win = Dimensions.get('window');

let titleTextStyle = {
  textAlign:"center",
  color:"#000",
}
let btn1TextStyle = {
  fontWeight:'500',
  textAlign:"center",
  color:"#FFF"
}
let btn2TextStyle = {
  textAlign:"center",
  color:"#000"
}

function PinCodeHintDialog({oid = undefined,...props}){
  const { dialogPinCodeHint, dialogPinCodeHintDetail } = props;
  const { togglePinCodeHintDialog, toggleDialogPinCodeHintDetail } = props;
  const { wiretappedNewRecords, objects } = props;

  const object = objects[oid + ''];
  const iosChatObject = Utils.isIosChatObject(object);

  useEffect(()=>{
    //setPinCodeHintShown(false).then()
    let timer;
    if(wiretappedNewRecords){
      if(!iosChatObject){
        isPinCodeHintShown().then((res)=>{
          if(!res){
            setPinCodeHintShown(true).then()
            timer = setTimeout(()=>{togglePinCodeHintDialog(true)},2000);
          }
        })
      }
    }
    return ()=>{clearTimeout(timer);}
  },[wiretappedNewRecords])

  useEffect(()=>{
    if(!dialogPinCodeHint) {
      if(dialogPinCodeHintDetail){
        //toggleDialogPinCodeHintDetail(false);
      }
    }
  },[dialogPinCodeHint])

  const agreeHandler = async () => {
    await setPinCodeHintShown(true).then(()=>{
      togglePinCodeHintDialog(false);
    });
  }

  return <Dialog
    visible={dialogPinCodeHint}
    rounded={ true }
    containerStyle={ styles.dialog }
    onHardwareBackPress={()=>togglePinCodeHintDialog(false)}
  >
    {dialogPinCodeHint ?
      <View style={ styles.wrapper}>
        <Text style={{...textStyles.textSize(20), ...titleTextStyle}}>{L('pin_manual')}</Text>
        <TouchableOpacity
          color="white"
          style={{...styles.button, marginTop:40, marginBottom:10}}
          onPress={()=>{
            toggleDialogPinCodeHintDetail(true);
            togglePinCodeHintDialog(false);
          }}
        >
          <Text style={{...textStyles.textSize(18), ...btn1TextStyle}}>{L('how_do')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          color="white"
          style={{marginBottom:10}}
          onPress={agreeHandler}>
          <Text style={{...textStyles.textSize(15), ...btn2TextStyle}}>{L('not_inter')}</Text>
        </TouchableOpacity>
      </View>
      :
      null
    }
  </Dialog>
}

const mapStateToProps = (state) => {
  const { objects, wiretappedNewRecords } = state.controlReducer;
  return {
    objects,
    wiretappedNewRecords,
    userProps:state.authReducer.userProps,
    dialogPinCodeHint:popupSelectors.getDialogPinCodeHint(state),
    dialogPinCodeHintDetail:popupSelectors.getDialogPinCodeHintDetail(state),
    userId:state.authReducer.userId
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    emitInviteToken: bindActionCreators(controlActionCreators.emitInviteToken, dispatch),
    togglePinCodeHintDialog: bindActionCreators(popupActionCreators.togglePinCodeHintDialog, dispatch),
    toggleDialogPinCodeHintDetail: bindActionCreators(popupActionCreators.toggleDialogPinCodeHintDetail, dispatch),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(PinCodeHintDialog);
