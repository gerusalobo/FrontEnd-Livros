import './App.css';
import Home from './components/Home/Home';
import Sobre from './components/Sobre/Sobre';
import Books from './components/Books/Books';
import {BrowserRouter, Routes, Link, Route} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <h1> teste</h1>
    <BrowserRouter>
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Link as={Link} to="/">Página Inicial</Nav.Link>
      <Nav.Link as={Link} to="/Books">Livros</Nav.Link>
      <Nav.Link as={Link} to="/Sobre">Sobre</Nav.Link>
    </Nav>

     <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/Books" element={<Books/>}></Route>
    <Route path="/Sobre" element={<Sobre/>}></Route>

    </Routes>
    </BrowserRouter>


    </div>
  );
}

export default App;
