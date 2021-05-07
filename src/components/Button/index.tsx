import React, { ButtonHTMLAttributes } from "react";

import { Container } from "./styles";

type ButtonPropos = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonPropos> = ({children, ...props}) => (
  <Container type="button" {...props}>
    {children}
  </Container>
);

export default Button;