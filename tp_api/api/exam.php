<?php
header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id_exam']) && is_numeric($_GET['id_exam'])) {
        $id = (int) $_GET['id_exam'];

        $query = "SELECT * FROM Exam WHERE id_exam = :id_exam";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_exam', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $exam = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($exam);
        } else {
            echo json_encode(["message" => "Examen non trouvé."]);
        }
    } else {
        $query = "SELECT * FROM Exam";
        $stmt = $db->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $exam_array = [];
            $exam_array["exam"] = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exam_item = [
                    "id_exam" => $row['id_exam'],
                    "type" => $row['type'],
                    "id_ecole" => $row['id_ecole'],
                    "id_candid" => $row['id_candid'],
                    "score" => $row['score'],
                    "appreciation" => $row['appreciation'],
                    "date" => $row['date']
                ];
                array_push($exam_array["exam"], $exam_item);
            }
            echo json_encode($exam_array);
        } else {
            echo json_encode(["message" => "Aucun examen trouvé."]);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['type']) && !empty($data['id_ecole']) && !empty($data['id_candid']) && !empty($data['score']) && !empty($data['appreciation']) && !empty($data['date'])) {
        $query = "INSERT INTO Exam (type, id_ecole, id_candid, score, appreciation, date) VALUES (:type, :id_ecole, :id_candid, :score, :appreciation, :date)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":type", $data['type']);
        $stmt->bindParam(":id_ecole", $data['id_ecole']);
        $stmt->bindParam(":id_candid", $data['id_candid']);
        $stmt->bindParam(":score", $data['score']);
        $stmt->bindParam(":appreciation", $data['appreciation']);
        $stmt->bindParam(":date", $data['date']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Examen ajouté avec succès."]);
        } else {
            echo json_encode(["message" => "Impossible d’ajouter l'examen."]);
        }
    } else {
        echo json_encode(["message" => "Données incomplètes."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (isset($_GET['id_exam']) && is_numeric($_GET['id_exam'])) {
        $id = (int) $_GET['id_exam'];
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['type']) && !empty($data['id_ecole']) && !empty($data['id_candid']) && !empty($data['score']) && !empty($data['appreciation']) && !empty($data['date'])) {
            $query = "UPDATE Exam SET type = :type, id_ecole = :id_ecole, id_candid = :id_candid, score = :score, appreciation = :appreciation, date = :date WHERE id_exam = :id_exam";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":type", $data['type']);
            $stmt->bindParam(":id_ecole", $data['id_ecole']);
            $stmt->bindParam(":id_candid", $data['id_candid']);
            $stmt->bindParam(":score", $data['score']);
            $stmt->bindParam(":appreciation", $data['appreciation']);
            $stmt->bindParam(":date", $data['date']);
            $stmt->bindParam(":id_exam", $id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Examen mis à jour avec succès."]);
            } else {
                echo json_encode(["message" => "Impossible de mettre à jour l'examen."]);
            }
        } else {
            echo json_encode(["message" => "Données incomplètes."]);
        }
    } else {
        echo json_encode(["message" => "ID invalide."]);
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
        $query = "DELETE FROM exam WHERE id_exam IN ($placeholders)";
        $stmt = $db->prepare($query);

        if ($stmt->execute($ids)) {
            error_log("exams supprimés avec succès."); 
            echo json_encode(["message" => "exams supprimés avec succès."]);
        } else {
            error_log("Erreur lors de la suppression : " . print_r($stmt->errorInfo(), true));
            echo json_encode(["message" => "Impossible de supprimer les exams."]);
        }
    } else {
        echo json_encode(["message" => "Données invalides. Les IDs doivent être fournis dans un tableau."]);
    }
}
?>