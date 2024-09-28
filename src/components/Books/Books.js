// src/components/Books/Books.js
import React from "react";
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import '../../App.css';
import AuthContext from '../../context/AuthContext';
import { withRouter } from '../../utils/withRouter'; // Necessário para classes

class Books extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      nome: '',
      autor: '',
      genero: '',
      paginas: '',
      editora: '',
      books: [],
      telaCadastro: false,
      telaBusca: false,
      nomeBusca: '',
      autorBusca: '',
      editoraBusca: '',
      paginasBusca: '',
      generoBusca: '',
      error: '',
    };

    // Vinculando os métodos ao contexto correto
    this.submit = this.submit.bind(this);
    this.submitBusca = this.submitBusca.bind(this);
    this.getLivros = this.getLivros.bind(this);
    this.fecharCadastro = this.fecharCadastro.bind(this);
    this.fecharBusca = this.fecharBusca.bind(this);
    this.abrirCadastro = this.abrirCadastro.bind(this);
    this.abrirBusca = this.abrirBusca.bind(this);
    this.reset = this.reset.bind(this);
    this.resetBusca = this.resetBusca.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // Carrega os livros existentes com as credenciais autenticadas
    this.getLivros();
  }

  // Método para codificar as credenciais em Base64
  getAuthHeader() {
    const { username, password } = this.context;
    const credentials = btoa(`${username}:${password}`);
    return `Basic ${credentials}`;
  }

  // Método para buscar os livros via requisição GET na API
  getLivros(nome = '', autor = '', genero ='', editora = '', paginas = '') {
    let url = '/livros';
    const params = new URLSearchParams();
    if (nome) params.append('nome', nome);
    if (autor) params.append('autor', autor);
    if (genero) params.append('genero', genero);
    if (editora) params.append('editora', editora);
    if (paginas) params.append('minPaginas', paginas);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Accept': 'application/json'
      }
    })
      .then(resposta => {
        if (!resposta.ok) {
          throw new Error('Erro ao buscar livros');
        }
        return resposta.json();
      })
      .then(dados => {
         // Inverte a ordem dos livros
        const livrosInvertidos = dados.reverse();
        this.setState({ books: livrosInvertidos, error: '' });
        //this.setState({ books: dados, error: '' });
        this.fecharBusca();
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  // Método para buscar livros por ID
  getLivrosbyId = (id) => {
    fetch('/livros/' + id, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Accept': 'application/json'
      }
    })
      .then(resposta => {
        if (!resposta.ok) {
          throw new Error('Erro ao buscar livro por ID');
        }
        return resposta.json();
      })
      .then(livro => {
        this.setState({
          id: livro._id,
          nome: livro.nome,
          autor: livro.autor,
          genero: livro.genero,
          paginas: livro.paginas,
          editora: livro.editora
        });
        this.abrirCadastro();
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  // Método para excluir um livro via DELETE na API
  deleteLivros = (id) => {
    fetch('/livros/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Accept': '*/*'
      }
    })
      .then(resposta => {
        if (resposta.ok) {
          this.getLivros();
        } else {
          throw new Error('Erro ao excluir livro');
        }
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  // Método para atualizar um livro
  updateLivros = (livro, idupdate) => {
    fetch('/livros/' + idupdate, {
      method: 'PUT',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(livro)
    })
      .then(resposta => {
        if (resposta.ok) {
          this.getLivros();
        } else {
          throw new Error('Não foi possível atualizar o registro');
        }
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  // Método para criar um novo livro via POST na API
  createLivros = (livro) => {
    fetch('/livros', {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(livro)
    })
      .then(resposta => {
        if (resposta.ok) {
          this.getLivros();
        } else {
          throw new Error('Nome e Autor são obrigatórios');
        }
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  // Método de envio do formulário, cria ou atualiza um livro e limpa o formulário
  submit = (e) => {
    e.preventDefault();

    const idupdate = this.state.id;
    const livro = {
      nome: this.state.nome,
      autor: this.state.autor,
      genero: this.state.genero,
      paginas: this.state.paginas,
      editora: this.state.editora
    };

    if (idupdate === 0) {
      this.createLivros(livro);
    } else {
      this.updateLivros(livro, idupdate);
    }

    this.fecharCadastro();
  }

  // Método de envio da busca
  submitBusca(e) {
    e.preventDefault();
    const nomeB = this.state.nomeBusca;
    const autorB = this.state.autorBusca;
    const generoB = this.state.generoBusca;
    const paginasB = this.state.paginasBusca;
    const editoraB = this.state.editoraBusca;
    this.getLivros(nomeB, autorB, generoB, editoraB, paginasB);
  }

  fecharCadastro = () => {
    this.setState({
      telaCadastro: false
    });
    this.reset();
  }

  abrirCadastro = () => {
    this.setState({
      telaCadastro: true
    });
  }

  fecharBusca = () => {
    this.setState({
      telaBusca: false
    });
    this.resetBusca();
  }

  abrirBusca = () => {
    this.resetBusca();
    this.setState({
      telaBusca: true
    });
  }

  // Método para limpar os campos do formulário
  reset = () => {
    this.setState({
      id: 0,
      nome: '',
      autor: '',
      genero: '',
      paginas: '',
      editora: ''
    });
  }

  resetBusca = () => {
    this.setState({
      nomeBusca: '',
      autorBusca: '',
      generoBusca:'',
      paginasBusca:'',
      editoraBusca: '',
    });
  }

  // Método para realizar logout
  logout = () => {
    this.context.logout();
    this.props.navigate('/login');
  }

  // Método renderiza a tabela de livros
  renderTabela() {
    return (
      <Table striped bordered hover variant="dark" className="mt-3">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Genero</th>
            <th>Páginas</th>
            <th>Editora</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.books.map((book) =>
              <tr key={book._id}>
                <td>{book.nome}</td>
                <td>{book.autor}</td>
                <td>{book.genero}</td>
                <td>{book.paginas}</td>
                <td>{book.editora}</td>
                <td>
                  <Button variant="primary" onClick={() => this.getLivrosbyId(book._id)} style={{marginLeft: '10px'}} >Atualizar</Button>{' '}
                  <Button variant="danger" onClick={() => this.deleteLivros(book._id)} style={{marginTop: '5px', marginLeft: '15px'}}>Excluir</Button>{' '}
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>
    );
  }

  // Funções para atualizar o estado conforme os inputs do formulário são modificados
  atualizaNome = (e) => {
    this.setState({ nome: e.target.value });
  }

  atualizaAutor = (e) => {
    this.setState({ autor: e.target.value });
  }

  atualizaGenero = (e) => {
    this.setState({ genero: e.target.value });
  }

  atualizaPaginas = (e) => {
    this.setState({ paginas: e.target.value });
  }

  atualizaEditora = (e) => {
    this.setState({ editora: e.target.value });
  }

  render() {
    return (
      
      <div className="bg-dark text-white p-3" style={{ minHeight: '100vh' }}>
        {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
        <div className="d-flex justify-content-end mb-3" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Button variant="primary" onClick={this.abrirCadastro} style={{ marginRight: '100px' }}>
            Novo Livro
          </Button>
          <Button variant="secondary" onClick={this.abrirBusca} style={{ marginRight: '20px' }}>
            Buscar Livro
          </Button>
          <Button
            variant="secondary"
            onClick={() => { this.getLivros(); this.fecharBusca(); }}
            style={{ marginRight: '30px' }}
          >
            Reset Busca
          </Button>
          <Button variant="light" onClick={this.logout}>
            Logout
          </Button>
        </div>

        {/* Formulário de criação de livros */}
        <Modal show={this.state.telaCadastro} onHide={this.fecharCadastro} className="modal-dark">
          <Modal.Header closeButton>
            <Modal.Title>Registro de Livro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-dark" onSubmit={this.submit}>
              <Form.Group className="mb-3" controlId="formGridId">
                <Form.Control
                  type="text"
                  value={this.state.id}
                  readOnly
                  style={{ display: 'none', backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridNome">
                <Form.Label>Titulo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Titulo da Obra"
                  value={this.state.nome}
                  onChange={this.atualizaNome}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridAutor">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Autor"
                  value={this.state.autor}
                  onChange={this.atualizaAutor}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridGenero">
                <Form.Label>Genero</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Genero"
                  value={this.state.genero}
                  onChange={this.atualizaGenero}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridPaginas">
                <Form.Label>Páginas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Quantidade de Páginas"
                  value={this.state.paginas}
                  onChange={this.atualizaPaginas}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridEditora">
                <Form.Label>Editora</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Editora"
                  value={this.state.editora}
                  onChange={this.atualizaEditora}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Salvar
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharCadastro}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Formulário de busca */}
        <Modal show={this.state.telaBusca} onHide={this.fecharBusca} className="modal-dark">
          <Modal.Header closeButton>
            <Modal.Title>Buscar Livro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.submitBusca} className="form-dark">
              <Form.Group className="mb-3">
                <Form.Label>Titulo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Titulo da Obra"
                  value={this.state.nomeBusca}
                  onChange={(e) => this.setState({ nomeBusca: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Autor"
                  value={this.state.autorBusca}
                  onChange={(e) => this.setState({ autorBusca: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Editora</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Editora"
                  value={this.state.editoraBusca}
                  onChange={(e) => this.setState({ editoraBusca: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Páginas</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Min. Páginas"
                  value={this.state.paginasBusca}
                  onChange={(e) => this.setState({ paginasBusca: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Genero</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Genero"
                  value={this.state.generoBusca}
                  onChange={(e) => this.setState({ generoBusca: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Buscar
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharBusca}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Tabela de livros */}
        {this.renderTabela()}
      </div>
    );
  }
}

export default withRouter(Books);

