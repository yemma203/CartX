import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import Inscription from './Components/Inscription';
import Connexion from './Components/Connexion';
import Home from './Components/Home';
import Add_Card from './Components/Add_Card';

function App() {
  return (
    <>
      <nav>
        <div className='logo'>
          <Link to="/">Home</Link>
        </div>
        {/* On check si le localstorage contient le nom d'un utilisateur */}
        {/* Si oui, on affiche un bouton pour se déconnecter (quand on clique sur le bouton, on vide alors le localStorage) */}
        {/* Sinon, on affiche un bouton pour se connecter */}
        {localStorage.getItem('username') ? (
          <button
            onClick={() => {
              localStorage.removeItem('username');
              window.location.reload();
              // Ajoutez ici d'autres actions à effectuer lors de la déconnexion si nécessaire
            }}
          >
            Déconnexion
          </button>
        ) : (
          <div className='log'>
            <Link to="/login">Connexion</Link>
            <Link to="/inscription">Inscription</Link>
          </div>
        )}
        <div className='addCart'>
          <Link to="/addCard">Ajouter Carte</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/login" element={<Connexion />} />
        <Route path="/" element={<Home />} />
        <Route path="/addCard" element={<Add_Card />} />
      </Routes>
    </>
  );
}

export default App;
