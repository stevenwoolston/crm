<?php
namespace APIv2\Config;

class Database {
 
    // specify your own database credentials
    private $host = "mysql5013.site4now.net";
    private $db_name = "db_9c4ddd_crm";
    private $username = "9c4ddd_crm";
    private $password = "H@nnahN0ah";

    // private $host = "localhost";
    // private $db_name = "vuecrm";
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