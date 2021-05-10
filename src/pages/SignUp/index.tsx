import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg'
import { Container, Content, Background, AnimationContainer } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => { 
  const formRef= useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      
      const schema = Yup.object().shape({
        name: Yup.string()
          .required('Nome obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .min(6, 'No mínimo 6 dígitos')
      });

      await schema.validate(data, {
        abortEarly: false //retorna todos erros de uma vez
      });

      await api.post('users', data);

      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer seu login no GoBarber'
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
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao fazer cadastro, tente novamente.'
      });
    }
  }, [addToast, history]);

  return(
    <Container>
      <Background/>
      
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            
            <Input 
              name="name" 
              placeholder="Nome" 
              icon={FiUser}
            />

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
            
            <Button type="submit">Cadastrar</Button>
          </Form>
          
          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>

    </Container>
  );
}

export default SignUp;