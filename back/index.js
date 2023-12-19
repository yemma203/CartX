app.get('/cards', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Obtenir le paramètre de tri de la chaîne de requête
        const sortParam = req.query.sort;

        let query;
        switch (sortParam) {
            case 'rarity':
                // Tri par rareté dans un ordre spécifique
                query = `
                    SELECT * FROM cards 
                    ORDER BY 
                        CASE rarity
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
                // Tri par prix avec les prix inconnus à la fin
                query = `
                    SELECT * FROM cards 
                    ORDER BY 
                        CASE 
                            WHEN ebay_price = 0.0 THEN 1
                            ELSE 0
                        END,
                        ebay_price
                `;
                break;
            default:
                query = 'SELECT * FROM cards';
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
