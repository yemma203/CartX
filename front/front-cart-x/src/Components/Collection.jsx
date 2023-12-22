import React, { useState } from "react";

const Card = ({ card, onDelete }) => (
  <div
    className={
      card.img_url ? "cardCollectionWithImg" : "cardCollectionWithoutImg"
    }
  >
    {/* Condition rendant soit une image, soit les détails de la carte en fonction de si la carte a une img_url */}
    {card.img_url ? (
      <>
        <img src={card.img_url} alt="img of card" />
      </>
    ) : (
      <>
        <p>Nom: {card.name}</p>
        <p>Rareté: {card.rarity}</p>
        <p>Description: {card.description}</p>
        <p>Type: {card.type}</p>
        <p>Prix global: {card.global_price} $</p>
      </>
    )}
    {/* Bouton de suppression de la carte avec gestion de l'événement */}
    <button type="submit" onClick={() => onDelete(card.card_id)}>
      Supprimer
    </button>
  </div>
);

// Composant principal représentant la collection complète
const CardCollection = () => {
  // État local pour stocker la collection avec utilisation du localStorage
  const [collection, setCollection] = useState(
    JSON.parse(localStorage.getItem("collection")) || []
  );

  // Fonction pour gérer la suppression d'une carte de la collection
  const handleDelete = (cardId) => {
    // Filtrer la collection pour exclure la carte à supprimer
    const newCollection = collection.filter((card) => card.card_id !== cardId);
    // Mettre à jour l'état local et le localStorage avec la nouvelle collection
    setCollection(newCollection);
    localStorage.setItem("collection", JSON.stringify(newCollection));
  };

  // Fonction pour rendre les cartes dans la collection
  const renderCards = () => {
    if (collection.length === 0) {
      // Rendu lorsque la collection est vide
      return (
        <div className="noCollection">
          <h2>Votre collection est vide</h2>
          <p>
            Vous pouvez ajouter des cartes à votre collection en cliquant sur le
            bouton "Ajouter à la collection" sur la page d'une carte
          </p>
        </div>
      );
    }

    // On map sur les cartes de la collection pour les afficher
    return collection.map((card) => (
      <Card key={card.id} card={card} onDelete={handleDelete} />
    ));
  };

  return (
    <div className="collectionContainer">
      <h1>My Deck !</h1>
      <div className="cards">{renderCards()}</div>
    </div>
  );
};

export default CardCollection;
