// src/context/AuthProvider.js
import React, { Component } from 'react';
import AuthContext from './AuthContext';

class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      username: '',
      password: '',
    };
  }

  // Método para autenticar o usuário
  login = async (username, password) => {
    try {
      const credentials = btoa(`${username}:${password}`); // Codifica em Base64

      // Faz uma requisição GET para uma rota protegida para verificar as credenciais
      const response = await fetch('/livros', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Se a resposta for OK, as credenciais são válidas
        this.setState({
          isAuthenticated: true,
          username: username,
          password: password,
        });
        return { success: true };
      } else {
        // Se a resposta não for OK, as credenciais são inválidas
        const errorData = await response.text();
        return { success: false, message: errorData || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return { success: false, message: 'Erro na autenticação' };
    }
  };

  // Método para realizar logout
  logout = () => {
    this.setState({
      isAuthenticated: false,
      username: '',
      password: '',
    });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: this.state.isAuthenticated,
          username: this.state.username,
          password: this.state.password,
          login: this.login,
          logout: this.logout,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
