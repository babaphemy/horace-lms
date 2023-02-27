import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Link,
  Checkbox,
  Alert,
} from '@mui/material';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import subtract from '../../assets/img/subtract.png';
import thumb from '../../assets/img/thumb.png';
import woman from '../../assets/img/woman.png';
import { loginStyles } from '../../styles/loginStyles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Allcountries } from '../../utils/countries';
import { registerUser, verifyEmail } from '../../api/rest';
import { AppDpx } from '../../context/AppContext';
import { USER_ADD } from '../../context/Action';
import { useRouter } from 'next/router';

// Form Validation with Yup

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

const SignUp = () => {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, isLoading } = useMutation(registerUser, {
    onSuccess: (data) => {
      localStorage.setItem('horaceUser', JSON.stringify(data));
      dispatch({ type: USER_ADD, payload: data });
      router.push('/');
      reset(defaultValues);
    },
    onError: (error) => {
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

  return (
    <Box>
      <Header />
      <Box sx={loginStyles.body}>
        <Container maxWidth="lg">
          <Box sx={loginStyles.center}>
            <Box sx={loginStyles.box}>
              <Box sx={loginStyles.right}>
                <Typography
                  variant="h4"
                  sx={[loginStyles.center, loginStyles.title]}
                >
                  Sign Up{' '}
                  <Image src={thumb} alt="thumb" width={30} height={30} />
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
                          fullWidth
                        >
                          <MenuItem value="STUDENT">Student</MenuItem>
                          <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
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
                          fullWidth
                        >
                          {Allcountries.map((a) => (
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
              </Box>
              <Box sx={loginStyles.subtract}>
                <Image
                  src={subtract}
                  alt="logo"
                  width={'500rem'}
                  height={'750rem'}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                />
                <Box sx={loginStyles.glass}>
                  <Typography variant="h5" sx={loginStyles.note}>
                    the best courses you will find here sign up now
                  </Typography>
                  <Image
                    src={woman}
                    alt="woman standing"
                    width={'420rem'}
                    height={'400rem'}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignUp;
