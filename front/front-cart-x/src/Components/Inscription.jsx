import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Importer useHistory

const Inscription = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const history = useHistory(); // Utiliser useHistory pour obtenir l'objet history

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Faire la requête POST pour ajouter l'utilisateur
      const response = await axios.post('/utilisateur.php', {
        action: 'inscription',
        username,
        password,
        type_user: userType,
      });

      // Logique de traitement de la réponse si nécessaire
      console.log(response.data);

      // Réinitialiser le formulaire
      setUsername('');
      setPassword('');
      setUserType('');

      // Rediriger vers la page de connexion
      history.push('/connexion'); // Utiliser history.push pour la redirection
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
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
      <label>
        Type d'utilisateur:
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="joueur">Joueur</option>
          <option value="createur">Créateur</option>
        </select>
      </label>
      <br />
      <button type="submit">Ajouter l'utilisateur</button>
    </form>
  );
};

export default Inscription;
