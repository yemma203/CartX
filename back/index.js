const express = require('express');
const cors = require('cors');
const app = express();
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');


require('dotenv').config();

const pool = mariadb.createPool({
    user: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit: 100,
});

app.use(cors());
app.use(express.json());

// 
// METHODS FOR CARDS
// 


// GET

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


// POST

app.post('/cards', async (req, res) => {
    const newCard = req.body;
    let conn;

    try{
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO cards (img_url, ebay_price, rarity) VALUES (?, ?, ?)', [
            newCard.img_url, 
            newCard.ebay_price,
            newCard.rarity
        ]);
        console.log(result);
        res.status(201).json({ newCard });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// 
// 
// 

// 
// METHODS FOR USERS
// 

// GET

app.get('/users', async(req, res) => {
    let conn;
    try{
        console.log('Connexion à la database');
        conn = await pool.getConnection();
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM users');
        console.log(rows);
        res.status(200).json(rows);
    }
    catch(err){
        console.log('Erreur');
    }
});

app.get('/users/:name', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE name = ?', [req.params.name]);
        console.log(rows);
        res.status(200).json(rows);
    }
    catch{
        console.log('Erreur');
    }
});
// POST

app.post('/users', async (req, res) => {
    const newUser = req.body;
    let conn;
    let hash = bcrypt.hashSync(newUser.mot_de_passe, 10);
    try{
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO users (name, password, email, type_user) VALUES (?, ?, ?, ?)', [
            newUser.username, 
            hash,
            newUser.email,
            newUser.type_utilisateur
        ]);
        console.log(result);
        res.status(201).json({ newUser });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/users/login', async (req, res) => {
    const user = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        console.log(user);
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM users WHERE name = ?', [user.username]);
        console.log('Résultat de la requête');
        console.log(rows);
        if(rows.length === 0){
            console.log('Utilisateur non trouvé');
            res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        else{
            console.log('Utilisateur trouvé')
            if(bcrypt.compareSync(user.mot_de_passe, rows[0].password)){
                console.log('Mot de passe correct');
                res.status(200).json({ message: 'Mot de passe correct' });
            }
            else{
                console.log('Mot de passe incorrect');
                res.status(401).json({ message: 'Mot de passe incorrect' });
            }
        }
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE

app.delete('/users/:id', async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        console.log(result);
        res.status(201).json({ message: 'Utilisateur supprimé' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 
// 
// 


app.listen(8000, () => {
    console.log('Server is running on Port: 8000');
});