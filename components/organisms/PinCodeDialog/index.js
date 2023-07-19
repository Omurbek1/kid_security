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

function PinCodeDialog({oid = undefined,...props}){
  const { togglePinCodeDialog, userProps, userId, emitInviteToken, visible, objects } = props;

  let [state, setState] = useState({
    parentPinCode:objects?.[oid]?.states?.parentPinCode,
  })

  useEffect(()=>{
    setState(prev=>({ ...prev,
      parentPinCode: objects?.[oid]?.states?.parentPinCode,
    }))
  },[objects?.[oid]?.states?.parentPinCode]);

  return <Dialog
    visible={visible}
    rounded={ true }
    containerStyle={ state.info ? styles.infoDialog : styles.dialog }
    onTouchOutside={togglePinCodeDialog}
    onHardwareBackPress={togglePinCodeDialog}
  >
    {visible ?
      <View style={{...styles.pinWrapper, width:win.width-80}}>
        <Text style={{...textStyles.textSize(18), ...titleTextStyle}}>{L('pin1')}</Text>
        <Text style={{
          ...textStyles.textSize(40),
          ...titleTextStyle,
          color:"#FF6670",
          marginTop:20,
          marginBottom:20,
          fontWeight:"bold"
        }}>{state.parentPinCode}</Text>
        <TouchableOpacity
          color="white"
          style={{...styles.button}}
          onPress={() => {togglePinCodeDialog()}}>
          <Text style={{...textStyles.textSize(18), ...btn1TextStyle, fontWeight:"500"}}>OK</Text>
        </TouchableOpacity>
      </View>
      :
      null
    }
  </Dialog>
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;
  return {
    objects,
    userProps:state.authReducer.userProps,
    visible:popupSelectors.getDialogPinCode(state),
    userId:state.authReducer.userId
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    emitInviteToken: bindActionCreators(controlActionCreators.emitInviteToken, dispatch),
    togglePinCodeDialog: bindActionCreators(popupActionCreators.togglePinCodeDialog, dispatch),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(PinCodeDialog);
