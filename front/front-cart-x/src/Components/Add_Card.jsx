import React, { useState, useEffect } from "react";

export default function Add_Card() {
  const [cardName, setCardName] = useState("");
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualCardType, setManualCardType] = useState("");
  const [manualCardRarity, setManualCardRarity] = useState("");
  const [manualCardDescription, setManualCardDescription] = useState("");
  const [manualCardPrice, setManualCardPrice] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    // Utilisez une fonction asynchrone dans useEffect pour récupérer les cartes
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php"
        );
        const data = await response.json();
        setCards(data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes", error);
      }
    };

    fetchData(); // Appelez la fonction asynchrone
  }, []); // Assurez-vous de mettre une dépendance vide pour exécuter useEffect une seule fois

  const checkCard = (cardName) => {
    return cards.filter((card) => card.name === cardName);
  };

  const checkCardDB = async (cardImgUrl) => {
    try {
      const response = await fetch("http://localhost:8000/cards");
      const data = await response.json();
      return data.filter((card) => card.img_url === cardImgUrl);
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes", error);
    }
  };

  // Fonction pour ajouter le lien entre l'id de la carte et l'id de l'utilisateur dans la table "user_cards"
  const addCardToUserCards = async (userId) => {
    try {
      const response = await fetch("http://localhost:8000/users_cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,})
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la carte à la table user_cards", error);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();

    const cardData = checkCard(cardName);

    if (cardData.length > 0) {
      const cardImgUrl = cardData[0].card_images[0].image_url;

      // Vérifie si la carte n'est pas déjà présente dans la base de données
      const existingCardInDB = await checkCardDB(cardImgUrl);

      if (existingCardInDB.length === 0) {
        const newCard = {
          img_url: cardImgUrl,
          ebay_price: cardData[0].card_prices[0].ebay_price,
          rarity: cardData[0].card_sets[0].set_rarity,
        };

        try {
          const response = await fetch("http://localhost:8000/cards", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newCard),
          });

          if (response.ok) {
            console.log("Carte ajoutée avec succès");

            // Ajoutez le lien entre l'id de la carte et l'id de l'utilisateur dans la table "user_cards"
            addCardToUserCards(localStorage.getItem("userId"));

            setCardName("");
            setErrorMessage("");
            setShowManualForm(false); // Réinitialisez le formulaire manuel
          } else {
            console.log("Erreur lors de l'ajout de la carte");
          }
        } catch (err) {
          console.error(err.message);
        }
      } else {
        setErrorMessage("La carte est déjà présente dans la base de données");
      }
    } else {
      // Si la carte n'existe pas dans l'API, affichez un formulaire pour ajouter la carte manuellement
      setErrorMessage(""); // Effacez le message d'erreur précédent
      setShowManualForm(true); // Affichez le formulaire manuel
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();

    // Récupérez les données nécessaires depuis le formulaire manuel
    const newManualCard = {
      name: cardName,
      type: manualCardType,
      rarity: manualCardRarity,
      description: manualCardDescription,
      global_price: manualCardPrice,
    };

    // Ajoutez la carte manuellement à la base de données
    try {
      const response = await fetch("http://localhost:8000/manualCards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newManualCard),
      });

      if (response.ok) {

        // Ajoutez le lien entre l'id de la carte et l'id de l'utilisateur dans la table "user_cards"
        addCardToUserCards(localStorage.getItem("userId"));

        setCardName("");
        setManualCardType("");
        setManualCardRarity("");
        setManualCardDescription("");
        setManualCardPrice("");
        setErrorMessage("");
        setShowManualForm(false); // Réinitialisez le formulaire manuel
      } else {
        console.log("Erreur lors de l'ajout manuel de la carte");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="addCardContainer">
      <h1>Card's name</h1>
      <form onSubmit={handleAddCard}>
        <input
          type="text"
          id="cardName"
          value={cardName}
          placeholder="Card's name"
          onChange={(e) => setCardName(e.target.value)}
        />
        {!showManualForm && (
          <button type="submit">Add</button>
          )}
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {showManualForm && (
        <div className="addCardManualContainer">
          <div className="addCardManualText">
          <p>This card doesn't exist</p>
          <p>Put your own informations :</p>

          </div>
          <form onSubmit={handleManualAdd}>
            <input
              type="text"
              id="manualCardType"
              value={manualCardType}
              placeholder="Type"
              onChange={(e) => setManualCardType(e.target.value)}
            />
            <input
              type="text"
              id="manualCardRarity"
              value={manualCardRarity}
              placeholder="Rarity"
              onChange={(e) => setManualCardRarity(e.target.value)}
            />
            <input
              type="text"
              id="manualCardDescription"
              value={manualCardDescription}
              placeholder="Description"
              onChange={(e) => setManualCardDescription(e.target.value)}
            />
            <input
              type="text"
              id="manualCardPrice"
              value={manualCardPrice}
              placeholder="Price"
              onChange={(e) => setManualCardPrice(e.target.value)}
            />

            <button type="submit">Add</button>
          </form>
        </div>
      )}
    </div>
  );
}
