import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Adicione esta linha para importar o Link
//import './Home.css'; // Certifique-se de que o CSS está importado corretamente
import '../../App.css';

function Home() {
  return (
    <div className="home-container">
              <div className="image-section">
        <img src="/clipart2755190.png" alt="" style={{ width: '50%', height: 'auto' }} />
      </div>
      <div className="welcome-section">
        <h2 style={{ color: 'white' }}>Seu Database de Livros</h2>
        <Button 
          variant="secondary" 
          as={Link} 
          to="/Books" 
          style={{ marginTop: '20px' }} // Espaçamento acima do botão
        >
          Entrar
        </Button>
      </div>

    </div>
  );
}

export default Home;

