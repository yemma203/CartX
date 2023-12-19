import React, { useState, useEffect } from "react";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [sortParam, setSortParam] = useState(''); // Default sort by name

  const getCards = async () => {
    try {
      const response = await fetch(`http://localhost:8000/cards?sort=${sortParam}`);
      const jsonData = await response.json();

      setCards(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getCards();
  }, [sortParam, currentPage]);

  // Check if cards is an array before slicing
  const currentCards = Array.isArray(cards) ? cards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  ) : [];

  return (
    <div>
      <div>
        {/* Dropdown for sorting */}
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
      <div className="cards">
        {currentCards.map((card) => (
          <div className="card" key={card.id}>
            <div className="imgCard">
              <img src={card.img_url} alt="img of card" />
            </div>
            <p>
              Prix Ebay :{" "}
              {card.ebay_price === 0.0 ? "Prix inconnu" : card.ebay_price} $
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
    </div>
  );
}
