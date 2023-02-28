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
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { loginStyles } from '../../styles/loginStyles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { doToken, verifyEmail } from '../../api/rest';
import { useRouter } from 'next/router';
import { notifySuccess } from '../../utils/notification';

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
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate } = useMutation(doToken, {
    onSuccess: (data) => {
      notifySuccess('Token sent to your email');
      router.push('/forgot-password/reset');
      return;
    },
    onError: (error) => {
      setAlert({
        show: true,
        msg: 'Email not found, please try again',
      });
      return;
    },
  });

  const onSubmit = async (data: any) => {
    const checkEmail: string = await verifyEmail(data.email);
    data.type = 'USER';

    if (checkEmail === 'true') {
      mutate(data);
      return;
    }
    setAlert({
      show: true,
      msg: 'Email not found, please try again',
    });
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
                Forgot Password
              </Typography>
              <Typography variant="body1" my={2}>
                Enter your email address below and we'll send you a link to
                reset your password.
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
