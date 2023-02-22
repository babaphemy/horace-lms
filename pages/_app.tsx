import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { muiTheme } from '../styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProvider, AppDpx } from '../context/AppContext';
import { USER_ADD } from '../context/Action';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
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
		</ThemeProvider>
	);
}

export default MyApp;
