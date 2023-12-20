import React, { useState } from "react";

const Card_Details_Without_Img = ({ card, onClose }) => {
  const [name, setCard_name] = useState(card.name);
  const [type, setType] = useState(card.type);
  const [rarity, setRarity] = useState(card.rarity);
  const [global_price, setGlobal_price] = useState(card.global_price);
  const [isEditing, setIsEditing] = useState(false);

  const handleModify = async (e) => {
    e.preventDefault();

    const updatedCard = {
      card_name: name,
      type: type,
      rarity: rarity,
      global_price: global_price,
    };

    try {
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

  return (
    <div className="card-detail-overlay">
      <div className="card-detail">
        <div className="topCard">
          <button onClick={onClose}>Fermer</button>
        </div>
        {isEditing ? (
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
          <div className="card-block-with-img">
            <div className="rightCard">
              <p>Nom de la carte : {card.name}</p>
              <p>Type : {card.type}</p>
              <p>Rarity : {card.rarity}</p>
              <p>Prix global : {card.global_price} $</p>
              <button onClick={() => setIsEditing(true)}>Modifier</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card_Details_Without_Img;
