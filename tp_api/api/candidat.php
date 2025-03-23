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
        if (isset($_GET['id_candid']) && is_numeric($_GET['id_candid'])) {
            $id = (int) $_GET['id_candid']; 

            $query = "SELECT * FROM candidat WHERE id_candid = :id_candid";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_candid', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $candidat = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($candidat);
            } else {
                echo json_encode(["message" => "Candidat non trouvé."]);
            }
        } else {
            $query = "SELECT * FROM candidat";
            $stmt = $db->prepare($query);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $candidat_array = [];
                $candidat_array["candidat"] = [];
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $candidat_item = [
                        "id_candid" => $row['id_candid'],
                        "password" => $row['password'],
                        "nom" => $row['nom'],
                        "prenom" => $row['prenom'],
                        "phone" => $row['phone'],
                        "email" => $row['email'],
                        "adresse" => $row['adresse'],
                        "date_naissance" => $row['date_naissance'],
                        "date_inscription" => $row['date_inscription'],
                        "neph" => $row['neph'],
                        "echecetg" => $row['echecetg'],
                        "etg" => $row['etg'],
                        "id_ecole" => $row['id_ecole'],
                    ];
                    array_push($candidat_array["candidat"], $candidat_item);
                }
                echo json_encode($candidat_array);
            } else {
                echo json_encode(["message" => "Aucun candidat trouvé."]);
            }
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!empty($data['password']) && !empty($data['nom']) && !empty($data['prenom']) && !empty($data['phone']) && !empty($data['email']) && !empty($data['adresse']) && !empty($data['date_naissance']) && !empty($data['id_ecole'])) {
            
            $query = "INSERT INTO candidat (password, nom, prenom, phone, email, adresse, date_naissance, id_ecole) VALUES (:password, :nom, :prenom, :phone, :email, :adresse, :date_naissance, :id_ecole)";
            $stmt = $db->prepare($query);
    
            $stmt->bindParam(":password", $data['password']);
            $stmt->bindParam(":nom", $data['nom']);
            $stmt->bindParam(":prenom", $data['prenom']);
            $stmt->bindParam(":phone", $data['phone']);
            $stmt->bindParam(":email", $data['email']);
            $stmt->bindParam(":adresse", $data['adresse']);
            $stmt->bindParam(":date_naissance", $data['date_naissance']);
            $stmt->bindParam(":id_ecole", $data['id_ecole']);
    
            if ($stmt->execute()) {
                echo json_encode(["message" => "Candidat ajouté avec succès."]);
            } else {
                echo json_encode(["message" => "Impossible d’ajouter le candidat."]);
            }
        } else {
            echo json_encode(["message" => "Données incomplètes."]);
        }
    }


    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        if (isset($_GET['id_candid']) && is_numeric($_GET['id_candid'])) {
            $id = (int) $_GET['id_candid'];
            $data = json_decode(file_get_contents("php://input"), true);
            
            $stmt = $db->prepare("UPDATE candidat SET password = ?, nom = ?, prenom = ?, phone = ?, email = ?, adresse = ?, date_naissance = ?, id_ecole = ? WHERE id_candid = ?");

            $stmt->execute([$data['password'], $data['nom'], $data['prenom'], $data['phone'], $data['email'], $data['adresse'], $data['date_naissance'], $data['id_ecole'], $id]);
            echo json_encode(["message" => "Mise à jour réussie"]);
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
            $query = "DELETE FROM candidat WHERE id_candid IN ($placeholders)";
            $stmt = $db->prepare($query);
 
            if ($stmt->execute($ids)) {
                error_log("Candidats supprimés avec succès."); 
                echo json_encode(["message" => "Candidats supprimés avec succès."]);
            } else {
                error_log("Erreur lors de la suppression : " . print_r($stmt->errorInfo(), true));
                echo json_encode(["message" => "Impossible de supprimer les candidats."]);
            }
        } else {
            echo json_encode(["message" => "Données invalides. Les IDs doivent être fournis dans un tableau."]);
        }
    }
    
?>