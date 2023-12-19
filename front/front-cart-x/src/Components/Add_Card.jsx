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
    // (Vous devez implémenter cette fonction selon votre structure de base de données et les données nécessaires)
    try {
      const response = await fetch("http://localhost:8000/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newManualCard),
      });

      if (response.ok) {
        console.log("Carte ajoutée manuellement avec succès");
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
    <div>
      <h1>Ajouter une carte</h1>
      <form onSubmit={handleAddCard}>
        <label htmlFor="cardName">Nom de la carte</label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {showManualForm && (
        <div>
          <p>La carte n'existe pas dans l'API.</p>
          <p>Ajoutez manuellement la carte :</p>
          {/* Formulaire pour ajouter manuellement la carte */}
          <form onSubmit={handleManualAdd}>
            <label htmlFor="manualCardType">Type</label>
            <input
              type="text"
              id="manualCardType"
              value={manualCardType}
              onChange={(e) => setManualCardType(e.target.value)}
            />

            <label htmlFor="manualCardRarity">Rareté</label>
            <input
              type="text"
              id="manualCardRarity"
              value={manualCardRarity}
              onChange={(e) => setManualCardRarity(e.target.value)}
            />

            <label htmlFor="manualCardDescription">Description</label>
            <input
              type="text"
              id="manualCardDescription"
              value={manualCardDescription}
              onChange={(e) => setManualCardDescription(e.target.value)}
            />

            <label htmlFor="manualCardPrice">Prix général</label>
            <input
              type="text"
              id="manualCardPrice"
              value={manualCardPrice}
              onChange={(e) => setManualCardPrice(e.target.value)}
            />

            <button type="submit">Ajouter manuellement</button>
          </form>
        </div>
      )}
    </div>
  );
}
