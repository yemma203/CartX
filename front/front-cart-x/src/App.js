import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import Inscription from './Components/Inscription';
import Connexion from './Components/Connexion';
import Home from './Components/Home';
import Add_Card from './Components/Add_Card';
import Collection from './Components/Collection';

function App() {
  return (
    <>
      <nav>
        <div className='logo'>
          <Link to="/">
            <img src='./logoHome.png' alt="logo" />
          </Link>
        </div>  
        {localStorage.getItem('userType') === 'admin' || localStorage.getItem('userType') === 'createur' ? (
          <div className='add'>
            <Link to="/addCard">
              <input className='addCardButton' type="button" value="Ajouter une carte" />
            </Link>
          </div>
        ) : (
          <div></div>
        )}
        {localStorage.getItem('userName') ? (
          <button className='logoDeco'
            onClick={() => {
              localStorage.removeItem('userName');
              localStorage.removeItem('userType');
              localStorage.removeItem('userId');
              localStorage.setItem('collection', JSON.stringify([]));
              window.location.reload();
            }}
          >
          </button>
        ) : (
          <div className='log'>
            <Link to="/login">
              <input type="button" value="Connexion" />
            </Link>
            <Link to="/inscription">
              <input type="button" value="Inscription" />
            </Link>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/login" element={<Connexion />} />
        <Route path="/" element={<Home />} />
        <Route path="/addCard" element={<Add_Card />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </>
  );
}

export default App;
