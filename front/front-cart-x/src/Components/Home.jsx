import React, { useState, useEffect } from "react";
import Card_Details from "./Card_Details";
import Card_Details_Without_Img from "./Card_Details_Without_Img";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [sortParam, setSortParam] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const openCardDetail = (card) => {
    setSelectedCard(card);
  };

  const closeCardDetail = () => {
    setSelectedCard(null);
  };

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

  useEffect(() => {
    getCards();
  }, [sortParam, currentPage]);

  const currentCards = Array.isArray(cards)
    ? cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
    : [];

  return (
    <>
      <div className="homeContainer">
        <div className="homeLeft">
          <div>
            <label>Trier par :</label>
            <select
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value)}
            >
              <option value="name">Nom</option>
              <option value="rarity">Rareté</option>
              <option value="price">Prix</option>
            </select>
          </div>

          {localStorage.getItem("userType") === "admin" && (
            <div>
              {/* Afficher le bouton d'administration */}
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
        </div>

        <div className="cards">
          {currentCards.map((card) => (
            <div
              className="card"
              key={card.id}
              onClick={() => openCardDetail(card)}
            >
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
      <div className="pagination">
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          Précédent
        </button>
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
