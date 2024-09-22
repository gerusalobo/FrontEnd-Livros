import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css'; // Importar seu CSS personalizado

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-title">
        <h1 className="header-text">Books Database</h1>
      </div>
      <div className="header-nav">
        <Nav  defaultActiveKey="/home">
      {/*   
        <Nav.Link as={Link} to="/">Página Inicial</Nav.Link>
        <Nav.Link as={Link} to="/Books">Livros</Nav.Link> 
        */}
        </Nav>
      </div>
    </div>
  );
};

export default Header;




