import React, { useState } from "react";

const Card = ({ card, onDelete }) => (
  <div
    className={
      card.img_url ? "cardCollectionWithImg" : "cardCollectionWithoutImg"
    }
  >
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
    <button type="submit" onClick={() => onDelete(card.card_id)}>Supprimer</button>
  </div>
);

const CardCollection = () => {
  const [collection, setCollection] = useState(
    JSON.parse(localStorage.getItem("collection")) || []
  );

  const handleDelete = (cardId) => {
    const newCollection = collection.filter((card) => card.card_id !== cardId);
    setCollection(newCollection);
    localStorage.setItem("collection", JSON.stringify(newCollection));
  };

  const renderCards = () => {
    if (collection.length === 0) {
      return (
        <div className="noCollection">
          <h2>Votre collection est vide</h2>
          <p>
            Vous pouvez ajouter des cartes à votre collection en cliquant sur le
            bouton "Ajouter à la collection" sur la page d'une carte
          </p>
        </div>
      )
    }

    return collection.map((card) => (
      <Card key={card.id} card={card} onDelete={handleDelete} />
    ))
  }

  return(
  <div className="collectionContainer">
    <h1>My Deck !</h1>
    <div className="cards">{renderCards()}</div>
  </div>
  )
}

export default CardCollection;
