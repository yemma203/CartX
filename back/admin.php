<?php

require_once("./config.php");

try {
    // Database connection parameters
    $host = DB_HOST;
    $user = DB_USER;
    $pwd = DB_PWD;
    $db_name = DB_NAME;

    // Create a new PDO instance for database connection
    $connexion = new PDO("mysql:host=$host;dbname=$db_name", $user, $pwd);
    // Set PDO attributes for error handling
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    // Handle any errors that occur during database connection
    echo "Erreur lors de la connexion à la base de données : " . $e->getMessage();
    die();
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="admin.css"> <!-- Inclusion du fichier CSS -->
    <title>Votre titre</title>
    <script>
        function closeForm() {
            document.querySelector('.modification-form').style.display = 'none';
        }
    </script>
</head>

<body>
    <div class='block'>
        <?php
        $requete = "SELECT * FROM users";
        $resultat = $connexion->query($requete);
        while ($row = $resultat->fetch(PDO::FETCH_ASSOC)) {

            echo "<div class='global'>";
            echo "<p>" . htmlspecialchars($row['name']) . "</p>";

            // Bouton de modification
            echo "<div class ='nom'>";
            echo "<form method='post' action='admin.php'>";
            echo "<button type='submit' name='modification' value='" . htmlspecialchars($row['name']) . "'>Modifier</button>";
            echo "</form>";
            echo "</div>";
            // Boutton de suppression
            echo "<div class='role'>";
            echo "<form method='post' action='admin.php'>";
            echo "<input type='hidden' name='oldName' value='" . htmlspecialchars($row['name']) . "'>";
            echo "<button type='submit' name='supprimer' onclick='return confirm(\"Voulez-vous vraiment supprimer cet utilisateur ?\")'>Supprimer</button>";
            echo "</form>";
            echo "</div>";

            echo "</div>";

        }
        ?>
    </div>

    <div class=modification>
        <?php
        $valeur = true;
        // Traitement du formulaire de modification
        // Vérifie si le bouton "Modifier" est soumis
        if (isset($_POST["modification"]) && $valeur == true) {
            $selectedName = $_POST["modification"];
            // Affiche le formulaire de modification
            echo "<div class='modification-form-container'>";
            echo "<div class='modification-form'>";
            echo "<form method='post' action='admin.php'>";
            echo "<label for='name'>Nouveau nom :</label>";
            echo "<input type='text' name='name' id='name' required>";
            echo "<input type='hidden' name='oldName' value='" . htmlspecialchars($selectedName) . "'>";
            echo "<input type='submit' name='ValiderNom' value='ValiderNom'>";
            echo "</form>";

            echo "<br>";

            // Modification du rôle
            echo "<form method='post' action='admin.php'>";
            echo "<label for='role'>Nouveau rôle :</label>";
            echo "<input type='text' name='role' id='role' required>";
            echo "<input type='hidden' name='oldName' value='" . htmlspecialchars($selectedName) . "'>";
            echo "<input type='submit' name='ValiderRole' value='ValiderRole'>";
            echo "<button type='button' name='fermer' onclick='closeForm()'>Fermer</button>";
            echo "</form>";
            echo "</div>";
            echo "</div>";
            $valeur = false;
        }


        if (isset($_POST["ValiderNom"]) && isset($_POST["name"]) && isset($_POST["oldName"])) {
            echo $_POST["name"];
            echo $_POST["oldName"];

            if ($_POST["name"] != "") {
                $nouveauNom = $_POST["name"];
                $oldName = $_POST["oldName"];

                try {
                    $requeteUpdate = "UPDATE users SET name = :nouveauNom WHERE name = :oldName";
                    $stmt = $connexion->prepare($requeteUpdate);
                    $stmt->bindParam(':nouveauNom', $nouveauNom, PDO::PARAM_STR);
                    $stmt->bindParam(':oldName', $oldName, PDO::PARAM_STR);
                    $stmt->execute();
                    header("Location: {$_SERVER['PHP_SELF']}");
                    exit();
                } catch (Exception $e) {
                    echo "Erreur lors de la modification" . $e->getMessage();
                }
            } else {
                echo "Remplissez avant de valider";
            }
        }
        if (isset($_POST["ValiderRole"]) && isset($_POST["role"]) && isset($_POST["oldName"])) {
            if ($_POST["role"] != "") {
                try {
                    $nouveauRole = $_POST["role"];
                    $oldName = $_POST["oldName"];
                    $requeteUpdate = "UPDATE users SET type_user = :nouveauRole WHERE name = :oldName";
                    $stmt = $connexion->prepare($requeteUpdate);
                    $stmt->bindParam(":nouveauRole", $nouveauRole);
                    $stmt->bindParam(':oldName', $oldName, PDO::PARAM_STR);
                    $stmt->execute();
                    header("Location: {$_SERVER['PHP_SELF']}");
                    exit();
                } catch (Exception $e) {
                    echo "Erreur lors de la modification" . $e->getMessage();
                }
            } else {
                echo "Remplissez avant de valider";
            }
        }
        if (isset($_POST["supprimer"])) {
            try {
                $NameToDelete = $_POST["oldName"];
                $requeteDelete = "DELETE FROM users WHERE name = :nameToDelete";
                $stmt = $connexion->prepare($requeteDelete);
                $stmt->bindParam(":nameToDelete", $NameToDelete);
                $stmt->execute();
                header("Location: {$_SERVER['PHP_SELF']}");
                exit();
            } catch (Exception $e) {
                echo "Erreur lors de la suppression : " . $e->getMessage();
            }
        }
        ?>
    </div>
</body>

</html>