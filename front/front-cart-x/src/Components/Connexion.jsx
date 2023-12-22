import React, { useState } from "react";

export default function Connexion() {
  // States
  const [username, setUsername] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");

  // Fonction pour gérer la connexion de l'utilisateur
  const handleLogin = async (e) => {
    e.preventDefault();

    // Création de l'objet utilisateur avec les informations saisies
    const user = {
      username: username,
      mot_de_passe: mot_de_passe,
    };

    try {
      // Envoi de la requête POST pour la connexion
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        try {
          // Envoi de la requête GET pour récupérer les données de l'utilisateur connecté
          const response2 = await fetch(
            `http://localhost:8000/users/${username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response2.ok) {
            // Récupération des données de l'utilisateur
            const userData = await response2.json();

            console.log("Utilisateur connecté avec succès");
            setUsername("");
            setMot_de_passe("");

            console.log("userData", userData.user_id);

            // On ajoute l'utilisateur dans le localStorage pour le connecter
            localStorage.setItem("userId", userData.user_id);
            localStorage.setItem("userName", username);
            localStorage.setItem("userType", userData.type_user);
            localStorage.setItem("collection", JSON.stringify([]));

            // Redirection vers la page principale
            window.location.href = "/";
          } else {
            console.log(
              "Erreur lors de la récupération des données de l'utilisateur"
            );
          }
        } catch (err) {
          console.log(
            "Erreur lors de la récupération des données de l'utilisateur:",
            err.message
          );
        }
      } else {
        console.log("Erreur lors de la connexion de l'utilisateur");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Rendu du composant
  return (
    <div className="connexionContainer">
      <h1>Log in</h1>
      {/* Formulaire de connexion */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          id="username"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          id="mot_de_passe"
          value={mot_de_passe}
          placeholder="Password"
          onChange={(e) => setMot_de_passe(e.target.value)}
        />
        {/* Bouton de soumission du formulaire */}
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
