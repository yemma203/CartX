<?php

// Fichier qui recupere les 300 premieres cartes de l'API et les insere dans la database

require_once("./config.php");

try {
    $host = DB_HOST;
    $port = DB_PORT;
    $user = DB_USER;
    $pwd = DB_PWD;
    $db_name = "yugioh_cards";

    $connexion = new PDO("mysql:host=$host;port=$port;dbname=$db_name", $user, $pwd);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    echo "Erreur lors de la connexion à la database : " . $e->getMessage();
    die();
}

// On recupere les 300 premieres cartes de l'API
$cards = file_get_contents("https://db.ygoprodeck.com/api/v7/cardinfo.php");
$cards = json_decode($cards, true);

if (isset($cards['data']) && is_array($cards['data'])) {
    // Extraire les 300 premières cartes
    $first300Cards = array_slice($cards['data'], 0, 300);
}
else{
    echo "Erreur lors de la recuperation des cartes";
    die();

}

// On insere les 300 cartes dans la database

function addCard($img_url, $type, $rarity, $ebay_price, $cardmarket_price, $tgcplayer_price, $amazon_price, $connexion){
    $sql = "INSERT INTO cards (img_url, type, rarity, ebay_price, cardmarket_price, tcgplayer_price, amazon_price) VALUES (
        :img_url, :type, :rarity, :ebay_price, :cardmarket_price, :tcgplayer_price, :amazon_price
    )";
    $stmt = $connexion->prepare($sql);
    $stmt->bindParam(':img_url', $img_url);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':rarity', $rarity);
    $stmt->bindParam(':ebay_price', $ebay_price);
    $stmt->bindParam(':cardmarket_price', $cardmarket_price);
    $stmt->bindParam(':tcgplayer_price', $tgcplayer_price);
    $stmt->bindParam(':amazon_price', $amazon_price);
    $stmt->execute();

}

for ($i=0; $i < 300; $i++) { 
    if(isset($first300Cards[$i]['card_sets'][0]['set_rarity'])){
        $rarity = $first300Cards[$i]['card_sets'][0]['set_rarity'];
    }
    else{
        $rarity = "N/A";
    }
    $img_url = $first300Cards[$i]['card_images'][0]['image_url'];
    $type = $first300Cards[$i]['type'];
    $ebay_price = $first300Cards[$i]['card_prices'][0]['ebay_price'];
    $cardmarket_price = $first300Cards[$i]['card_prices'][0]['cardmarket_price'];
    $tgcplayer_price = $first300Cards[$i]['card_prices'][0]['tcgplayer_price'];
    $amazon_price = $first300Cards[$i]['card_prices'][0]['amazon_price'];

    addCard($img_url, $type, $rarity, $ebay_price, $cardmarket_price, $tgcplayer_price, $amazon_price, $connexion);
}

?>