<?php
class Payment {
 
    private $conn;
    private $table_name = "payment";
 
    public $Id;
	public $InvoiceId;
	public $DatePaid;
    public $Amount;

    public function __construct($db) {
        $this->conn = $db;
	}
	
	function read($invoiceId) {
	
		$query = "SELECT Id, InvoiceId, DatePaid, Amount
				FROM
					" . $this->table_name . " c
				WHERE c.InvoiceId = " . $invoiceId . "
				ORDER BY
					c.DatePaid DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function read_one($id) {
	
		$query = "SELECT Id, InvoiceId, DatePaid, Amount
				FROM
					" . $this->table_name . " c
				WHERE
					Id = " . $id . "
				ORDER BY
					c.DatePaid DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function sanitize() {
		$this->InvoiceId=htmlspecialchars(strip_tags($this->InvoiceId));
		$this->DatePaid=htmlspecialchars(strip_tags($this->DatePaid));
		$this->Amount=htmlspecialchars(strip_tags($this->Amount));
		return $this;
	}

	function create() {
		try {
			$this->conn->beginTransaction();
			$query = "INSERT INTO " . $this->table_name . "
					(InvoiceId, DatePaid, Amount)
					VALUES (:InvoiceId, :DatePaid, :Amount)";
		
			$stmt = $this->conn->prepare($query);
			$stmt->bindParam(":InvoiceId", $this->InvoiceId);
			$stmt->bindParam(":DatePaid", $this->DatePaid);
			$stmt->bindParam(":Amount", $this->Amount);
			$stmt->execute();
			$stmt = null;
			$this->Id = $this->conn->lastInsertId();

			// check if total payments equals total cost and update invoice date paid
			$query = "SELECT CONVERT(SUM(COALESCE(p.Amount, 0)), decimal(10,2)) TotalPayments, 
				CONVERT(COALESCE(i.Cost, 0), decimal(10,2)) TotalCost 
				FROM payment p
				join invoiceitem i ON i.InvoiceId = p.InvoiceId 
				WHERE p.InvoiceId = " .$this->InvoiceId;
			$response = $this->conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
			$totalPayments = $response[0]["TotalPayments"];
			$totalCost = $response[0]["TotalCost"];
			var_dump(array("totalpayments" => $totalPayments, 
				"totalCost" => $totalCost, 
				"response" => $response, 
				"payment" => $this)
			);

			if ($totalPayments >= $totalCost) {
				$query = "UPDATE invoice SET DatePaid = :DatePaid WHERE Id = :InvoiceId";
				$stmt = $this->conn->prepare($query);
				$stmt->bindParam(":InvoiceId", $this->InvoiceId);
				$stmt->bindParam(":DatePaid", $this->DatePaid);
				$stmt->execute();
			}
			$this->conn->commit();
			return $this->Id;
		} catch(Exception $e) {
			$this->conn->rollback();
			return false;
		}
	}

	function update($id) {

		$query = "UPDATE
					" . $this->table_name . "
				SET
					InvoiceId=:InvoiceId, DatePaid=:DatePaid, Amount=:Amount
				WHERE
					Id = :Id";
	
		$stmt = $this->conn->prepare($query);

		if ($this->DatePaid == "0000-00-00") {
			$this->DatePaid = null;
		}
		
        $stmt->bindParam(":Id", $this->Id);
		$stmt->bindParam(":InvoiceId", $this->InvoiceId);
		$stmt->bindParam(":DatePaid", $this->DatePaid);
		$stmt->bindParam(":Amount", $this->Amount);

		if ($stmt->execute()) {
			return true;
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