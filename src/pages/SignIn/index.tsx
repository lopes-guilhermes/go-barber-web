import React, { useCallback, useRef } from 'react';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg'
import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => {
  const formRef= useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .required('Senha obrigatória')
      });

      await schema.validate(data, {
        abortEarly: false //retorna todos erros de uma vez
      });
    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors);
    }
  }, []);
  
  return(
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>
          
          <Input 
            name="email" 
            placeholder="E-mail" 
            icon={FiMail}
          />
          <Input 
            name="password" 
            type="password" 
            placeholder="Senha"
            icon={FiLock} 
          />
          
          <Button type="submit">Entrar</Button>
          
          <a href="forgot">Esqueci minha senha</a>
        </Form>
        
        <a href="login">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      
      <Background/>
    </Container>
  );
};

export default SignIn;