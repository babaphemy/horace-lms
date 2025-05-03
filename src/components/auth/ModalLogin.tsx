import React from "react"
import ModalContainer from "../ModalContainer"
import LoginComponent from "./LoginComponent"

const ModalLogin = () => {
  return (
    <ModalContainer type="login">
      <LoginComponent modal={true} />
    </ModalContainer>
  )
}

export default ModalLogin
