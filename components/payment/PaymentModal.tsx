import { Typography, Box, Divider, Button } from '@mui/material';
import React from 'react';
import ModalContainer from '../ModalContainer';

const PaymentModal = ({ course }: any) => {
  const author = `${course?.author?.firstname || 'Horace'} ${
    course?.author?.lastname || 'Instructor'
  }`;
  return (
    <ModalContainer type="payment">
      <Box>
        <Typography variant="h4" mb={2}>
          Payment
        </Typography>
        <Divider />
        <Box mt={2}>
          <Typography variant="h6" mb={2}>
            Author: {author}
          </Typography>
          <Typography variant="h6" mb={2}>
            Course: {course?.courseName}
          </Typography>
          <Typography variant="h6" mb={2}>
            Price: ${course?.price}
          </Typography>
          <Typography variant="h6" mb={2}>
            Tax: ${course?.tax}
          </Typography>
          <Typography variant="h6" mb={2}>
            Total: ${course?.price - course?.tax}
          </Typography>
        </Box>
        <Divider />
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'red !important',
          }}
          fullWidth
        >
          Pay ${course?.price - course?.tax}
        </Button>
      </Box>
    </ModalContainer>
  );
};

export default PaymentModal;
