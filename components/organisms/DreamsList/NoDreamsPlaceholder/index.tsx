import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import Pane from '../../../atom/Pane/index';
import KsButton from '../../../atom/KsButton/index';
import KsAlign from '../../../atom/KsAlign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../../../../reducers/controlRedux';
import { setChildOidAddDreamMessageSent, isOidAddDreamMessageSend } from '../../../../UserPrefs';
import { L } from '../../../../lang/Lang';

const NoDreamsPlaceholder = ({ oid, sendTextMessageToObject, showAddKidAlert }) => {
  const [isSent, setIsSent] = useState(false);
  useEffect(() => {
    async function callback() {
      const res = await isOidAddDreamMessageSend(oid);
      setIsSent(res);
    }
    callback();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ maxHeight: 200, justifyContent: 'center', padding: 20, alignItems: 'center' }}>
        <Image
          style={{ height: '100%', resizeMode: 'contain' }}
          source={require('../../../../img/ic_presents.png')}></Image>
      </View>
      <KsAlign elementsGap={20}>
        <Pane padding={{ horizontal: 20, vertical: 20 }}>
          <Text style={{ fontWeight: '700', fontSize: 22, color: 'brown', textAlign: 'center' }}>
            {L('ask_child_add_dream')}
          </Text>
        </Pane>
        {isSent ? (
          <Text style={{ fontWeight: '700', fontSize: 18, color: 'grey', textAlign: 'center' }}>
            {L('sent_add_dream_message')}
          </Text>
        ) : (
          <KsButton
            style={{ paddingVertical: 20, borderRadius: 20 }}
            titleStyle={{ fontSize: 16 }}
            title={L('ask_child_add_dream_button_title')}
            onPress={async () => {
              if (!oid) {
                showAddKidAlert();
              } else {
                if (isSent) return;
                sendTextMessageToObject(oid, L('ask_child_add_dream_message'));
                setChildOidAddDreamMessageSent(oid);
                setIsSent(true);
              }
            }}></KsButton>
        )}
      </KsAlign>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    oid: state.controlReducer.activeOid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendTextMessageToObject: bindActionCreators(controlActionCreators.sendTextMessageToObject, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoDreamsPlaceholder);
