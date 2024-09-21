import React, { useEffect, useState } from "react"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


class Books extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            books : [],
        }
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

      createLivros = () => {
        fetch('/livros', {
            method: 'POST',
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

    componentWillUnmount(){   

    }

    render(){
        return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Nome</th>
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
}
export default Books;