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
  },
});
const AddTaskForm = ({ onSubmitEvent, loading }) => {
  const validationSchema = Yup.object({
    title: Yup.string().required(L('title_required')),
    reward: Yup.number().required('Reward is required'),
  });
  return (
    <Formik
      initialValues={{ title: '', reward: 10 }}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmitEvent(values)}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, submitForm }) => (
        <KsAlign alignItems="center" elementsGap={10}>
          <KsAlign alignItems="center" style={{ width: '100%' }} elementsGap={20}>
            <Typography fontSize={16} fontWeight="600">
              {L('add_task_dialog')}
            </Typography>
            <KsAlign style={{ width: '100%' }} alignItems="center" elementsGap={10}>
              <TextInput
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                placeholder={L('task_name')}
                autoFocus={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                style={styles.textinput}
                value={values.title}></TextInput>
              {errors.title ? (
                <Text style={{ fontSize: 14, fontWeight: '600', color: 'red', margin: 0 }}>{errors.title}</Text>
              ) : null}
              <KsAlign alignItems="center" elementsGap={5} style={{ width: '100%' }}>
                <SpinnedButton
                  onValueChange={(value) => {
                    setFieldValue('reward', value);
                  }}
                  style={{ maxWidth: '50%' }}
                  value={values.reward}
                />
                <Typography fontSize={14} fontWeight="600">
                  {L('set_reward')}
                </Typography>
              </KsAlign>
            </KsAlign>
          </KsAlign>

          <KsButton
            onPress={handleSubmit}
            style={{ width: 220, height: 50 }}
            loading={loading}
            titleStyle={{ fontSize: 16 }}
            title={L('confirm')}></KsButton>
        </KsAlign>
      )}
    </Formik>
  );
};

export default AddTaskForm;
