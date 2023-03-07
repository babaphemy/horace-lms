import React from 'react';
import ModalContainer from '../ModalContainer';
import LoginComponent from './Login';

type Props = {};

const ModalLogin = (props: Props) => {
  return (
    <ModalContainer>
      <LoginComponent />
    </ModalContainer>
  );
};

export default ModalLogin;
