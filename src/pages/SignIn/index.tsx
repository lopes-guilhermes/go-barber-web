import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg'
import { Container, Content, Background, AnimationContainer } from './styles';

interface SignInFormData {
  email: string,
  password: string
}

const SignIn: React.FC = () => {
  const formRef= useRef<FormHandles>(null);

  const { user, signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  console.log(user);

  const handleSubmit = useCallback(async (data: SignInFormData) => {
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
      
      await signIn({ 
        email: data.email, 
        password: data.password
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      
      addToast({
        type: 'error',
        title: 'Erro na Autenticação',
        description: 'Ocorreu um erro ao fazer login, confira as credenciais.'
      });
    }
  }, [signIn, addToast, history]);
  
  return(
    <Container>
      <Content>
        <AnimationContainer>
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
            
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>
          
          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      
      <Background/>
    </Container>
  );
};

export default SignIn;