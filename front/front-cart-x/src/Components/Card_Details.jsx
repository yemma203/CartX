import React, { useState } from "react";

const Card_Details = ({ card, onClose }) => {
  const [type, setType] = useState(card.type);
  const [rarity, setRarity] = useState(card.rarity);
  const [ebay_price, setEbay_price] = useState(card.ebay_price);
  const [cardmarket_price, setCardmarket_price] = useState(card.cardmarket_price);
  const [tcgplayer_price, setTcgplayer_price] = useState(card.tcgplayer_price);
  const [amazon_price, setAmazon_price] = useState(card.amazon_price);
  const [isEditing, setIsEditing] = useState(false);

  const handleModify = async (e) => {
    e.preventDefault();

    const updatedCard = {
      type: type,
      rarity: rarity,
      ebay_price: ebay_price,
      cardmarket_price: cardmarket_price,
      tcgplayer_price: tcgplayer_price,
      amazon_price: amazon_price,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/cardsWithImg/${card.card_id}`,
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
          <button onClick={onClose}>Fermer</button>
        </div>
        {isEditing ? (
          <form onSubmit={handleModify} className="formModify">
            <label>
              Type :
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </label>
            <label>
              Rarity :
              <input
                type="text"
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
              />
            </label>
            <label>
              Prix Ebay :
              <input
                type="text"
                value={ebay_price}
                onChange={(e) => setEbay_price(e.target.value)}
              />
            </label>
            <label>
              Prix Cardmarket :
              <input
                type="text"
                value={cardmarket_price}
                onChange={(e) => setCardmarket_price(e.target.value)}
              />
            </label>
            <label>
              Prix TCGPlayer :
              <input
                type="text"
                value={tcgplayer_price}
                onChange={(e) => setTcgplayer_price(e.target.value)}
              />
            </label>
            <label>
              Prix Amazon :
              <input
                type="text"
                value={amazon_price}
                onChange={(e) => setAmazon_price(e.target.value)}
              />
            </label>
            <input type="submit" value="Modifier" />
          </form>
        ) : (
          <div className="card-block-with-img">
            <div className="cardWithImg">
              <img src={card.img_url} alt="img of card" />
            </div>
            <div className="rightCard">
              <p>Type : {card.type}</p>
              <p>Rarity : {card.rarity}</p>
              <ul>
                Prix des différentes plateformes :
                {card.ebay_price != 0 ? (
                  <li>Prix Ebay : {card.ebay_price} €</li>
                ) : (
                  <li>Prix Ebay : Inconnu</li>
                )}
                {card.cardmarket_price != 0 ? (
                  <li>Prix Cardmarket : {card.cardmarket_price} €</li>
                ) : (
                  <li>Prix Cardmarket : Inconnu</li>
                )}
                {card.tcgplayer_price != 0 ? (
                  <li>Prix TCGPlayer : {card.tcgplayer_price} €</li>
                ) : (
                  <li>Prix TCGPlayer : Inconnu</li>
                )}
                {card.amazon_price != 0 ? (
                  <li>Prix Amazon : {card.amazon_price} €</li>
                ) : (
                  <li>Prix Amazon : Inconnu</li>
                )}
              </ul>
              {/* On verifie si l'utilisateur est admin ou si c'est lui qui a créer la carte */}
                {localStorage.getItem("userType") === "admin" ||
                localStorage.getItem("userId") == card.user_id ? (
                    <div>
                        <button onClick={() => setIsEditing(true)}>Modifier</button>
                        <button onClick={handleDelete}>Supprimer</button>    
                    </div>
                ) : (
                  <div></div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card_Details;
