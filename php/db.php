<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); 

function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        die(json_encode(["error" => ".env file not found at $filePath"]));
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

$homeDirectory = getenv("HOME");
loadEnv($homeDirectory . '/.env');

$servername = $_ENV['CMSC408_HOST'];
$username = $_ENV['CMSC408_USER'];
$password = $_ENV['CMSC408_PASSWORD'];
$dbname = $_ENV['DEL12_DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

?>
