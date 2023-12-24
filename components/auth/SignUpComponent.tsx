import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import { registerUser, verifyEmail } from '../../api/rest';
import thumb from '../../assets/img/thumb.png';
import { MODAL_SET, USER_ADD } from '../../context/Action';
import { AppDpx } from '../../context/AppContext';
import { loginStyles } from '../../styles/loginStyles';
import { Allcountries } from '../../utils/countries';
import { notifySuccess } from '../../utils/notification';

const schema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  type: yup.string().required('Registration Type is required'),
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
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  country: 'AT',
  type: 'STUDENT',
};

type Props = {
  modal?: boolean;
};

const SignUpComponent = (props: Props) => {
  const { modal = false } = props;
  const router = useRouter();
  const dispatch = React.useContext(AppDpx);
  const [checked, setChecked] = React.useState(false);
  const [al, setAlert] = React.useState<{
    show: boolean;
    msg: string;
  } | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate } = useMutation(registerUser, {
    onSuccess: (data) => {
      localStorage.setItem('horaceUser', JSON.stringify(data));
      dispatch({ type: USER_ADD, payload: data });
      notifySuccess('Registration succesful! check your email for more info.');
      if (modal) {
        dispatch({ type: MODAL_SET, data: { open: false, type: 'signup' } });
      } else {
        router.push('/');
      }
      reset(defaultValues);
    },
    onError: () => {
      setAlert({
        show: true,
        msg: 'Registration Failed, Please try again.',
      });
    },
  });

  const onSubmit = async (data: any) => {
    const checkEmail: string = await verifyEmail(data.email);

    if (checkEmail === 'true') {
      setAlert({
        show: true,
        msg: 'Email already exists, Please try again or Login.',
      });
      return;
    }

    mutate(data);
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleChangeTab = () => {
    if (modal) {
      dispatch({ type: MODAL_SET, data: { open: true, type: 'login' } });
      return;
    }
    router.push('/login');
  };
  return (
    <Box sx={loginStyles.right}>
      <Typography variant="h4" sx={[loginStyles.center, loginStyles.title]}>
        Sign Up <Image src={thumb} alt="thumb" width={30} height={30} />
      </Typography>

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
        id="sign-up-form"
        sx={loginStyles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="firstname"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={loginStyles.input}
              size="small"
              fullWidth
              type="text"
              label="First name"
              error={!!errors.firstname}
              helperText={errors?.firstname?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />
        <Controller
          name="lastname"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={loginStyles.input}
              size="small"
              fullWidth
              type="text"
              label="Last name"
              error={!!errors.lastname}
              helperText={errors?.lastname?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={loginStyles.input}
              size="small"
              fullWidth
              type="text"
              error={!!errors.email}
              helperText={errors?.email?.message}
              label="Email"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
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
              label="Password"
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
              label="Confirm Password"
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
        <FormControl
          sx={{
            my: 1,
          }}
          fullWidth
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                variant="outlined"
                id="countries"
                sx={loginStyles.input}
                size="small"
                fullWidth
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
                <MenuItem value="SCHOOL">School</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        <FormControl
          sx={{
            my: 1,
          }}
          fullWidth
        >
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                variant="outlined"
                id="countries"
                sx={loginStyles.input}
                size="small"
                fullWidth
              >
                {Allcountries.sort((a, b) => {
                  if (a.code === 'NG' || a.code === 'US') {
                    return -1;
                  } else if (b.code === 'NG' || b.code === 'US') {
                    return 1;
                  }
                  return a.name.localeCompare(b.name);
                }).map((a) => (
                  <MenuItem key={a.code} value={a.code}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'black',
            fontSize: '12px',

            '& .MuiCheckbox-root': {
              color: 'purle',
            },
          }}
        >
          <Checkbox checked={checked} onChange={handleCheck} />
          <Typography variant="body2">
            I agree to the{' '}
            <Link href="#" underline="hover">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" underline="hover">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
        <Button
          sx={[loginStyles.button, loginStyles.submit]}
          variant="contained"
          disabled={!checked}
          fullWidth
          type="submit"
          aria-label="REGISTER"
          value="legacy"
        >
          Register
        </Button>
      </Box>
      <Typography
        component={'button'}
        onClick={handleChangeTab}
        variant="body1"
        color="primary"
        sx={loginStyles.changeTab}
      >
        Already have an account? Login
      </Typography>
    </Box>
  );
};

export default SignUpComponent;
