<?php

class Invoice {
 
    private $conn;
    private $table_name = "invoice";
 
	public $Id;
	public $CustomerId;
	public $InvoiceDate;
    public $InvoiceDueDate;
    public $EmailSubject;
    public $DateSent;
    public $DatePaid;
	public $IsCanceled;
	public $TotalCost;
	public $TotalPayments;
	public $CustomerName;
	public $InvoiceScheduledDeliveryDate;

    public function __construct($db) {
        $this->conn = $db;
	}
	
	function read($customerId) {
	
		$query = "SELECT i.Id, CustomerId, InvoiceDate, InvoiceDueDate, InvoiceScheduledDeliveryDate,
				EmailSubject, DateSent, i.DatePaid, IsCanceled, 
                COALESCE(ii.TotalCost, 0) TotalCost,
                COALESCE(p.TotalPayments, 0) TotalPayments,
				c.Name CustomerName
				FROM " . $this->table_name . " i
				INNER JOIN customer c ON c.Id = i.CustomerId
                LEFT JOIN ( SELECT InvoiceId, SUM(Amount) TotalPayments FROM payment GROUP BY InvoiceId) p ON p.InvoiceId = i.Id
                LEFT JOIN ( SELECT InvoiceId, SUM(Cost) TotalCost FROM invoiceitem GROUP BY InvoiceId) ii ON ii.InvoiceId = i.Id
				GROUP BY Id, CustomerId, InvoiceDate, InvoiceDueDate, InvoiceScheduledDeliveryDate, EmailSubject, DateSent, DatePaid, IsCanceled, c.Name
				HAVING CustomerId = " . $customerId . "
				ORDER BY i.InvoiceDate DESC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function read_one($id) {

		$query = "SELECT i.Id, CustomerId, InvoiceDate, InvoiceDueDate, InvoiceScheduledDeliveryDate,
				EmailSubject, DateSent, i.DatePaid, IsCanceled, 
                COALESCE(ii.TotalCost, 0) TotalCost,
                COALESCE(p.TotalPayments, 0) TotalPayments,
				c.Name CustomerName
				FROM " . $this->table_name . " i
				INNER JOIN customer c ON c.Id = i.CustomerId
                LEFT JOIN ( SELECT InvoiceId, SUM(Amount) TotalPayments FROM payment GROUP BY InvoiceId) p ON p.InvoiceId = i.Id
                LEFT JOIN ( SELECT InvoiceId, SUM(Cost) TotalCost FROM invoiceitem GROUP BY InvoiceId) ii ON ii.InvoiceId = i.Id
				GROUP BY Id, CustomerId, InvoiceDate, InvoiceDueDate, InvoiceScheduledDeliveryDate, EmailSubject, DateSent, DatePaid, IsCanceled, c.Name
				HAVING i.Id = " . $id . "
				ORDER BY i.Id ASC";

		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function awaitingpayment() {
		$query = "SELECT i.Id, CustomerId, InvoiceDate, InvoiceDueDate, InvoiceScheduledDeliveryDate,
				EmailSubject, DateSent, i.DatePaid, IsCanceled, 
                COALESCE(ii.TotalCost, 0) TotalCost,
				c.Name CustomerName,
				CASE 
					WHEN i.InvoiceDueDate < CURDATE() THEN 1
					ELSE 0
				END isOverDue
				FROM " . $this->table_name . " i
				INNER JOIN customer c ON c.Id = i.CustomerId
                LEFT JOIN ( SELECT InvoiceId, SUM(Cost) TotalCost FROM invoiceitem GROUP BY InvoiceId) ii ON ii.InvoiceId = i.Id
				GROUP BY Id, CustomerId, InvoiceDate, InvoiceDueDate, InvoiceScheduledDeliveryDate, EmailSubject, DateSent, DatePaid, IsCanceled, c.Name
				HAVING i.DatePaid IS NULL AND i.IsCanceled = 0
				ORDER BY i.InvoiceDueDate ASC";

		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function sanitize() {
		$this->CustomerId=htmlspecialchars(strip_tags($this->CustomerId));
		$this->EmailSubject=htmlspecialchars(strip_tags($this->EmailSubject));
		return $this;
	}

	function create() {
	
		try {
			$query = "INSERT INTO
						" . $this->table_name . "
					SET
						CustomerId=:CustomerId, InvoiceDate=:InvoiceDate, InvoiceDueDate=:InvoiceDueDate, 
						InvoiceScheduledDeliveryDate=:InvoiceScheduledDeliveryDate, EmailSubject=:EmailSubject, DateSent=:DateSent, 
						DatePaid=:DatePaid, IsCanceled=:IsCanceled";
		
			$stmt = $this->conn->prepare($query);

			$stmt->bindParam(":CustomerId", $this->CustomerId, \PDO::PARAM_INT);
			$stmt->bindParam(":InvoiceDate", $this->InvoiceDate);
			$stmt->bindParam(":InvoiceDueDate", $this->InvoiceDueDate);
			$stmt->bindParam(":InvoiceScheduledDeliveryDate", $this->InvoiceScheduledDeliveryDate);
			$stmt->bindParam(":EmailSubject", $this->EmailSubject);
			$stmt->bindParam(":DateSent", $this->DateSent);
			$stmt->bindParam(":DatePaid", $this->DatePaid);
			$stmt->bindValue(":IsCanceled", $this->IsCanceled, \PDO::PARAM_BOOL);
			if ($stmt->execute()) {
				$this->Id=$this->conn->lastInsertId();
				return $this->Id;
			}
		} catch(Exception $e) {
			return $e->Message();
		}
	}

	function update($id) {

		$query = "UPDATE
					" . $this->table_name . "
				SET
                    CustomerId = :CustomerId,
                    InvoiceDate = :InvoiceDate,
					InvoiceDueDate = :InvoiceDueDate,
					InvoiceScheduledDeliveryDate = :InvoiceScheduledDeliveryDate,
                    EmailSubject = :EmailSubject,
                    DateSent = :DateSent,
					DatePaid = :DatePaid,
                    IsCanceled = :IsCanceled
				WHERE
					Id = :Id";
	
		$stmt = $this->conn->prepare($query);

		$stmt->bindParam(':Id', $this->Id);
		$stmt->bindParam(":CustomerId", $this->CustomerId);
		$stmt->bindParam(":InvoiceDate", $this->InvoiceDate);
		$stmt->bindParam(":InvoiceDueDate", $this->InvoiceDueDate);
		$stmt->bindParam(":InvoiceScheduledDeliveryDate", $this->InvoiceScheduledDeliveryDate);
		$stmt->bindParam(":EmailSubject", $this->EmailSubject);
		$stmt->bindParam(":DateSent", $this->DateSent);
		$stmt->bindParam(":DatePaid", $this->DatePaid);
		$stmt->bindParam(":IsCanceled", $this->IsCanceled);

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