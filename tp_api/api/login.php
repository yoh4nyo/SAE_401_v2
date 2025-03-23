<?php
header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


session_start();
require_once '../config/database.php';
$database = new Database();
$pdo = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email et mot de passe requis."]);
    exit;
}

$email = $data['email'];
$password = $data['password'];

$stmt = $pdo->prepare("SELECT id_admin AS id, email, password, 'admin' AS role FROM admin WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    $stmt = $pdo->prepare("SELECT id_candid AS id, email, password, 'candidat' AS role FROM candidat WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}
if (!$user) {
    http_response_code(401); 
    echo json_encode(["success" => false, "message" => "Identifiants incorrects."]);
    exit;
}

if (!password_verify($password, $user['password'])) {
    http_response_code(401); 
    echo json_encode(["success" => false, "message" => "Identifiants incorrects."]);
    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];

echo json_encode([
    "success" => true,
    "message" => "Connexion réussie",
    "user" => [
        "id" => $user['id'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
]);

exit;
?>
