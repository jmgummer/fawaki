<?php
// ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);
// This Class Handles DB Queries
class Dbmethods{
    public function ConnectDB()
    {
        $servername = "127.0.0.1";
        $username = "root";
        $password = "";
        $dbname = "fawaki";
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }else{
            return $conn;
        }
    }
}