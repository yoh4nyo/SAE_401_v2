<?php
class Database {
    private $host = "localhost";
    private $db_name = "easy_drive";
    private $username = "root";
    private $password = "";
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false, 
            ]);
        } catch (PDOException $exception) {
            error_log("Erreur de connexion à la base de données : " . $exception->getMessage());
            echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);
            exit;
        }
        return $this->conn;
    }
}
