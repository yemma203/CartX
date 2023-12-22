import React, { useState } from "react";

const Card_Details_Without_Img = ({ card, onClose }) => {
  const [name, setCard_name] = useState(card.name);
  const [type, setType] = useState(card.type);
  const [rarity, setRarity] = useState(card.rarity);
  const [global_price, setGlobal_price] = useState(card.global_price);
  const [isEditing, setIsEditing] = useState(false);

  console.log(card.card_id);

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

  const handleDelete = async (e) => {
    console.log("yes");
    e.preventDefault();

    try {
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

  return (
    <div className="card-detail-overlay">
      <div className="card-detail">
        <div className="topCard">
          <input type="submit" value="" onClick={onClose}></input>
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
              {localStorage.getItem("userType") === "admin" ? (
                <div className="cardDetailButton">
                  <button onClick={() => setIsEditing(true)}>Modifier</button>
                  <button onClick={handleDelete}>Supprimer</button>
                </div>
              ) : card.user_id &&
                localStorage.getItem("userId") == card.user_id ? (
                <div className="cardDetailButton">
                  <button onClick={() => setIsEditing(true)}>Modifier</button>
                  <button onClick={handleDelete}>Supprimer</button>
                </div>
              ) : (
                <div></div>
              )}
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