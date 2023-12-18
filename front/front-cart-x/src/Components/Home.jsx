import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
    // State

    const [cards, setCards] = useState([]);

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

    // Afficher dans le terminal les cartes

    console.log(cards);
    return (
        <div>
            <h1>Home</h1>
            <div className="cards">
                {cards.map((card) => (
                    <div className="card" key={card.id}>
                        <h2>{card.name}</h2>
                        <img src={card.img_url} alt="img of card" />
                        <p>{card.type}</p>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
