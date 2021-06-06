import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi'
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg'
import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string,
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef= useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password'), null],
          'Confirmção incorreta'
        )
      });

      await schema.validate(data, {
        abortEarly: false //retorna todos erros de uma vez
      });

      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      if (!token)
       throw new Error();

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token
      });

      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      
      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente.'
      });
    }
  }, [addToast, history, location.search]);
  
  return(
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>

            <Input 
              name="password" 
              type="password" 
              placeholder="Nova Senha"
              icon={FiLock} 
            />

            <Input 
              name="password_confirmation" 
              type="password" 
              placeholder="Confirmação da senha"
              icon={FiLock} 
            />
            
            <Button type="submit">Alterar Senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      
      <Background/>
    </Container>
  );
};

export default ResetPassword;