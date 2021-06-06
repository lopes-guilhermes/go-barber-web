import React, { ButtonHTMLAttributes } from "react";

import { Container } from "./styles";

type ButtonPropos = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
};

const Button: React.FC<ButtonPropos> = ({children, loading, ...props}) => (
  <Container type="button" {...props}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;