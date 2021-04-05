<?php

class CustomerNote {
 
    private $conn;
    private $table_name = "customernote";
 
    public $Id;
	public $CustomerId;
	public $CustomerName;
	public $CreatedDate;
	public $Notes;
	public $TimeTaken;
	public $Description;
	public $Billable;
	public $InvoiceId;
 
    public function __construct($db) {
        $this->conn = $db;
	}
	
	function read($customerId) {
	
		$query = "SELECT c.Name 'CustomerName', cc.*
				FROM
					" . $this->table_name . " cc
				INNER JOIN customer c ON c.Id = cc.CustomerId
				WHERE cc.CustomerId = " . $customerId . "
				ORDER BY
					cc.CreatedDate DESC, cc.Id DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function readInvoiceNotes($invoiceId) {
	
		$query = "SELECT * FROM " . $this->table_name . " WHERE InvoiceId = " . $invoiceId . "
				ORDER BY CreatedDate DESC, Id DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}
	
	function read_one($id) {
	
		$query = "SELECT c.Name 'CustomerName', cc.*
				FROM
					" . $this->table_name . " cc
				INNER JOIN customer c ON c.Id = cc.CustomerId
				WHERE
					cc.Id = " . $id;
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function sanitize() {
		$this->Id=htmlspecialchars(strip_tags($this->Id));
		$this->CustomerId=htmlspecialchars(strip_tags($this->CustomerId));
		$this->Notes=htmlspecialchars($this->Notes);
		return $this;
	}

	function update($id) {

		$query = "UPDATE
					" . $this->table_name . "
				SET
                    CustomerId = :CustomerId,
                    InvoiceId = :InvoiceId
				WHERE
					Id = :Id";
	
		$stmt = $this->conn->prepare($query);

		$stmt->bindParam(':Id', $this->Id);
		$stmt->bindParam(":CustomerId", $this->CustomerId);
		$stmt->bindParam(":InvoiceId", $this->InvoiceId);

		if ($stmt->execute()) {
			return true;
		}
	
		return false;
	}

	function create() {
		$query = "INSERT INTO
					" . $this->table_name . "
				SET
					CustomerId=:CustomerId, CreatedDate=:CreatedDate, 
					Notes=:Notes, TimeTaken=:TimeTaken, Description=:Description,
					Billable=:Billable";
	
		$stmt = $this->conn->prepare($query);
	
		$stmt->bindParam(":CustomerId", $this->CustomerId, \PDO::PARAM_INT);
		$stmt->bindParam(":CreatedDate", $this->CreatedDate);
		$stmt->bindParam(":Notes", $this->Notes);
		$stmt->bindParam(":TimeTaken", $this->TimeTaken);
		$stmt->bindParam(":Description", $this->Description);
		$stmt->bindParam(":Billable", $this->Billable);

		if ($stmt->execute()) {
            $this->Id=$this->conn->lastInsertId();
			return $this->Id;
		}
	
		return false;
	}

	function delete($id) {
	
		$this->Id = $id;
        
		$query = "DELETE FROM " . $this->table_name . " WHERE Id = :Id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindParam(":Id", $this->Id);
 		
		if ($stmt->execute()) {
			return true;
		}
	
		return false;
	}
}