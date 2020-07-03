<?php

class Database {
 
    // specify your own database credentials
    private $host = "s212.syd3.hostingplatform.net.au";
    private $db_name = "woolsto1_crm";
    private $username = "woolsto1_root";
    private $password = "7mHNURiJKgnz";

    // private $host = "localhost";
    // private $db_name = "crm";
    // private $username = "root";
    // private $password = "root";

    public $conn;
 
    // get the database connection
    public function getConnection() {
 
        $this->conn = null;
 
        try {
            $this->conn = new \PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
        } catch(\PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}