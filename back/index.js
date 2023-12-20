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

app.get('/cards', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Obtenir le paramètre de tri de la chaîne de requête
        const sortParam = req.query.sort;

        let query;
        switch (sortParam) {
            case 'rarity':
                // Tri par rareté dans un ordre spécifique avec jointure sur user_cards
                query = `
                    SELECT c.*, uc.user_id FROM cards c
                    LEFT JOIN user_cards uc ON c.card_id = uc.card_id
                    ORDER BY 
                        CASE c.rarity
                            WHEN 'Common' THEN 1
                            WHEN 'Rare' THEN 2
                            WHEN 'Super Rare' THEN 3
                            WHEN 'Ultra Rare' THEN 4
                            WHEN 'Ultimate Rare' THEN 5
                            WHEN 'Secret Rare' THEN 6
                            WHEN 'Extra Secret Rare' THEN 7
                            WHEN "Collector's Rare" THEN 8
                            WHEN 'Gold Rare' THEN 9
                            WHEN 'Gold Secret Rare' THEN 10
                            WHEN 'Mosaic Rare' THEN 11
                            WHEN 'Quarter Century Secret Rare' THEN 12
                            WHEN 'Prismatic Secret Rare' THEN 13
                            WHEN 'Short Print' THEN 14
                            WHEN 'Duel Terminal Rare Parallel Rare' THEN 15
                            WHEN 'Duel Terminal Normal Parallel Rare' THEN 16
                            WHEN 'Duel Terminal Ultra Parallel Rare' THEN 17
                            WHEN 'Duel Terminal Super Parallel Rare' THEN 18
                            WHEN 'N/A' THEN 19
                            ELSE 20
                        END
                `;
                break;
            case 'price':
                // Tri par prix avec les prix inconnus à la fin avec jointure sur user_cards
                query = `
                    SELECT c.*, uc.user_id FROM cards c
                    LEFT JOIN user_cards uc ON c.card_id = uc.card_id
                    ORDER BY 
                        CASE 
                            WHEN c.ebay_price = 0.0 THEN 1
                            ELSE 0
                        END,
                        c.ebay_price
                `;
                break;
            default:
                // Requête par défaut avec jointure sur user_cards
                query = 'SELECT c.*, uc.user_id FROM cards c LEFT JOIN user_cards uc ON c.card_id = uc.card_id';
        }

        const rows = await conn.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur côté serveur:", err.message);
        res.status(500).json({ error: 'Erreur côté serveur' });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

// Methode pour récuperer l'id de la derniere carte ajoutée

app.get('/cards/last', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT card_id FROM cards ORDER BY card_id DESC LIMIT 1');
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur côté serveur:", err.message);
        res.status(500).json({ error: 'Erreur côté serveur' });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

// Methode pour savoir si une carte est dans la collection d'un utilisateur

app.get('/cards/:id/:user_id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM user_cards WHERE card_id = ? AND user_id = ?', [req.params.id, req.params.user_id]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Carte non trouvée' });
        } else {
            res.status(200).json({ message: 'Carte trouvée' });
        }
    } catch (err) {
        console.error("Erreur côté serveur:", err.message);
        res.status(500).json({ error: 'Erreur côté serveur' });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});


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

app.post('/manualCards', async (req, res) => {
    const newCard = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO cards (name, rarity, description, type, global_price) VALUES (?, ?, ?, ?, ?)', [
            newCard.name, 
            newCard.rarity,
            newCard.description,
            newCard.type,
            newCard.global_price
        ]);
        console.log(result);
        res.status(201).json({ newCard });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/users_cards', async (req, res) => {
    console.log(req.body);
    let conn;
    try {
        conn = await pool.getConnection();
        // On récupère l'id de la dernière carte ajoutée
        const rows = await conn.query('SELECT card_id FROM cards ORDER BY card_id DESC LIMIT 1');
        const lastCardId = rows[0].card_id;

        // On récupère l'id de l'utilisateur
        const userId = req.body.user_id;

        // On ajoute la carte à la table users_cards
        const result = await conn.query('INSERT INTO user_cards (user_id, card_id) VALUES (?, ?)', [
            userId,
            lastCardId
        ]);
        console.log(result);
        res.status(201).json({ message: 'Carte ajoutée à la collection' });
    } catch (err) {
        console.error("Erreur côté serveur:", err.message);
        res.status(500).json({ error: 'Erreur côté serveur' });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

// PUT

app.put('/cardsWithImg/:id', async (req, res) => {
    const card = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        // Je veux set les champs : type, rarity, ebay_price, cardmarket_price, tcgplayer_price, amazon_price
        const result = await conn.query('UPDATE cards SET type = ?, rarity = ?, ebay_price = ?, cardmarket_price = ?, tcgplayer_price = ?, amazon_price = ? WHERE card_id = ?', [
            card.type,
            card.rarity,
            card.ebay_price,
            card.cardmarket_price,
            card.tcgplayer_price,
            card.amazon_price,
            req.params.id
        ]);
        console.log(result);
        res.status(201).json({ message: 'Carte modifiée' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.put('/cardsWithoutImg/:id', async (req, res) => {
    const card = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        // Je veux set les champs : name, type, rarity, global_price
        const result = await conn.query('UPDATE cards SET name = ?, type = ?, rarity = ?, global_price = ? WHERE card_id = ?', [
            card.card_name,
            card.type,
            card.rarity,
            card.global_price,
            req.params.id
        ]);
        console.log(result);
        res.status(201).json({ message: 'Carte modifiée' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE

app.delete('/cards/:id', async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM cards WHERE card_id = ?', [req.params.id]);
        console.log(result);
        res.status(201).json({ message: 'Carte supprimée' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
);

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


app.get('/users/:name' , async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE name = ?', [req.params.name]);
        
        if (rows.length === 0) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        } else {
            const user = rows[0];
            res.status(200).json(user); // Retourne directement l'objet utilisateur
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
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