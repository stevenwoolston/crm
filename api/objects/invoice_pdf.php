<?php
require('../inc/fpdf.php');

class InvoicePDF extends FPDF {

	public $data;

	function Header() {
		$this->Image('../assets/img/logo.png', 170, 6, 30);
		$this->SetFont('Arial','', 22);
		$this->SetTextColor(88, 89, 91);
		$this->Cell(0, 10, 'Woolston Web Design', 0, 0, 'L');
		$this->Ln(9);
		$this->SetFont('Arial','',12);
		$this->Cell(8, 10, 'P:');
		$this->Cell(0, 10, '+61 407 077 508', 0, 0, 'L');
		$this->Ln(6);
		$this->Cell(8, 10, 'E:');
		$this->Cell(0, 10, 'accounts@woolston.com.au', 0, 0, 'L');
		$this->Ln(6);
		$this->Cell(8, 10, 'W:');
		$this->Cell(0, 10, 'https://www.woolston.com.au', 0, 0, 'L');
	}

	function InvoiceDetail() {
		$this->SetFont('Arial','', 22);
		$this->Ln(20);
		$this->Cell(0, 10, 'INVOICE ' . $this->data["Invoice"][0]["Id"], 0, 0, 'L');
	
		$this->SetFont('Arial','',12);
		$this->Cell(0, 10, 'Invoice Date: ' . date('d-M-Y', strtotime($this->data["Invoice"][0]["InvoiceDate"])), 0, 0, 'R');
		$this->Ln(8);
		$this->Cell(0, 10, $this->data["Customer"][0]["Name"], 0, 0, 'L');
		$this->Cell(0, 10, 'Due Date: ' . date('d-M-Y', strtotime($this->data["Invoice"][0]["InvoiceDueDate"])), 0, 0, 'R');
		$this->Ln(6);
		$this->Cell(0, 10, $this->data["Customer"][0]["Address"], 0, 0, 'L');
		$this->Cell(0, 10, 'BSB: 064467 (CBA)', 0, 0, 'R');
		$this->Ln(6);
		$this->Cell(0, 10, $this->data["Customer"][0]["Suburb"] . ' ' . $this->data["Customer"][0]["State"] . ' ' . $this->data["Customer"][0]["Postcode"], 0, 0, 'L');    
		$this->Cell(0, 10, 'A/c Number: 10472252', 0, 0, 'R');
	}

	function ItemsTable() {
		$this->SetFont('Arial','B',12);
		$this->SetFillColor(236, 236, 236);
		$this->SetDrawColor(204, 204, 204);
		$this->SetLineWidth(.3);
		$this->Ln(20);
		$this->Cell(140, 10, 'Description of Work', 1, 0, 'L', true);
		$this->Cell(50, 10, 'Cost', 1, 0, 'R', true);
		$this->Ln();
		$this->SetFont('Arial','',12);
		foreach($this->data["InvoiceItems"] as $item) {
			$this->SetDrawColor(204, 204, 204);
			$this->SetLineWidth(.3);
			$this->Cell(140, 10, $item["Description"], 1, 0, 'L', false);
			$this->Cell(50, 10, '$' . number_format($item["Cost"], 2), 1, 0, 'R', false);
			$this->Ln();
		}
		$this->SetFont('Arial','B',12);
		$this->SetFillColor(236, 236, 236);
		$this->SetDrawColor(204, 204, 204);
		$this->SetLineWidth(.3);
		$this->Cell(140, 10, 'Total', 1, 0, 'L', true);
		$this->Cell(50, 10, '$' . number_format($this->data["Invoice"][0]["TotalCost"], 2), 1, 0, 'R', true);
		$this->Ln(20);
	}

	function Footer() {
		$this->SetY(-80);
		$this->SetFont('Arial','B',22);
		$this->SetFillColor(236, 236, 236);
		$this->SetDrawColor(204, 204, 204);
		$this->SetLineWidth(.3);
		$this->Ln(20);
		$this->Cell(0, 15, 'Payment Advice', 'TLR', 0, 'L', true);
		$this->Ln();
		$this->SetFont('Arial','', 12);
		$this->SetLineWidth(0);
		$this->Cell(15, 10, 'To:', 'L', 0, 'L', true);
		$this->Cell(80, 10, 'Steven Woolston', 0, 0, 'L', true);
		$this->Cell(35, 10, 'Customer:', 0, 0, 'L', true);
		$this->Cell(60, 10, $this->data["Customer"][0]["Name"], 'R', 0, 'L', true);
		$this->Ln(8);
		$this->Cell(15, 10, '', 'L', 0, 'L', true);
		$this->Cell(80, 10, $this->data["Customer"][0]["Address"], 0, 0, 'L', true);
		$this->Cell(35, 10, 'Amount Due:', 0, 0, 'L', true);
		$this->Cell(60, 10, '$' . number_format($this->data["Invoice"][0]["TotalCost"], 2), 'R', 0, 'L', true);
		$this->Ln(8);
		$this->Cell(15, 10, '', 'L', 0, 'L', true);
		$this->Cell(80, 10, $this->data["Customer"][0]["Suburb"] . ' ' . $this->data["Customer"][0]["State"] . ' ' . $this->data["Customer"][0]["Postcode"], 0, 0, 'L', true);
		$this->Cell(35, 10, 'Due Date:', 0, 0, 'L', true);
		$this->Cell(60, 10, date('d-M-Y', strtotime($this->data["Invoice"][0]["InvoiceDueDate"])), 'R', 0, 'L', true);
		$this->Ln(8);
		$this->Cell(15, 10, 'ABN:', 'LB', 0, 'L', true);
		$this->Cell(80, 10, '90 402 082 387', 'B', 0, 'L', true);
		$this->Cell(35, 10, 'Invoice No:', 'B', 0, 'L', true);
		$this->Cell(60, 10, $this->data["Invoice"][0]["Id"], 'BR', 0, 'L', true);
	}
}