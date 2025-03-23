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
    if (isset($_GET['id_avis']) && is_numeric($_GET['id_avis'])) {
        $id = (int) $_GET['id_avis'];

        $query = "SELECT * FROM avis WHERE id_avis = :id_avis";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_avis', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $avis = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($avis);
        } else {
            echo json_encode(["message" => "Avis non trouvé."]);
        }
    } else {
        $query = "SELECT * FROM avis";
        $stmt = $db->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $avis_array = [];
            $avis_array["avis"] = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $avis_item = [
                    "id_avis" => $row['id_avis'],
                    "evaluation" => $row['evaluation'],
                    "texte" => $row['texte'],
                    "date" => $row['date'],
                    "id_ecole" => $row['id_ecole'],
                    "id_candid" => $row['id_candid']
                ];
                array_push($avis_array["avis"], $avis_item);
            }
            echo json_encode($avis_array);
        } else {
            echo json_encode(["message" => "Aucun avis trouvé."]);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['evaluation']) && !empty($data['texte']) && !empty($data['id_ecole']) && !empty($data['id_candid'])) {
        $query = "INSERT INTO avis (evaluation, texte, id_ecole, id_candid) VALUES (:evaluation, :texte, :id_ecole, :id_candid)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":evaluation", $data['evaluation']);
        $stmt->bindParam(":texte", $data['texte']);
        $stmt->bindParam(":id_ecole", $data['id_ecole']);
        $stmt->bindParam(":id_candid", $data['id_candid']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Avis ajouté avec succès."]);
        } else {
            echo json_encode(["message" => "Impossible d'ajouter un avis."]);
        }
    } else {
        echo json_encode(["message" => "Données incomplètes."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (isset($_GET['id_avis']) && is_numeric($_GET['id_avis'])) {
        $id = (int) $_GET['id_avis'];
        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $db->prepare("UPDATE avis SET evaluation = ?, texte = ?, id_ecole = ?, id_candid = ? WHERE id_avis = ?");

        $stmt->execute([$data['evaluation'], $data['texte'], $data['id_ecole'], $data['id_candid'], $id]);
        echo json_encode(["reussi"]);
    } else {
        echo json_encode(["message" => "Données incomplètes."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Récupérer l'ID depuis $_GET
    $id = isset($_GET['id_avis']) ? intval($_GET['id_avis']) : 0;

    // Valider l'ID
    if ($id <= 0) {
        echo json_encode(["message" => "ID invalide."]);
        exit;
    }

    try {
        $query = "DELETE FROM avis WHERE id_avis = :id_avis";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_avis", $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(["message" => "Avis supprimé avec succès."]);
            } else {
                echo json_encode(["message" => "Avis non trouvé."]);
            }
        } else {
            error_log("Erreur lors de la suppression : " . print_r($stmt->errorInfo(), true));
            echo json_encode(["message" => "Impossible de supprimer l'avis."]);
        }
    } catch (PDOException $e) {
        error_log("Erreur de base de données : " . $e->getMessage());
        echo json_encode(["message" => "Erreur de base de données."]);
    }
}
?>