<?php

class Delivery {
 
    private $conn;
    private $table_name = "delivery";
 
    public $Id;
	public $InvoiceId;
	public $DateDelivered;
	public $DeliveryComment;
    public $DeliveredTo;

    public function __construct($db) {
        $this->conn = $db;
	}
	
	function read($invoiceId) {
	
		$query = "SELECT Id, InvoiceId, DateDelivered, DeliveredTo, DeliveryComment
				FROM
					" . $this->table_name . " c
				WHERE c.InvoiceId = " . $invoiceId . "
				ORDER BY
					c.DateDelivered DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function read_queued() {
	
		$query = "SELECT Id, InvoiceId, DateDelivered, DeliveredTo, DeliveryComment
				FROM
					" . $this->table_name . " c
				WHERE c.DateDelivered IS NULL
				AND (
					c.InvoiceScheduledDeliveryDate IS NULL OR 
					c.InvoiceScheduledDeliveryDate = CURDATE()
				)
				ORDER BY
					c.Id DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function read_one($id) {
	
		$query = "SELECT Id, InvoiceId, DateDelivered, DeliveredTo, DeliveryComment
				FROM
					" . $this->table_name . " c
				WHERE
					Id = " . $id;
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function sanitize() {
		$this->InvoiceId=htmlspecialchars(strip_tags($this->InvoiceId));
		$this->DeliveredTo=htmlspecialchars(strip_tags($this->DeliveredTo));
		return $this;
	}

	function create() {
	
		$query = "INSERT INTO " . $this->table_name . "
				(InvoiceId, DeliveredTo, DeliveryComment)
				VALUES (:InvoiceId, :DeliveredTo, :DeliveryComment)";
	
		$stmt = $this->conn->prepare($query);
	
		$stmt->bindParam(":InvoiceId", $this->InvoiceId);
		$stmt->bindParam(":DeliveredTo", $this->DeliveredTo);
		$stmt->bindParam(":DeliveryComment", $this->DeliveryComment);
		
		if ($stmt->execute()) {
            $this->Id=$this->conn->lastInsertId();
			return $this->Id;
		}
	
		return false;
	}

	function update($id) {

		$query = "UPDATE
					" . $this->table_name . "
				SET
					InvoiceId=:InvoiceId, DateDelivered=:DateDelivered, DeliveredTo=:DeliveredTo,
					DeliveryComment=:DeliveryComment
				WHERE
					Id = :Id";
	
		$stmt = $this->conn->prepare($query);

		if ($this->DateDelivered == "0000-00-00") {
			$this->DateDelivered = null;
		}
		
        $stmt->bindParam(":Id", $this->Id);
		$stmt->bindParam(":InvoiceId", $this->InvoiceId);
		$stmt->bindParam(":DateDelivered", $this->DateDelivered);
		$stmt->bindParam(":DeliveredTo", $this->DeliveredTo);
		$stmt->bindParam(":DeliveryComment", $this->DeliveryComment);

		if ($stmt->execute()) {
			return true;
		}
	
		return false;
	}
		
	function updateDeliveryDate($id) {

        $this->Id = $id;

		$query = "UPDATE
					" . $this->table_name . "
				SET
					DateDelivered=NOW()
				WHERE
					Id = :Id";
	
		$stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Id", $this->Id);

		if ($stmt->execute()) {
			return $stmt;
		}
	
		return $stmt;
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