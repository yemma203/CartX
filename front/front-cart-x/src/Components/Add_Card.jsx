import React, { useState, useEffect } from "react";

export default function Add_Card() {
  // States
  const [cardName, setCardName] = useState("");
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualCardType, setManualCardType] = useState("");
  const [manualCardRarity, setManualCardRarity] = useState("");
  const [manualCardDescription, setManualCardDescription] = useState("");
  const [manualCardPrice, setManualCardPrice] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  // Effet secondaire pour récupérer les données des cartes depuis une API
  useEffect(() => {
    // Utilisation d'une fonction asynchrone dans useEffect pour effectuer la requête
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

    fetchData(); // Appel de la fonction asynchrone
  }, []); // Utilisation d'une dépendance vide pour exécuter useEffect une seule fois

  // Fonction pour vérifier si une carte existe déjà dans la collection
  const checkCard = (cardName) => {
    return cards.filter((card) => card.name === cardName);
  };

  // Fonction pour vérifier si une carte existe déjà dans la base de données locale
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
          user_id: userId,
        }),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de la carte à la table user_cards",
        error
      );
    }
  };

  // Gestionnaire d'événements pour ajouter une carte à la collection
  const handleAddCard = async (e) => {
    e.preventDefault();

    // Vérifier si la carte existe dans la liste des cartes récupérées
    const cardData = checkCard(cardName);

    if (cardData.length > 0) {
      const cardImgUrl = cardData[0].card_images[0].image_url;

      // Vérifier si la carte n'est pas déjà présente dans la base de données locale
      const existingCardInDB = await checkCardDB(cardImgUrl);

      if (existingCardInDB.length === 0) {
        // Créer une nouvelle carte avec des données spécifiques de l'API
        const newCard = {
          img_url: cardImgUrl,
          ebay_price: cardData[0].card_prices[0].ebay_price,
          rarity: cardData[0].card_sets[0].set_rarity,
        };

        try {
          // Envoyer la nouvelle carte à la base de données
          const response = await fetch("http://localhost:8000/cards", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newCard),
          });

          if (response.ok) {
            console.log("Carte ajoutée avec succès");

            // Ajouter le lien entre l'id de la carte et l'id de l'utilisateur dans la table "user_cards"
            addCardToUserCards(localStorage.getItem("userId"));

            // Réinitialiser les états et masquer le formulaire manuel
            setCardName("");
            setErrorMessage("");
            setShowManualForm(false);
          } else {
            console.log("Erreur lors de l'ajout de la carte");
          }
        } catch (err) {
          console.error(err.message);
        }
      } else {
        // Afficher un message d'erreur si la carte est déjà dans la base de données
        setErrorMessage("La carte est déjà présente dans la base de données");
      }
    } else {
      // Si la carte n'existe pas dans l'API, afficher le formulaire pour ajouter manuellement la carte
      setErrorMessage(""); // Effacer le message d'erreur précédent
      setShowManualForm(true); // Afficher le formulaire manuel
    }
  };

  // Gestionnaire d'événements pour ajouter manuellement une carte à la collection
  const handleManualAdd = async (e) => {
    e.preventDefault();

    // Récupérer les données du formulaire manuel
    const newManualCard = {
      name: cardName,
      type: manualCardType,
      rarity: manualCardRarity,
      description: manualCardDescription,
      global_price: manualCardPrice,
    };

    try {
      // Envoyer la nouvelle carte manuelle à la base de données
      const response = await fetch("http://localhost:8000/manualCards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newManualCard),
      });

      if (response.ok) {
        // Ajouter le lien entre l'id de la carte et l'id de l'utilisateur dans la table "user_cards"
        addCardToUserCards(localStorage.getItem("userId"));

        // Réinitialiser les états et masquer le formulaire manuel
        setCardName("");
        setManualCardType("");
        setManualCardRarity("");
        setManualCardDescription("");
        setManualCardPrice("");
        setErrorMessage("");
        setShowManualForm(false);
      } else {
        console.log("Erreur lors de l'ajout manuel de la carte");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Rendu du composant
  return (
    <div className="addCardContainer">
      <h1>Nom de la carte</h1>
      <form onSubmit={handleAddCard}>
        <input
          type="text"
          id="cardName"
          value={cardName}
          placeholder="Nom de la carte"
          onChange={(e) => setCardName(e.target.value)}
        />
        {!showManualForm && <button type="submit">Ajouter</button>}
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {showManualForm && (
        <div className="addCardManualContainer">
          <div className="addCardManualText">
            <p>Cette carte n'existe pas</p>
            <p>Entrez vos propres informations :</p>
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
              placeholder="Rareté"
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
              placeholder="Prix"
              onChange={(e) => setManualCardPrice(e.target.value)}
            />
            <button type="submit">Ajouter</button>
          </form>
        </div>
      )}
    </div>
  );
}
