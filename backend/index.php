<?php
header("Content-Type: application/json; charset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty(trim($input["name"] ?? "")) || empty(trim($input["phone"] ?? ""))) {
    http_response_code(400);
    echo json_encode(["error" => "Заполните имя и телефон"]);
    exit;
}

$name = trim($input["name"]);
$phone = trim($input["phone"]);

$config = parse_ini_file(__DIR__ . "/config.ini", true);
$db = @new mysqli($config["database"]["host"], $config["database"]["user"], $config["database"]["password"]);

if ($db->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка подключения к БД"]);
    exit;
}

$db->query("CREATE DATABASE IF NOT EXISTS `{$config["database"]["dbname"]}`");
$db->select_db($config["database"]["dbname"]);
$db->set_charset("utf8mb4");

$db->query("CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$stmt = $db->prepare("SELECT id FROM requests WHERE name = ? AND phone = ? LIMIT 1");
$stmt->bind_param("ss", $name, $phone);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Заявка с таким именем и телефоном уже была отправлена"]);
    $stmt->close();
    $db->close();
    exit;
}

$stmt->close();

$stmt = $db->prepare("INSERT INTO requests (name, phone) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $phone);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка сервера. Попробуйте позже."]);
}

$stmt->close();
$db->close();
