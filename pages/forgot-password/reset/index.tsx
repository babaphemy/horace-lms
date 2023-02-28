import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Link,
  InputAdornment,
  Alert,
} from '@mui/material';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { loginStyles } from '../../../styles/loginStyles';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useRouter } from 'next/router';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import MailLockIcon from '@mui/icons-material/MailLock';
import { resetPass } from '../../../api/rest';
import { notifySuccess } from '../../../utils/notification';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  token: yup.string().required('Enter token sent to email'),
  email: yup
    .string()
    .email('You must enter a valid email')
    .required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match'),
});

const defaultValues = {
  token: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

const Reset = () => {
  const router = useRouter();
  const [al, setAlert] = React.useState<{
    show: boolean;
    msg: string;
  } | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(resetPass, {
    onSuccess: (data) => {
      notifySuccess('Password reset successful. You can now login.');
      router.push('/login');
      return;
    },
    onError: (error) => {
      setAlert({
        show: true,
        msg: 'Password reset failed. Try again later.',
      });
      return;
    },
  });

  const onSubmit = (data: any) => {
    const { token, email, password } = data;

    const payload = {
      token,
      email,
      password,
      type: 'USER',
    };

    mutate(payload);
    return;
  };

  return (
    <Box>
      <Header />
      <Container maxWidth="lg">
        <Box sx={loginStyles.center}>
          <Box sx={loginStyles.paper}>
            <Box>
              <Typography variant="h4" my={2}>
                Reset Password
              </Typography>
              <Typography variant="body1" my={2}>
                Enter the token sent to your email address and create a new
                password below.
              </Typography>
            </Box>
            <Box>
              {al?.show && (
                <Alert
                  severity="error"
                  onClose={() => setAlert(null)}
                  sx={loginStyles.alert}
                >
                  {al.msg}
                </Alert>
              )}
              <Box
                component="form"
                sx={loginStyles.resetForm}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="token"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      label="Token"
                      variant="outlined"
                      fullWidth
                      sx={loginStyles.input}
                      size="small"
                      type="text"
                      error={!!errors.token}
                      helperText={errors.token?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <MailLockIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
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
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={loginStyles.input}
                      size="small"
                      fullWidth
                      type="password"
                      label="New Password"
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <VpnKeyIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />

                <Controller
                  name="passwordConfirm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={loginStyles.input}
                      size="small"
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      error={!!errors.passwordConfirm}
                      helperText={errors?.passwordConfirm?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <VpnKeyIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
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
                        width: '100%',
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

export default Reset;
