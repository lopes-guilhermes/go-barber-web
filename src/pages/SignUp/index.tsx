import React from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Form } from '@unform/web';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg'
import { Container, Content, Background } from './styles';

const SignUp: React.FC = () => { 
  function handleSubmit(data: object): void {
    console.log(data);
  }

  return(
    <Container>
      <Background/>
      
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>
          
          <Input 
            name="nome" 
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
        
        <a href="login">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
}

export default SignUp;