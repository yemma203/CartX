<?php

try {
    $user = DB_USER;
    $pass = DB_PWD;
    $dbName = DB_NAME;
    $dbHost = DB_HOST;

    // Création d'une instance de PDO pour la connexion à la BDD
    $connexion = new PDO("mysql:host=$dbHost;dbname=$dbName", $user, $pass);

    // Configuration de PDO pour générer des exceptions en cas d'erreur
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En cas d'erreur de connexion, affiche un message d'erreur et arrête le script
    echo "Erreur de connexion à la base de données: " . $e->getMessage();
    die();
}

Class Utilsateur {
    public $name;
    public $password;
    public function __construct($name, $password) {
        $this->name = $name;
        $this->password = $password;
    }

    public function getName() {
        return $this->name;
    }
    public function getPassword() {
        return $this->password;
    }
}

Class UtilisateurDAO {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }
    public function inscription($username, $password, $type_user) {
        try {
            $stmt = $this->db->prepare("SELECT name FROM yugioh_cards");
            $stmt->execute([$username]);
            $users = $stmt->fetch(PDO::FETCH_ASSOC);
            if(in_array($username, $users)){
                echo "Utilisateur existe déja";
            }else{
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $requete = $this->db->prepare("INSERT INTO yugioh_cards(name,password) VALUES(?, ?)");
                $requete->execute([$username, $hashedPassword]);
                if($type_user == "joueur")
                {
                    $requete = $this->db->query("INSERT INTO yugioh_cards(type_user) VALUES(1)");
                }elseif($type_user == "createur"){
                    $requete = $this->db->query("INSERT INTO yugioh_cards(type_user) VALUES(2)");
                }
            }
        }catch (PDOException $e) {
            echo "Erreur lors de l'ajout". $e->getMessage();
        }
    }
    public function connexion($username, $password) {
        try {
            $requete = $this->db->prepare("SELECT password FROM yugioh_cards WHERE nom = ?");
            $requete->execute([$username]);
            $result = $requete->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $result["password"]))
            {
                return true;
            }else{
                return false;
            }   
        }catch (PDOException $e) {
            echo "Erreur lors de la vérification". $e->getMessage();
        }
    }
}
$utilisateurDAO = new UtilisateurDAO($connexion);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Si c'est une requête POST, traiter l'inscription ou la connexion
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['action'])) {
        if ($data['action'] === 'inscription') {
            // Appeler la fonction d'inscription
            $utilisateurDAO->inscription($data['username'], $data['password'], $data['type_user']);
        } elseif ($data['action'] === 'connexion') {
            // Appeler la fonction de connexion
            $connexionSuccess = $utilisateurDAO->connexion($data['username'], $data['password']);
            
            // Retourner une réponse JSON
            echo json_encode(['success' => $connexionSuccess]);
        }
    }
}

?>