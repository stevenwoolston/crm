<?php

class Auth {
 
    // database connection and table name
    private $conn;
    private $table_name = "user";
 
    // object properties
    public $Id;
	public $EmailAddress;
	public $IsVisible;
 
    // constructor with $db as database connection
    public function __construct($db) {
        $this->conn = $db;
	}

	function me() {
		$query = "SELECT * FROM " . $this->table_name . " u WHERE u.Id = " . $this->Id;
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function signin($password) {
		$query = "SELECT * FROM " . $this->table_name . " u 
			WHERE u.EmailAddress='" . $this->EmailAddress . "'
			AND u.Password=MD5('" . $password . "')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	/*	Helpers */
    public function encryptPassword($password) {
        $ciphering = "AES-128-CTR"; 
        $iv_length = openssl_cipher_iv_length($ciphering); 
        $options = 0; 
        $encryption_iv = '1234567891011121'; 
        $encryption_key = "WoolsdtonWebDesign"; 
        $encryption = openssl_encrypt($password, $ciphering, 
                    $encryption_key, $options, $encryption_iv); 
        return $encryption;
    }

    function decryptPassword($password) {
        $ciphering = "AES-128-CTR"; 
        $options = 0; 
        $decryption_iv = '1234567891011121'; 
        $decryption_key = "WoolsdtonWebDesign"; 
        $decryption=openssl_decrypt ($password, $ciphering,  
                $decryption_key, $options, $decryption_iv); 
        return $decryption;
    }	
}