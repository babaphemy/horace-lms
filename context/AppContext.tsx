import React, { createContext, ReactElement, useReducer } from 'react';
import { Action, USER_ADD, USER_RESET } from './Action';

type State = {
	user: any;
};

type Props = {
	children: ReactElement;
};

const getuser = () => {
	const user = localStorage.getItem('horaceUser');
	if (user) {
		return JSON.parse(user);
	}
	return null;
};

const initialState: State = {
	user: getuser(),
};

const Appcontext = createContext(initialState);
const AppDpx = createContext<React.Dispatch<Action>>(() => {});
const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case USER_ADD:
			return {
				...state,
				user: action.payload,
			};
		case USER_RESET:
			return {
				...state,
				user: null,
			};
		default:
			return state;
	}
};

const AppProvider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<Appcontext.Provider value={state}>
			<AppDpx.Provider value={dispatch}>{children}</AppDpx.Provider>
		</Appcontext.Provider>
	);
};

export { Appcontext, AppDpx, AppProvider };
