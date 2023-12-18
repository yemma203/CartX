import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  // State

  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);

  // Fonction qui permet de récupérer les cartes

  const getCards = async () => {
    try {
      const response = await fetch("http://localhost:8000/cards");
      const jsonData = await response.json();

      setCards(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getCards();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div>
      <div className="cards">
        {currentCards.map((card) => (
          <div className="card" key={card.id}>
            <div className="imgCard">
              <img src={card.img_url} alt="img of card" />
            </div>
            <p>
              Prix Ebay :{" "}
              {card.ebay_price == 0.0 ? "Prix inconnu" : card.ebay_price} $
            </p>
            <p>{card.rarity}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (currentPage < Math.ceil(cards.length / cardsPerPage)) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
