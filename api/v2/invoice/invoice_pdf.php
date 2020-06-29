<?php
use Mpdf\Mpdf;

if (!defined('__ROOT__')) {
	define('__ROOT__', dirname(dirname(dirname(__FILE__))));
}

require_once __ROOT__ . '/vendor/autoload.php';
require_once __ROOT__ . '/v2/invoice/invoice_pdf.php';
require_once __ROOT__ . '/v2/config/template.php';

class InvoicePDF {

	public $data;

	function Generate() {
		// var_dump($this->data);
		// die();
		$pdf = new \Mpdf\Mpdf();
		$stylesheet = 'body{font-family:Arial;font-size:16px;color:rgb(88,89,91)}h1,h2,h3,h4{font-weight:400}table{width:100%}table.invoice-container td{text-align:right}table.invoice-container td.cell-label{width:100px}.alignright{text-align:right}.items-list td{padding:8px}.payment-advice td{padding:3px}';
		$pdf->WriteHtml($stylesheet,\Mpdf\HTMLParserMode::HEADER_CSS);
		$pdf->SetHTMLFooter($this->PDFFooter());
		$pdf->WriteHTML($this->Template());
		return $pdf;
	}

	function Template() {
		$template = new Template('invoice_template_body.php');
		$template->set('InvoiceNumber', $this->data["Invoice"][0]["Id"]);
		$template->set('CustomerName', $this->data["Customer"][0]["Name"]);
		$template->set('InvoiceDate', $this->data["Invoice"][0]["InvoiceDate"]);
		$template->set('InvoiceDueDate', $this->data["Invoice"][0]["InvoiceDueDate"]);
		$template->set('CustomerAddress', $this->data["Customer"][0]["Address"]);
		$template->set('CustomerSuburb', $this->data["Customer"][0]["Suburb"]);
		$template->set('CustomerState', $this->data["Customer"][0]["State"]);
		$template->set('CustomerPostcode', $this->data["Customer"][0]["Postcode"]);
		$template->set('InvoicingText', $this->data["Customer"][0]["InvoicingText"]);
		$template->set('invoice_items', $this->data["InvoiceItems"]);
		$template->set('InvoiceCost', $this->data["Invoice"][0]["TotalCost"]);
		return $template->render();
	}

	function PDFFooter() {
		$template = new Template('invoice_template_footer.php');
		$template->set('InvoiceNumber', $this->data["Invoice"][0]["Id"]);
		$template->set('CustomerName', $this->data["Customer"][0]["Name"]);
		$template->set('InvoiceDate', $this->data["Invoice"][0]["InvoiceDate"]);
		$template->set('InvoiceDueDate', $this->data["Invoice"][0]["InvoiceDueDate"]);
		$template->set('CustomerAddress', $this->data["Customer"][0]["Address"]);
		$template->set('CustomerSuburb', $this->data["Customer"][0]["Suburb"]);
		$template->set('CustomerState', $this->data["Customer"][0]["State"]);
		$template->set('CustomerPostcode', $this->data["Customer"][0]["Postcode"]);
		$template->set('InvoicingText', $this->data["Customer"][0]["InvoicingText"]);
		$template->set('invoice_items', $this->data["InvoiceItems"]);
		$template->set('InvoiceCost', $this->data["Invoice"][0]["TotalCost"]);
		return $template->render();
	}	
	
}