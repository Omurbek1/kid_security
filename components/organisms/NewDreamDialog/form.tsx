import React from 'react';
import { View } from 'react-native';
import KsAlign from '../../atom/KsAlign';
import Typography from '../../atom/KsTypography';
import SpinnedButton from '../../molecules/SpinnedButton';
import KsButton from '../../atom/KsButton';
import { Formik } from 'formik';
import { L } from '../../../lang/Lang';

const DreamConfirmForm = ({ onSumbit }) => {
  return (
    <Formik initialValues={{ price: 25 }} onSubmit={(values) => onSumbit(values)}>
      {({ setFieldValue, handleSubmit, values, submitForm }) => (
        <KsAlign alignItems="center" elementsGap={20}>
          <Typography fontSize={16} fontWeight="600">
            {L('estimate_dream')}
          </Typography>
          <KsAlign alignItems="center" elementsGap={5}>
            <SpinnedButton
              style={{ maxWidth: '50%' }}
              value={values.price}
              max={1000}
              min={5}
              step={5}
              onValueChange={(value) => {
                setFieldValue('price', value);
              }}
            />
            <Typography fontSize={14} fontWeight="600">
              {L('set_price_dream')}
            </Typography>
          </KsAlign>

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

export default DreamConfirmForm;
