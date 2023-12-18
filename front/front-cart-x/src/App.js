import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
// import Inscription from './components/Inscription';
// import Connexion from './components/Connexion';
import Home from './Components/Home';

function App() {
  return (
    <>
      <nav>
        <div className='logo'>
          <Link to="/">Home</Link>
        </div>
        {/* <div className='log'>
          <Link to="/login">Connexion</Link>
          <Link to="/inscription">Inscription</Link>
        </div> */}
      </nav>

      <Routes>
        {/* <Route path="/inscription" element={<Inscription />} />
        <Route path="/login" element={<Connexion />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
