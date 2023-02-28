import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Link,
  InputAdornment,
} from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useMutation } from 'react-query';
import { loginStyles } from '../../styles/loginStyles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email('You must enter a valid email')
    .required('You must enter a email'),
});

const defaultValues = {
  email: '',
};
const ForgotPass = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: any) => {};

  return (
    <Box>
      <Header />
      <Container maxWidth="lg">
        <Box sx={loginStyles.center}>
          <Box sx={loginStyles.paper}>
            <Box>
              <Typography variant="h4" my={2}>
                Forgot Password
              </Typography>
              <Typography variant="body1" my={2}>
                Enter your email address below and we'll send you a link to
                reset your password.
              </Typography>
            </Box>
            <Box>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      sx={loginStyles.input}
                      size="small"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <MailOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Box my={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={[
                      loginStyles.button,
                      loginStyles.submit,
                      {
                        margin: '0 !important',
                      },
                    ]}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  my: 1,
                }}
              >
                <Link href="/login" underline="hover">
                  Back to Login Page
                </Link>{' '}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default ForgotPass;
