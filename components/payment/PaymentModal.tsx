import { Typography, Box } from '@mui/material';
import React from 'react';
import ModalContainer from '../ModalContainer';

const PaymentModal = () => {
  return (
    <ModalContainer type="payment">
      <Box>
        <Typography variant="h4">Payment</Typography>
      </Box>
    </ModalContainer>
  );
};

export default PaymentModal;
