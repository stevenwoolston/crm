<?php
class Customer {
 
    // database connection and table name
    private $conn;
    private $table_name = "customer";
 
    // object properties
    public $Id;
	public $Name;
	public $IsVisible;
    public $Address;
	public $Suburb;
	public $State;
    public $Postcode;
	public $InvoicingText;
	public $URL;
    public $IsSupportCustomer;
    public $SupportEndDate;
 
    // constructor with $db as database connection
    public function __construct($db) {
        $this->conn = $db;
	}
	
	// read all customers
	function read() {
	
		// select all query
		$query = "SELECT Id, Name, IsVisible, Address, Suburb, State, Postcode, InvoicingText, URL, 
			IsSupportCustomer, SupportEndDate
			FROM
				" . $this->table_name . " c
			ORDER BY
				c.name ASC";
	
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	
		// execute query
		$stmt->execute();
		return $stmt;
	}

	//	read single customer
	function read_one($id) {
	
		$query = "SELECT Id, Name, IsVisible, Address, Suburb, State, Postcode, InvoicingText, URL, 
			IsSupportCustomer, SupportEndDate
		FROM
					" . $this->table_name . " c
				WHERE
					Id = " . $id . "
				ORDER BY
					c.name ASC";
	
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt;
	}

	function sanitize() {
		$this->Name=htmlspecialchars(strip_tags($this->Name));
		$this->IsVisible=htmlspecialchars(strip_tags($this->IsVisible));
		$this->Address=htmlspecialchars(strip_tags($this->Address));
		$this->Suburb=htmlspecialchars(strip_tags($this->Suburb));
		$this->State=htmlspecialchars(strip_tags($this->State));
		$this->Postcode=htmlspecialchars(strip_tags($this->Postcode));
		$this->InvoicingText=htmlspecialchars(strip_tags($this->InvoicingText));
		$this->URL=htmlspecialchars(strip_tags($this->URL));
		return $this;
	}

	function create() {

		$query = "INSERT INTO
					" . $this->table_name . "
				SET
					Name=:Name, IsVisible=:IsVisible, Address=:Address, 
					Suburb=:Suburb, State=:State, Postcode=:Postcode, 
					InvoicingText=:InvoicingText,
					IsSupportCustomer=:IsSupportCustomer, 
					SupportEndDate=:SupportEndDate,
					URL=:URL";
	
		// prepare query
		$stmt = $this->conn->prepare($query);
        
        // bind values
		$stmt->bindParam(":Name", $this->Name);
		$stmt->bindParam(":IsVisible", $this->IsVisible, PDO::PARAM_BOOL);
		$stmt->bindParam(":Address", $this->Address);
		$stmt->bindParam(":Suburb", $this->Suburb);
		$stmt->bindParam(':State', $this->State);
		$stmt->bindParam(":Postcode", $this->Postcode);
		$stmt->bindParam(":InvoicingText", $this->InvoicingText);
		$stmt->bindParam(":URL", $this->URL);
		$stmt->bindParam(":IsSupportCustomer", $this->IsSupportCustomer, PDO::PARAM_BOOL);
		$stmt->bindParam(":SupportEndDate", $this->SupportEndDate);
	
		// execute query
		if ($stmt->execute()) {
            $this->Id=$this->conn->lastInsertId();
			return $this->Id;
		}
	
		return false;
	}

	function update() {

		$query = "UPDATE
					" . $this->table_name . "
				SET
					Name = :Name,
					Address = :Address,
					Suburb = :Suburb,
					State = :State,
					Postcode = :Postcode,
					InvoicingText = :InvoicingText,
					IsVisible = :IsVisible,
					IsSupportCustomer = :IsSupportCustomer, 
					SupportEndDate = :SupportEndDate,
					URL = :URL
				WHERE
					Id = :Id";
	
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	
        // bind values
        $stmt->bindParam(":Id", $this->Id);
		$stmt->bindParam(":Name", $this->Name);
		$stmt->bindParam(":IsVisible", $this->IsVisible, PDO::PARAM_BOOL);
		$stmt->bindParam(":Address", $this->Address);
		$stmt->bindParam(":Suburb", $this->Suburb);
		$stmt->bindParam(':State', $this->State);
		$stmt->bindParam(":Postcode", $this->Postcode);
		$stmt->bindParam(":InvoicingText", $this->InvoicingText);
		$stmt->bindParam(":URL", $this->URL);
		$stmt->bindParam(":IsSupportCustomer", $this->IsSupportCustomer, PDO::PARAM_BOOL);
		$stmt->bindParam(":SupportEndDate", $this->SupportEndDate);
	
		// execute the query
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