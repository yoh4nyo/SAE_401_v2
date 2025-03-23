<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();

$candidatId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($candidatId <= 0) {
    echo json_encode(['error' => 'ID de candidat invalide.']);
    exit;
}

$dateSemaine = date('Y-m-d', strtotime('-7 days'));
$dateMois = date('Y-m-d', strtotime('-30 days'));

function getStatsPourPeriode($conn, $candidatId, $dateDebut = null) {
    $periodeClause = "";
    if ($dateDebut) {
        $periodeClause = " AND date >= :dateDebut";
    }
    $stmt = $conn->prepare("SELECT AVG(score) AS moyenne_entrainements FROM exam WHERE id_candid = :id AND type = 'Entrainement'" . $periodeClause);
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultat_entrainements = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT AVG(score) AS moyenne_examens FROM exam WHERE id_candid = :id AND type = 'Exam Blanc'" . $periodeClause);
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultat_examens = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT MAX(score) AS meilleure_note FROM exam WHERE id_candid = :id" . $periodeClause);
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultat_meilleure_note = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT COUNT(*) AS nombre_entrainements FROM exam WHERE id_candid = :id AND type = 'Entrainement'" . $periodeClause);
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultat_nombre_entrainements = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT COUNT(*) AS nombre_examens FROM exam WHERE id_candid = :id AND type = 'Exam Blanc'" . $periodeClause);
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultat_nombre_examens = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT date, score FROM exam WHERE id_candid = :id AND type = 'Entrainement'" . $periodeClause . " ORDER BY date");
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultats_entrainements_graphique = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT date, score FROM exam WHERE id_candid = :id AND type = 'Exam Blanc'" . $periodeClause . " ORDER BY date");
    $stmt->bindParam(':id', $candidatId, PDO::PARAM_INT);
    if ($dateDebut) {
        $stmt->bindParam(':dateDebut', $dateDebut, PDO::PARAM_STR);
    }
    $stmt->execute();
    $resultats_examens_graphique = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $stats = [
        'moyenne_entrainements' => floatval($resultat_entrainements['moyenne_entrainements'] ?? 0),
        'moyenne_examens' => floatval($resultat_examens['moyenne_examens'] ?? 0),
        'meilleure_note' => floatval($resultat_meilleure_note['meilleure_note'] ?? 0),
        'nombre_entrainements' => intval($resultat_nombre_entrainements['nombre_entrainements'] ?? 0),
        'nombre_examens' => intval($resultat_nombre_examens['nombre_examens'] ?? 0),
        'entrainements' => $resultats_entrainements_graphique,
        'examens' => $resultats_examens_graphique
    ];

    return $stats;
}

$statsSemaine = getStatsPourPeriode($conn, $candidatId, $dateSemaine);
$statsMois = getStatsPourPeriode($conn, $candidatId, $dateMois);
$statsTotal = getStatsPourPeriode($conn, $candidatId);

$resultats = [
    'semaine' => $statsSemaine,
    'mois' => $statsMois,
    'total' => $statsTotal
];

echo json_encode($resultats);
?>