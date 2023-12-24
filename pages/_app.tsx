import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import TagManager from 'react-gtm-module';
import ReactGA from 'react-ga';
import { muiTheme } from '../styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProvider, AppDpx } from '../context/AppContext';
import { USER_ADD } from '../context/Action';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const tagArgs = {
  gtmId: process.env.NEXT_PUBLIC_GTM,
};
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!);
  useEffect(() => {
    TagManager.initialize(tagArgs);
  }, []);

  const dispatch = React.useContext(AppDpx);
  React.useEffect(() => {
    const user = localStorage.getItem('horaceUser');
    if (user) {
      dispatch({
        type: USER_ADD,
        payload: JSON.parse(user),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AppProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default MyApp;
