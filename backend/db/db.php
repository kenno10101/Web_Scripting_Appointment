<?php
//https://e151712-phpmyadmin.services.easyname.eu/?pma_username=u236464db1
$servername = "e151712-mysql.services.easyname.eu";
$username = "u236464db1";
$password = ".exqjwb0urg8";
$dbname = "u236464db1";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
