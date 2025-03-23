<?php

header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json"); 

session_start();

session_unset();
session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Déconnexion réussie"
]);

exit;
?>
