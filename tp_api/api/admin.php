<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();


if ($_SERVER['REQUEST_METHOD'] === 'GET')  {
    $query = "SELECT * FROM admin";
    $stmt = $db->prepare($query);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $admin_array = [];
        $admin_array["admin"] = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $admin_item = [
                "email" => $row['email'],
                "password" => $row['password']
            ];
            array_push($admin_array["admin"], $admin_item);
        }
        echo json_encode($admin_array);
    } else {
        echo json_encode(["message" => "Aucun admin trouvé."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['email'] )) {
        $query = "INSERT INTO admin (email, password) VALUES (:email, :password)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":email", $data['email']);
        $stmt->bindParam(":password", $data['password']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "admin ajouté avec succès."]);
        } else {
            echo json_encode(["message" => "Impossible d’ajouter un admin."]);
        }
    } else {
        echo json_encode(["message" => "Données incomplètes."]);
    }
}


