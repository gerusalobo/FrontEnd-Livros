// src/components/Home/Home.js
import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import { withRouter } from '../../utils/withRouter'; // Necessário para classes
import '../../App.css';

class Home extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    // Chama o método login do contexto
    const result = await this.context.login(username, password);

    if (result.success) {
      // Se o login for bem-sucedido, redireciona para a página de livros
      this.props.navigate('/Books');
    } else {
      // Se o login falhar, exibe a mensagem de erro
      this.setState({ error: result.message });
    }
  };


  render() {
    return (
      <div className="home-container">
            <div className="image-section">
          <h2 style={{ color: 'white', marginBottom: '15%', fontSize: '400%' }}>Books Database</h2>
          
          {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}

          <Form onSubmit={this.handleSubmit} className="form-dark" style={{ maxWidth: '400px' }}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Nome de Usuário</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome de usuário"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Senha"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
        </div>

    <div className="welcome-section" style={{ textAlign: 'center' }}>

        <img src="/clipart2755190.png" alt="" style={{ width: '50%', height: 'auto' }} />
                {/* Título dentro da seção da imagem */}
        <h1 style={{ color: 'grey', marginTop: '10%', fontSize: '200%'}}>
          Seu Database de Livros
        </h1>
      </div>
        
    
      </div>
    );
  }
}

export default withRouter(Home);



