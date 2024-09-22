import React, { useEffect, useState } from "react";
import { Table, Form, Button, Modal } from 'react-bootstrap';
import '../../App.css';

class Books extends React.Component {

  constructor(props) {
    super(props);
    // Definindo o estado inicial do componente, que contém os campos do formulário e a lista de livros
    this.state = {
      id: 0,
      nome: '',
      autor: '',
      genero: '',
      paginas: '',
      editora: '',
      books: [], // Armazena a lista de livros carregados do backend
      telaCadastro: false,
      telaBusca: false,
      nomeBusca: '',
      autorBusca:''
    };

    // Vinculando os métodos ao contexto da classe para evitar problemas de escopo
    this.submit = this.submit.bind(this);
    this.submitBusca = this.submitBusca.bind(this);
    this.getLivros = this.getLivros.bind(this); // Adicionar o bind aqui
    this.fecharCadastro = this.fecharCadastro.bind(this);
    this.fecharBusca = this.fecharBusca.bind(this); // Adicionar o bind aqui
    this.abrirCadastro = this.abrirCadastro.bind(this);
    this.abrirBusca = this.abrirBusca.bind(this);
    this.reset = this.reset.bind(this);
    this.resetBusca = this.resetBusca.bind(this);
  }

  // Método chamado automaticamente quando o componente é montado
  componentDidMount() {
    // Carrega os livros existentes
    this.getLivros();
  }

