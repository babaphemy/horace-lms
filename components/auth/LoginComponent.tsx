import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from 'react-query';
import { loginUser } from '../../api/rest';
import { MODAL_SET, USER_ADD } from '../../context/Action';
import { AppDpx } from '../../context/AppContext';
import { loginStyles } from '../../styles/loginStyles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import fb from '../../assets/img/fbcolor.png';
import google from '../../assets/img/ggcolor.png';
import yeah from '../../assets/img/yeah.png';
import * as yup from 'yup';
import Image from 'next/image';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('You must enter a valid email')
    .required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(4, 'Password is too short - should be 4 chars minimum.'),
});

const defaultValues = {
  email: '',
  password: '',
};

// Props
type loginProps = {
  email: string;
  password: string;
  type?: any;
};

type Props = {
  modal?: boolean;
};
const LoginComponent = (props: Props) => {
  const { modal = false } = props;
  const dispatch = React.useContext(AppDpx);
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [al, setAlert] = React.useState<{
    show: boolean;
    msg: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate } = useMutation(loginUser, {
    onSuccess: (data: any) => {
      localStorage.setItem('horaceUser', JSON.stringify(data));
      dispatch({ type: USER_ADD, payload: data });
      if (modal) {
        dispatch({ type: MODAL_SET, data: { open: false, type: 'login' } });
      } else {
        router.push('/');
      }
      reset(defaultValues);
    },
    onError: (error: any) => {
      setAlert({ show: true, msg: 'Login Failed, Please Try Again' });
    },
  });

  const onSubmit = (data: loginProps) => {
    data.type = 'USER';
    mutate(data);
  };

  const handleChangeTab = () => {
    if (modal) {
      dispatch({ type: MODAL_SET, data: { open: true, type: 'signup' } });
      return;
    }
    router.push('/sign-up');
  };

  const styles = {
    socials: {
      minWidth: modal ? '100%' : '70%',
    },
  };

  return (
    <Box sx={loginStyles.right}>
      <Typography variant="h4" sx={[loginStyles.center, loginStyles.title]}>
        Login <Image src={yeah} alt="yeah" width={30} height={30} />
      </Typography>

      <Box sx={{ ...loginStyles.socials, ...styles.socials }}>
        <Button
          variant="outlined"
          sx={[loginStyles.center, loginStyles.button]}
          fullWidth
        >
          <Image src={google} alt="google" width={20} height={20} />
          Login with Google
        </Button>
        <Button
          variant="outlined"
          sx={[loginStyles.center, loginStyles.button]}
          fullWidth
        >
          <Image src={fb} alt="fb" width={25} height={25} />
          Login with Facebook
        </Button>
      </Box>
      <Box sx={loginStyles.dividerContainer}>
        <Divider sx={loginStyles.divider} />{' '}
        <Typography variant="body1" sx={{ mx: 2 }}>
          {' '}
          or{' '}
        </Typography>
        <Divider sx={loginStyles.divider} />
      </Box>
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
        id="login-form"
        sx={loginStyles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              type="email"
              fullWidth
              sx={loginStyles.input}
              helperText={error?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <MailOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              id="password"
              label="Password"
              variant="outlined"
              size="small"
              fullWidth
              sx={loginStyles.input}
              helperText={error?.message}
              InputProps={{
                type: showPassword ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Typography
          variant="body1"
          sx={{
            textAlign: 'right',
            width: '100%',
            paddingRight: '1rem',
          }}
        >
          <Link href="/forgot-password" underline="hover">
            Forgot Password?
          </Link>{' '}
        </Typography>

        <Button
          sx={[loginStyles.button, loginStyles.submit]}
          variant="contained"
          fullWidth
          type="submit"
        >
          Login
        </Button>
      </Box>
      <Typography
        component={'button'}
        onClick={handleChangeTab}
        variant="body1"
        color="primary"
        sx={loginStyles.changeTab}
      >
        Don't have an account? Sign Up
      </Typography>
    </Box>
  );
};

export default LoginComponent;
