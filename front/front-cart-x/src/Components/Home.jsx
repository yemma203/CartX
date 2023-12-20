import React, { useState, useEffect } from "react";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [sortParam, setSortParam] = useState("");
  const userType = localStorage.getItem("userType");

  console.log(localStorage)


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
    <div>
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

      <div className="cards">
        {currentCards.map((card) => (
          <div className="card" key={card.id}>
            {card.img_url ? (
              <div className="cardWithImg">
                <img src={card.img_url} alt="img of card" />
                {/* Si le ebay_price est de 0.00 on le remplace par Prix Inconnu */}
                <p>
                  Prix sur Ebay:{" "}
                  {card.ebay_price === "0.00" ? "Inconnu" : card.ebay_price + "$"}
                </p>
                <p>{card.rarity}</p>
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
      </div>

      {userType === "admin" && (
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
