// src/components/Login/Login.js
import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import { withRouter } from '../../utils/withRouter'; // Necessário para classes

class Login extends Component {
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
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center">Login</h2>
            {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
            <Form onSubmit={this.handleSubmit} className="bg-light p-4 rounded">
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Login</Form.Label>
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
              <Button variant="primary" type="submit" className="w-100">
                Entrar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Login);

