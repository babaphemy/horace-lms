import React from 'react';
import ModalContainer from '../ModalContainer';
import SignUpComponent from './SignUpComponent';

const SignUpLogin = () => {
  return (
    <ModalContainer type="signup">
      <SignUpComponent modal={true} />
    </ModalContainer>
  );
};

export default SignUpLogin;
