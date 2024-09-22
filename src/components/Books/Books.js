import React, { useEffect, useState } from "react"
import {Table, Form, Button} from 'react-bootstrap';



class Books extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            nome: '',
            autor: '',
            genero: '',
            paginas:'',
            editora: '',

            books : [],
        };
        // Vincular o método submit ao contexto da classe
    this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.getLivros();
      }

    getLivros(){
        fetch('/livros', {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
              'Accept': 'application/json'
            }
          })
          .then(resposta => resposta.json())
          .then(dados => {
            this.setState({ books: dados });
          });
      }
    
      deleteLivros = (id) => {
        fetch('/livros/'+id, {
            method: 'DELETE',
            headers: {
              'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
              'Accept': '*/*'
            }
          })
          .then(resposta => {
            if(resposta.ok){
                this.getLivros();
            }
          });
      }

      updateLivros = (id) => {
        fetch('/livros/'+id, {
            method: 'UPDATE',
            headers: {
              'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
              'Accept': '*/*'
            }
          })
          .then(resposta => {
            if(resposta.ok){
                this.getLivros();
            }
          });
      }

      createLivros = (livro) => {
        fetch('/livros', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${process.env.REACT_APP_API_TOKEN}`,
              'Content-Type': 'application/json'},
            body: JSON.stringify(livro)
          })
          .then(resposta => {
            if(resposta.ok){
                this.getLivros();
            }
          });
      }

    componentWillUnmount(){   

    }

    renderTabela(){
        return(
        <Table striped bordered hover>
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
                <tr>
                    <td>{book.nome}</td>
                    <td>{book.autor}</td>
                    <td>{book.genero}</td>
                    <td>{book.paginas}</td>
                    <td>{book.editora}</td>
                    <td><Button variant="primary">Atualizar</Button>{' '} <Button variant="danger" onClick={() => this.deleteLivros(book._id)}>Excluir</Button>{' '}</td>
            </tr>
                )     
            }
            </tbody>
        </Table>
       );
    }  
    atualizaNome = (e) => {
        this.setState({
            nome: e.target.value
        })
    }
    atualizaAutor = (e) => {
        this.setState({
            autor: e.target.value
        })
    }
    atualizaGenero = (e) => {
        this.setState({
            genero: e.target.value
        })
    }
    atualizaPaginas = (e) => {
        this.setState({
            paginas: e.target.value
        })
    }
    atualizaEditora = (e) => {
        this.setState({
            editora: e.target.value
        })
    }

    submit(e){
        e.preventDefault();
        const livro = {
            nome : this.state.nome,
            autor : this.state.autor,
            genero : this.state.genero,
            paginas : this.state.paginas,
            editora : this.state.editora
        }
        this.createLivros(livro);
         // Limpar o formulário
        this.setState({
            nome: '',
            autor: '',
            genero: '',
            paginas: '',
            editora: ''
        });
    }


    render(){
        return(
            <div>
                <Form  onSubmit={this.submit}>
                    <Form.Group className="mb-3" controlId="formGridNome">
                        <Form.Label>Titulo</Form.Label>
                        <Form.Control type="text" placeholder="Titulo da Obra" value={this.state.nome} onChange={this.atualizaNome} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridAutor">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control type="text" placeholder="Autor" value={this.state.autor} onChange={this.atualizaAutor}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridGenero">
                        <Form.Label>Genero</Form.Label>
                        <Form.Control type="text" placeholder="Genero" value={this.state.genero} onChange={this.atualizaGenero}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridPaginas">
                        <Form.Label>Páginas</Form.Label>
                        <Form.Control type="number" placeholder="Quantidade de Páginas" value={this.state.paginas} onChange={this.atualizaPaginas}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridEditora">
                        <Form.Label>Editora</Form.Label>
                        <Form.Control type="text" placeholder="Editora" value={this.state.editora} onChange={this.atualizaEditora}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Salvar
                    </Button>
                </Form>
                {this.renderTabela()}
            </div>
        )
    }
}
export default Books;