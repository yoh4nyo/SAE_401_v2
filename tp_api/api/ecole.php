<?php
header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id_ecole']) && is_numeric($_GET['id_ecole'])) {
        $id = (int) $_GET['id_ecole']; 

        $query = "SELECT * FROM ecole WHERE id_ecole = :id_ecole";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_ecole', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $ecole = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($ecole);
        } else {
            echo json_encode(["message" => "Ecole non trouvée."]);
        }
    } else {
        $query = "SELECT * FROM ecole";
        $stmt = $db->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $ecole_array = [];
            $ecole_array["ecole"] = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $ecole_item = [
                    "id_ecole" => $row['id_ecole'],
                    "nom" => $row['nom'],
                    "adresse" => $row['adresse'],
                    "email" => $row['email'],
                    "date_ajout" => $row['date_ajout'],
                    "phone" => $row['phone']
                ];
                array_push($ecole_array["ecole"], $ecole_item);
            }
            echo json_encode($ecole_array);
        } else {
            echo json_encode(["message" => "Aucune école trouvée."]);
        }
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['nom'] && !empty($data['adresse'] && !empty($data['email'] && !empty($data['phone']))))) {
        $query = "INSERT INTO ecole (nom, adresse, email, phone) VALUES (:nom, :adresse, :email, :phone)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":nom", $data['nom']);
        $stmt->bindParam(":adresse", $data['adresse']);
        $stmt->bindParam(":email", $data['email']);
        $stmt->bindParam(":phone", $data['phone']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "avis ajouté avec succès."]);
        } else {
            echo json_encode(["message" => "Impossible d’ajouter l'avis."]);
        }
    } else {
        echo json_encode(["message" => "Données incomplètes."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (isset($_GET['id_ecole']) && is_numeric($_GET['id_ecole'])) {
        $id = (int) $_GET['id_ecole'];
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $db->prepare("UPDATE ecole SET nom = ?, adresse = ?, email = ?, phone = ? WHERE id_ecole = ?");

        $stmt->execute([$data['nom'], $data['adresse'], $data['email'], $data['phone'], $id]);
        echo json_encode(["reussi"]);
    } else {
    echo json_encode(["message" => "Données incomplètes."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['ids']) && is_array($input['ids'])) {
        $ids = array_map('intval', $input['ids']);
        $ids = array_filter($ids, function($id) { return $id > 0; });

        error_log("IDs à supprimer : " . print_r($ids, true));

        if (empty($ids)) {
            echo json_encode(["message" => "Aucun ID valide fourni."]);
            return;
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query = "DELETE FROM ecole WHERE id_ecole IN ($placeholders)";
        $stmt = $db->prepare($query);

        if ($stmt->execute($ids)) {
            error_log("ecoles supprimés avec succès."); 
            echo json_encode(["message" => "ecoles supprimés avec succès."]);
        } else {
            error_log("Erreur lors de la suppression : " . print_r($stmt->errorInfo(), true));
            echo json_encode(["message" => "Impossible de supprimer les ecoles."]);
        }
    } else {
        echo json_encode(["message" => "Données invalides. Les IDs doivent être fournis dans un tableau."]);
    }
}