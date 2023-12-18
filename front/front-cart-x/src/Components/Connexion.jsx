import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Connexion = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Faire la requête POST pour vérifier la connexion
      const response = await axios.post('/connexion.php', {
        action:'connexion',
        username,
        password,
      });

      // Logique de traitement de la réponse si nécessaire
      console.log(response.data);

      // Si la connexion est réussie, rediriger vers la page des cartes
      if (response.data.success) {
        history.push('/cartes'); // Remplacez '/cartes' par le chemin de votre page des cartes
      } else {
        console.error('Échec de la connexion');
      }

      // Réinitialiser le formulaire
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom d'utilisateur:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Mot de passe:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default Connexion;
