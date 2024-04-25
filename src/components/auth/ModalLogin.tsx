import React from "react";
import ModalContainer from "../ModalContainer";
import LoginComponent from "./LoginComponent";

type Props = {};

const ModalLogin = (props: Props) => {
  return (
    <ModalContainer type="login">
      <LoginComponent modal={true} />
    </ModalContainer>
  );
};

export default ModalLogin;
