import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { muiTheme } from '../styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProvider } from '../context/AllProvider';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={muiTheme}>
			<QueryClientProvider client={queryClient}>
				<AppProvider>
					<Component {...pageProps} />
				</AppProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default MyApp;
