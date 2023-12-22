import React, { useState, useEffect } from "react";
import Card_Details from "./Card_Details";
import Card_Details_Without_Img from "./Card_Details_Without_Img";
import Collection from "./Collection";
import { Link, Routes, Route } from "react-router-dom";

export default function Home() {
  // States
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [sortParam, setSortParam] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  // Fonction pour ouvrir les détails d'une carte
  const openCardDetail = (card) => {
    setSelectedCard(card);
  };

  // Fonction pour fermer les détails d'une carte
  const closeCardDetail = () => {
    setSelectedCard(null);
  };

  // Fonction pour récupérer les cartes depuis l'API
  const getCards = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/cards?sort=${sortParam}`
      );
      const jsonData = await response.json();

      setCards(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Effet pour charger les cartes lorsque le paramètre de tri ou la page actuelle changent
  useEffect(() => {
    getCards();
  }, [sortParam, currentPage]);

  // Cartes actuellement affichées sur la page
  const currentCards = Array.isArray(cards)
    ? cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
    : [];

  // Rendu du composant
  return (
    <>
      <div className="homeContainer">
        {/* Section de gauche de la page d'accueil */}
        <div className="homeLeft">
          <div>
            <label>Trier par :</label>
            {/* Menu déroulant pour choisir le paramètre de tri */}
            <select
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value)}
            >
              <option value="name">Nom</option>
              <option value="rarity">Rareté</option>
              <option value="price">Prix</option>
            </select>
          </div>

          {/* Affichage du bouton d'administration pour les utilisateurs admin */}
          {localStorage.getItem("userType") === "admin" && (
            <div>
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost/CarteXlien/back/admin.php")
                }
              >
                Administration
              </button>
            </div>
          )}

          {/* Lien vers la page de collection */}
          <Link to="/collection">
            <input type="button" className="myDeckButton" value="My Deck" />
          </Link>
        </div>

        {/* Section d'affichage des cartes */}
        <div className="cards">
          {currentCards.map((card) => (
            <div
              className="card"
              key={card.id}
              onClick={() => openCardDetail(card)}
            >
              {/* Affichage de la carte avec ou sans image */}
              {card.img_url ? (
                <div className="cardWithImg">
                  <img src={card.img_url} alt="img of card" />
                </div>
              ) : (
                <div className="cardWithoutImg">
                  <p>Nom: {card.name}</p>
                  <p>Rareté: {card.rarity}</p>
                  <p>Description: {card.description}</p>
                  <p>Type: {card.type}</p>
                  <p>Prix global: {card.global_price} $</p>
                </div>
              )}
            </div>
          ))}
          {/* Affichage des détails de la carte sélectionnée */}
          {selectedCard && selectedCard.img_url != null && (
            <Card_Details card={selectedCard} onClose={closeCardDetail} />
          )}
          {selectedCard && selectedCard.img_url == null && (
            <Card_Details_Without_Img
              card={selectedCard}
              onClose={closeCardDetail}
            />
          )}
        </div>
      </div>
      {/* Section de pagination */}
      <div className="pagination">
        {/* Bouton pour passer à la page précédente */}
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          Précédent
        </button>
        {/* Bouton pour passer à la page suivante */}
        <button
          onClick={() => {
            if (currentPage < Math.ceil(cards.length / cardsPerPage)) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          Suivant
        </button>
      </div>
    </>
  );
}
