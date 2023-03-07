import React, { createContext, ReactElement, useReducer } from 'react';
import { Action, MODAL_SET, USER_ADD, USER_RESET } from './Action';

type State = {
  user: any;
  modal: {
    open: boolean;
    type: 'login' | 'signup' | 'payment';
  };
};

type Props = {
  children: ReactElement;
};

const getuser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('horaceUser');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  return;
};

const initialState: State = {
  user: getuser(),
  modal: {
    open: false,
    type: 'login',
  },
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
    case MODAL_SET:
      return {
        ...state,
        modal: {
          open: action.data.open,
          type: action.data.type,
        },
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
