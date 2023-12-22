<?php

require_once './src/admin.php';

use PHPUnit\Framework\TestCase;

class AdminTest extends TestCase
{
    protected $db;

    public function setUp(): void
    {
        // Modifier les détails de connexion à la base de données si nécessaire
        $this->db = new PDO("mysql:host=localhost;dbname=yugioh_cards", 'user_cardsX', 'azerty');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function testDatabaseConnection()
    {
        $this->assertInstanceOf(PDO::class, $this->db);
    }

    public function testModificationFormVisibility()
    {
        // Simuler la soumission du formulaire
        $_POST["modification"] = "some_user";
        ob_start();
        include '../../adminTest.php';
        $output = ob_get_clean();

        // Vérifier que le formulaire de modification est visible
        $this->assertStringContainsString('<div class=\'modification-form\'>', $output);

        // Vérifier que le formulaire contient les champs nécessaires
        $this->assertStringContainsString('<input type=\'text\' name=\'name\' id=\'name\' required>', $output);
        $this->assertStringContainsString('<button type=\'submit\' name=\'ValiderNom\' value=\'ValiderNom\'>', $output);
    }

    public function testModificationName()
    {
        // Simuler la soumission du formulaire de modification du nom
        $_POST["ValiderNom"] = "ValiderNom";
        $_POST["name"] = "new_name";
        $_POST["oldName"] = "old_name";

        // Vérifier que l'utilisateur existe avant la modification
        $stmt = $this->db->prepare("SELECT * FROM users WHERE name = :name");
        $stmt->bindParam(':name', $_POST["oldName"], PDO::PARAM_STR);
        $stmt->execute();
        $oldUser = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertNotEmpty($oldUser);

        // Exécuter le code avec le test
        ob_start();
        include '../../admin.php';
        ob_get_clean();

        // Vérifier que l'ancien nom d'utilisateur n'existe plus
        $stmt->execute();
        $this->assertEmpty($stmt->fetch(PDO::FETCH_ASSOC));

        // Vérifier que le nouveau nom d'utilisateur existe
        $stmt = $this->db->prepare("SELECT * FROM users WHERE name = :name");
        $stmt->bindParam(':name', $_POST["name"], PDO::PARAM_STR);
        $stmt->execute();
        $newUser = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->assertNotEmpty($newUser);

        // Vérifier que les autres données de l'utilisateur n'ont pas changé
        unset($oldUser['name']);
        unset($newUser['name']);
        $this->assertEquals($oldUser, $newUser);
    }

    public function testUserDataTypes()
    {
        // Simuler une requête qui récupère des données d'utilisateur
        $stmt = $this->db->prepare("SELECT * FROM users");
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérifier les types de données attendus
        $this->assertIsArray($userData);
        $this->assertArrayHasKey('name', $userData);
        $this->assertIsString($userData['name']);
        $this->assertArrayHasKey('role', $userData);
        $this->assertIsString($userData['role']);
        // Ajouter d'autres assertions selon les types attendus
    }

    // Test pour vérifier la suppression d'un utilisateur
    public function testUserDeletion()
    {
        // Simuler la soumission du formulaire de suppression
        $_POST["supprimer"] = "Supprimer";
        $_POST["oldName"] = "user_to_delete";

        // Vérifier que l'utilisateur existe avant la suppression
        $stmt = $this->db->prepare("SELECT * FROM users WHERE name = :name");
        $stmt->bindParam(':name', $_POST["oldName"], PDO::PARAM_STR);
        $stmt->execute();
        $this->assertNotEmpty($stmt->fetch(PDO::FETCH_ASSOC));

        // Exécuter le code avec le test
        ob_start();
        include '../../admin.php';
        ob_get_clean();

        // Vérifier que l'utilisateur a été supprimé
        $stmt->execute();
        $this->assertEmpty($stmt->fetch(PDO::FETCH_ASSOC));
    }
    
}
