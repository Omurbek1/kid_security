import React from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import KsButton from '../../atom/KsButton';
import SpinnedButton from '../../molecules/SpinnedButton';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { L } from '../../../lang/Lang';

const styles = StyleSheet.create({
  textinput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    width: '100%',
    height: 50,
  },
});

const ConfirmTaskForm = ({ onSubmitEvent, reward }) => {
  const rewardValue = reward || 10;
  return (
    <Formik initialValues={{ praiseComment: '', reward: rewardValue }} onSubmit={(values) => onSubmitEvent(values)}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, submitForm }) => (
        <KsAlign alignItems="center" elementsGap={10}>
          <View style={{ width: '100%' }}>
            <KsAlign alignItems="center" elementsGap={20}>
              <Typography fontSize={16} fontWeight="600">
                {L('confirm_task_dialog')}
              </Typography>
              {reward ? null : (
                <KsAlign alignItems="center" elementsGap={5}>
                  <SpinnedButton
                    style={{ maxWidth: '50%' }}
                    onValueChange={(value) => setFieldValue('reward', value)}
                    value={values.reward}
                  />
                  <Typography fontSize={14} fontWeight="600">
                    {L('set_reward')}
                  </Typography>
                </KsAlign>
              )}
              <TextInput
                placeholder={L('write_praise_comment')}
                multiline={true}
                numberOfLines={3}
                onSubmitEditing={() => Keyboard.dismiss()}
                style={styles.textinput}
                onChangeText={handleChange('praiseComment')}
                onBlur={handleBlur('praiseComment')}
                value={values.praiseComment}
              />
            </KsAlign>
          </View>
          <KsButton
            style={{ width: 220, height: 50 }}
            titleStyle={{ fontSize: 16 }}
            title={L('confirm')}
            onPress={handleSubmit}></KsButton>
        </KsAlign>
      )}
    </Formik>
  );
};

export default ConfirmTaskForm;
