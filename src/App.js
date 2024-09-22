// App.js
import './App.css';
import Home from './components/Home/Home';
import Sobre from './components/Sobre/Sobre';
import Books from './components/Books/Books';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header /> {/* O Header agora contém o título e as opções */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Books" element={<Books />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

