import React from "react";
import { useState } from "react";

export default function Inscription() {
  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");
  const [type_utilisateur, setType_utilisateur] = useState("");

  // Fonction pour ajouter un nouvel utilisateur
  const handleAddUser = async (e) => {
    e.preventDefault();

    // Création de l'objet utilisateur avec les informations saisies
    const newUser = {
      username: username,
      email: email,
      mot_de_passe: mot_de_passe,
      type_utilisateur: type_utilisateur,
    };

    try {
      // Envoi de la requête POST pour ajouter l'utilisateur
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log("Utilisateur ajouté avec succès");
        setUsername("");
        setEmail("");
        setMot_de_passe("");
        setType_utilisateur("");

        // Redirection vers la page d'accueil après l'inscription
        window.location.href = "/home";
      } else {
        console.log("Erreur lors de l'ajout de l'utilisateur");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Rendu du composant
  return (
    <div className="connexionContainer" style={{ height: "400px" }}>
      <h1>Sign Up</h1>
      {/* Formulaire d'inscription */}
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          id="username"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          id="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          id="mot_de_passe"
          value={mot_de_passe}
          placeholder="Password"
          onChange={(e) => setMot_de_passe(e.target.value)}
        />
        {/* Formulaire qui permet de choisir entre joueur et créateur */}
        <select
          id="type_utilisateur"
          value={type_utilisateur}
          onChange={(e) => setType_utilisateur(e.target.value)}
        >
          <option value="joueur">Player</option>
          <option value="createur">Creator</option>
        </select>

        {/* Bouton de soumission du formulaire */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
