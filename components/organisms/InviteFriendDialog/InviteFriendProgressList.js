import React, {Fragment} from 'react';
import {FlatList, Image, SafeAreaView, ScrollView, Text, View} from "react-native";
import {L} from "../../../lang/Lang";

const InviteFriendProgressListItem = ({text1,text2,current,min,max,unlock = false}) => {
  return <View
    style={{
      height:80,
      width: '100%',
      display:"flex",
      flexDirection:"row",
      alignItems:"center",
      borderWidth:0
    }}
  >
    <View style={{marginTop:15,height: 70, width: 70}}>
      {unlock?
        <Image source={require('../../../img/clock.png')} style={{width:50,height:50}}/>
        :
        <Image source={require('../../../img/password.png')} style={{width:50,height:50}}/>
      }
    </View>
    <View style={{flex:1,padding:1}}>
      <Text
        style={{
          textAlign: 'left',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        {text1}
      </Text>
      <Text
        style={{
          textAlign: 'left',
          fontSize: 14,
          fontWeight: '100',
          color: '#000',
        }}
      >
        {text2}
      </Text>
      {unlock&&
      <View
        style={{
          width: '100%',
          display:"flex",
          flexDirection:"row",
        }}
      >
        <View
          style={{
            height: 15,
            flex: 1,
            backgroundColor: '#c2c2c4',
            borderColor: '#dddddd',
            borderWidth: 1,
            borderRadius: 8,
            overflow:"hidden",
          }}
        >
          {current >= min &&
          <View
            style={{
              height: 15,
              width: `${100/max*current}%`,
              backgroundColor: '#428a3b'
            }}
          />
          }
        </View>
        <Text style={{width:40,textAlign:"center"}}>
          {current>max?max:current}/{max}
        </Text>
      </View>
      }
    </View>
  </View>
}

export default function InviteFriendProgressList ({userProps}) {
  let usersInvited = userProps?.usersInvited || 0;

  return <Fragment>
    <InviteFriendProgressListItem
      unlock={usersInvited >= 0}
      current={usersInvited}
      min={0}
      max={1}
      text1={L('minutes_gift1',[30])}
      text2={L('after_share',[1])}
    />
    <InviteFriendProgressListItem
      unlock={usersInvited >= 1}
      current={usersInvited - 1}
      min={0}
      max={3}
      text1={L('minutes_gift1',[150])}
      text2={L('after_share1',[3])}
    />
    <InviteFriendProgressListItem
      unlock={usersInvited >= 4}
      current={usersInvited - 4}
      min={0}
      max={5}
      text1={L('minutes_gift1',[500])}
      text2={L('after_share1',[5])}
    />
  </Fragment>
}
