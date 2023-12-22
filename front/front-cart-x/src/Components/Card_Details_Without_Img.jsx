import React, { useState } from "react";

const Card_Details_Without_Img = ({ card, onClose }) => {
  // States
  const [name, setCard_name] = useState(card.name);
  const [type, setType] = useState(card.type);
  const [rarity, setRarity] = useState(card.rarity);
  const [global_price, setGlobal_price] = useState(card.global_price);
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour gérer la modification d'une carte
  const handleModify = async (e) => {
    e.preventDefault();

    // Création d'un objet avec les données mises à jour de la carte
    const updatedCard = {
      card_name: name,
      type: type,
      rarity: rarity,
      global_price: global_price,
    };

    try {
      // Envoi de la requête PUT pour mettre à jour la carte dans la base de données
      const response = await fetch(
        `http://localhost:8000/cardsWithoutImg/${card.card_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCard),
        }
      );

      if (response.ok) {
        console.log("Carte modifiée avec succès");
        setIsEditing(false);
        window.location.reload();
      } else {
        console.log("Erreur lors de la modification de la carte");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fonction pour gérer la suppression d'une carte
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      // Envoi de la requête DELETE pour supprimer la carte de la base de données
      const response = await fetch(
        `http://localhost:8000/cards/${card.card_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Carte supprimée avec succès");
        setIsEditing(false);
        window.location.reload();
      } else {
        console.log("Erreur lors de la suppression de la carte");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Rendu du composant
  return (
    <div className="card-detail-overlay">
      <div className="card-detail">
        <div className="topCard">
          <input type="submit" value="" onClick={onClose}></input>
        </div>
        {isEditing ? (
          // Formulaire de modification de la carte
          <form onSubmit={handleModify} className="formModify">
            <label>Nom de la carte :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setCard_name(e.target.value)}
            />
            <label>Type :</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <label>Rareté :</label>
            <input
              type="text"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
            />
            <label>Prix global :</label>
            <input
              type="text"
              value={global_price}
              onChange={(e) => setGlobal_price(e.target.value)}
            />
            <input type="submit" value="Modifier" />
          </form>
        ) : (
          // Affichage des détails de la carte sans édition
          <div className="card-block-with-img">
            <div className="rightCard">
              <p>Nom de la carte : {card.name}</p>
              <p>Type : {card.type}</p>
              <p>Rareté : {card.rarity}</p>
              <p>Prix global : {card.global_price} $</p>
              {localStorage.getItem("userType") === "admin" ? (
                // Boutons pour modifier et supprimer la carte (pour les administrateurs)
                <div className="cardDetailButton">
                  <button onClick={() => setIsEditing(true)}>Modifier</button>
                  <button onClick={handleDelete}>Supprimer</button>
                </div>
              ) : card.user_id &&
                localStorage.getItem("userId") == card.user_id ? (
                // Boutons pour modifier et supprimer la carte (pour le propriétaire)
                <div className="cardDetailButton">
                  <button onClick={() => setIsEditing(true)}>Modifier</button>
                  <button onClick={handleDelete}>Supprimer</button>
                </div>
              ) : (
                // Affichage vide si l'utilisateur n'est ni administrateur ni propriétaire de la carte
                <div></div>
              )}
              {/* Bouton pour ajouter la carte à la collection personnelle */}
              <div className="cardDetailButton">
                <button
                  onClick={() => {
                    const collection = JSON.parse(
                      localStorage.getItem("collection")
                    );
                    collection.push(card);
                    localStorage.setItem(
                      "collection",
                      JSON.stringify(collection)
                    );
                    window.location.reload();
                  }}
                >
                  Ajouter à la collection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card_Details_Without_Img;