  // Método para buscar os livros via requisição GET na API
  getLivros(nome = '', autor = '') {

    let url = '/livros';
  // Adiciona os parâmetros de busca se eles forem fornecidos
    const params = new URLSearchParams();
    if (nome) params.append('nome', nome);
    if (autor) params.append('autor', autor);

  // Adiciona os parâmetros à URL, se existirem
    if (params.toString()) {
    url += `?${params.toString()}`;
  }

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`, // Autenticação via token armazenado
        'Accept': 'application/json'
      }
    })
      .then(resposta => resposta.json()) // Converte a resposta em JSON
      .then(dados => {
        // Atualiza o estado com os dados recebidos
        this.setState({ books: dados });
      });
      this.fecharBusca();
  }

    // Método para buscar os livros via requisição GET na API
    getLivrosbyId = (id) => {
        fetch('/livros/' + id, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`, // Autenticação via token armazenado
            'Accept': 'application/json'
          }
        })
          .then(resposta => resposta.json()) // Converte a resposta em JSON
          .then(livro => {
            // Atualiza o estado com os dados recebidos
            this.setState({ 
                    id: livro._id,
                    nome: livro.nome,
                    autor: livro.autor,
                    genero: livro.genero,
                    paginas: livro.paginas,
                    editora: livro.editora
             });
             this.abrirCadastro();
          });
      }

  // Método para excluir um livro via DELETE na API
  deleteLivros = (id) => {
    fetch('/livros/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
        'Accept': '*/*'
      }
    })
      .then(resposta => {
        if (resposta.ok) {
          // Se a exclusão for bem-sucedida, recarrega a lista de livros
          this.getLivros();
        }
      });
  }

  // Método para atualizar um livro (placeholder, já que o método UPDATE não é padrão)
  updateLivros = (livro, idupdate) => {
    fetch('/livros/' + idupdate, {
      method: 'PUT', // Esta linha deve ser corrigida para 'PUT' ou 'PATCH' dependendo da API
      headers: {
        'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(livro)
    })
      .then(resposta => {
        if (resposta.ok) {
          this.getLivros();
        }else{alert("Não foi possivel atualizar o registro");}
      });
  }

  // Método para criar um novo livro via POST na API
  createLivros = (livro) => {
    fetch('/livros', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(livro) // Converte o objeto livro em uma string JSON para enviar no corpo da requisição
    })
      .then(resposta => {
        if (resposta.ok) {
          // Após a criação, recarrega a lista de livros
          this.getLivros();
        }else{alert("Nome e Autor são obrigatórios");}
      });
  }

  // Limpeza de recursos (se necessário) quando o componente for desmontado
  componentWillUnmount() { }

  // Método para renderizar a tabela de livros
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
            // Mapeia cada livro para uma linha da tabela
            this.state.books.map((book) =>
                <tr key={book._id}>
                <td>{book.nome}</td>
                <td>{book.autor}</td>
                <td>{book.genero}</td>
                <td>{book.paginas}</td>
                <td>{book.editora}</td>
                <td>
                  <Button variant="primary"onClick={() => this.getLivrosbyId(book._id)}>Atualizar</Button>{' '}
                  <Button variant="danger" onClick={() => this.deleteLivros(book._id)}>Excluir</Button>{' '}
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

  // Método de envio do formulário, cria um novo livro e limpa o formulário
  submit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário de recarregar a página
      
    const idupdate = this.state.id
    const livro = {
      nome: this.state.nome,
      autor: this.state.autor,
      genero: this.state.genero,
      paginas: this.state.paginas,
      editora: this.state.editora
    };
    // Chama o método para criar o livro
    if(idupdate == 0){
        this.createLivros(livro);
    }else{
        this.updateLivros(livro,idupdate);
    }
    // Limpa os campos do formulário
    this.fecharCadastro();
  }

  submitBusca(e){
    e.preventDefault();
    const nomeB = this.state.nomeBusca; 
    const autorB = this.state.autorBusca; 
    this.getLivros(nomeB, autorB);
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
  });}

  fecharBusca = () => {
    this.setState({
        telaBusca: false
  });
  }

  abrirBusca = () => {
    this.resetBusca();
    this.setState({
        telaBusca: true
  });}

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
      });
  }

  // Método renderiza o formulário e a tabela de livros
  render() {

    return (
      <div className="bg-dark text-white p-3" className="dark-theme p-3">
        <div className="d-flex justify-content-end mb-3" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Button variant="primary" onClick={this.abrirCadastro} style={{ marginTop: '20px', marginBottom: '20px', marginRight: '100px' }}>
            Novo Livro
        </Button>
        <Button variant="secondary" onClick={this.abrirBusca} style={{ marginTop: '20px', marginBottom: '20px', marginRight: '20px' }}>
            Buscar Livro
        </Button>
        <Button variant="secondary" onClick={() => { this.getLivros(); this.fecharBusca(); }} style={{ marginTop: '20px', marginBottom: '20px', marginRight: '30px' }}>
            Reset Busca
        </Button>
       
        </div>
      <Modal show={this.state.telaCadastro} onHide={this.fecharCadastro}  className="modal-dark">
        <Modal.Header closeButton>
          <Modal.Title>Registro de Livro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="form-dark">
        <Form.Group className="mb-3" controlId="formGridId">
            <Form.Label></Form.Label>
            <Form.Control type="text" value={this.state.id} readOnly={true} style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} style={{ display: 'none' }}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridNome">
            <Form.Label>Titulo</Form.Label>
            <Form.Control type="text" placeholder="Titulo da Obra" value={this.state.nome} onChange={this.atualizaNome} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridAutor">
            <Form.Label>Autor</Form.Label>
            <Form.Control type="text" placeholder="Autor" value={this.state.autor} onChange={this.atualizaAutor} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridGenero">
            <Form.Label>Genero</Form.Label>
            <Form.Control type="text" placeholder="Genero" value={this.state.genero} onChange={this.atualizaGenero} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridPaginas">
            <Form.Label>Páginas</Form.Label>
            <Form.Control type="number" placeholder="Quantidade de Páginas" value={this.state.paginas} onChange={this.atualizaPaginas} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridEditora">
            <Form.Label>Editora</Form.Label>
            <Form.Control type="text" placeholder="Editora" value={this.state.editora} onChange={this.atualizaEditora} />
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.fecharCadastro} style={{ marginLeft: '20px' }}>
            Fechar
          </Button>
          <Button variant="primary" onClick={this.submit} style={{ marginLeft: '20px' }}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.telaBusca} onHide={this.fecharBusca}  className="modal-dark">
        <Modal.Header closeButton>
          <Modal.Title>Buscar Livro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="form-dark">
         <Form.Group className="mb-3" >
            <Form.Label>Titulo</Form.Label>
            <Form.Control type="text" placeholder="Titulo da Obra" value={this.state.nomeBusca} onChange={(e) =>this.setState({ nomeBusca: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>Autor</Form.Label>
            <Form.Control type="text" placeholder="Autor" value={this.state.autorBusca} onChange={(e) => this.setState({ autorBusca: e.target.value })} />
          </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.submitBusca} style={{ marginLeft: '20px' }}>
            Buscar
          </Button>
        </Modal.Footer>
      </Modal>
                 
        {/* Tabela de livros */}
        {this.renderTabela()}
      </div>
    );
  }
}

export default Books;
