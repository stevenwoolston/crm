<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (!defined('__ROOT__')) {
	define('__ROOT__', dirname(dirname(dirname(__FILE__))));
}

require_once __ROOT__ . '/inc/class.phpmailer.php';
require_once __ROOT__ . '/v2/config/database.php';
require_once __ROOT__ . '/v2/config/configuration.php';
require_once __ROOT__ . '/v2/invoice/invoice_pdf.php';
require_once __ROOT__ . '/v2/objects/customer.php';
require_once __ROOT__ . '/v2/objects/customercontact.php';
require_once __ROOT__ . '/v2/objects/customernote.php';
require_once __ROOT__ . '/v2/objects/delivery.php';
require_once __ROOT__ . '/v2/objects/invoice.php';
require_once __ROOT__ . '/v2/objects/invoiceitem.php';
require_once __ROOT__ . '/v2/objects/payment.php';

$database = new Database();
$db = $database->getConnection();

$delivery = new Delivery($db);

//  get deliveries to be queued
$deliveries_queued = array();
$deliveries_stmt = $delivery->read_queued();
$num = $deliveries_stmt->rowCount();
if ($num == 0) {
    http_response_code(200);
    echo json_encode(array("message" => "There were no deliveries queued to send."));
    die();
}

//  write deliveries to an array
while ($row = $deliveries_stmt->fetch(\PDO::FETCH_ASSOC)){
    extract($row);
    $delivery_item = array(
        "Id" => $Id,
        "InvoiceId" => $InvoiceId,
        "DateDelivered" => $DateDelivered,
        "DeliveredTo" => $DeliveredTo,
        "DeliveryComment" => $DeliveryComment
    );
    array_push($deliveries_queued, $delivery_item);
}

$customer = new Customer($db);
$invoice = new Invoice($db);
$invoiceitem = new InvoiceItem($db);
$customercontact = new CustomerContact($db);

//  iterate over the deliveries queue
foreach($deliveries_queued as $delivery_queued) {

    $data = array(
        "Customer" => array(),
        "CustomerContact" => array(),
        "Invoice" => array(),
        "InvoiceItems" => array(),
        "Delivery" => $delivery_queued
    );

    $delivery->Id = $delivery_queued["Id"];
    $delivery->DeliveredTo = $delivery_queued["DeliveredTo"];
    $delivery->InvoiceId = $delivery_queued["InvoiceId"];
    $delivery->DeliveryComment = $delivery_queued["DeliveryComment"];
    
    $id = $delivery->Id;
    $invoiceId = $delivery->InvoiceId;

    //  Get Invoice
    $invoice_stmt = $invoice->read_one($invoiceId);
    $num = $invoice_stmt->rowCount();
    if ($num == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "FAILED. There was no invoice associated with Invoice Id " . $invoiceId));
        die();
    }

    while ($row = $invoice_stmt->fetch(\PDO::FETCH_ASSOC)){
        extract($row);
        $invoice_item = array(
            "Id" => $Id,
            "CustomerId" => $CustomerId,
            "InvoiceDate" => $InvoiceDate,
            "InvoiceDueDate" => $InvoiceDueDate,
            "EmailSubject" => $EmailSubject,
            "DateSent" => $DateSent,
            "DatePaid" => $DatePaid,
            "IsCanceled" => (bool)$IsCanceled,
            "TotalCost" => $TotalCost,
            "TotalPayments" => $TotalPayments
        );
        array_push($data["Invoice"], $invoice_item);
    }

    $invoice->Id = $invoice_item["Id"];
    $invoice->CustomerId = $invoice_item["CustomerId"];
    $invoice->InvoiceDate = $invoice_item["InvoiceDate"];
    $invoice->InvoiceDueDate = $invoice_item["InvoiceDueDate"];
    $invoice->EmailSubject = $invoice_item["EmailSubject"];
    $invoice->DateSent = $invoice_item["DateSent"];
    $invoice->DatePaid = $invoice_item["DatePaid"];
    $invoice->IsCanceled = (bool)$invoice_item["IsCanceled"];
    $invoice->TotalCost = $invoice_item["TotalCost"];
    $invoice->TotalPayments = $invoice_item["TotalPayments"];

    //  Get Customer
    $customerId = $invoice->CustomerId;
    $customer_stmt = $customer->read_one($customerId);
    $num = $customer_stmt->rowCount();
    if ($num == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "FAILED. There was no customer associated with Invoice Id " . $invoiceId));
        die();
    }

    while ($row = $customer_stmt->fetch(\PDO::FETCH_ASSOC)){
        extract($row);
        $customer_item = array(
            "Id" => $Id,
            "Name" => $Name,
            "IsVisible" => (bool)$IsVisible,
            "Address" => $Address,
            "Suburb" => $Suburb,
            "State" => $State,
            "Postcode" => $Postcode,
            "InvoicingText" => $InvoicingText
        );
        array_push($data["Customer"], $customer_item);
    }

    //  Get Invoice Items
    $invoiceitem_stmt = $invoiceitem->read($invoiceId);
    $num = $invoiceitem_stmt->rowCount();
    if ($num == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "FAILED. There were no items associated with Invoice Id " . $invoiceId));
        die();
    }

    while ($row = $invoiceitem_stmt->fetch(\PDO::FETCH_ASSOC)){
        extract($row);
        $invoiceitem_item=array(
            "Id" => $Id,
            "InvoiceId" => $InvoiceId,
            "Sequence" => $Sequence,
            "Description" => $Description,
            "Cost" => $Cost
        );
        array_push($data["InvoiceItems"], $invoiceitem_item);
    }

    $pdf = new InvoicePDF();
    $pdf->data = $data;

    $config = new Configuration();
    $config->email_to_address = $delivery_queued["DeliveredTo"];
    $config->email_subject = $data["Invoice"][0]["EmailSubject"];
    $config->smtp_debug = 0;    //  0/1/2
    $config->smtp_attachment = $pdf->generate()->Output('', 'S');
    $config->smtp_attachment_name = 'WWD Invoice ' . $invoiceId . '.pdf';

    $body_html = '<p>Hi all.</p>';
    $body_html .= '<p>Thank you for your recent business.</p>';
    $body_html .= '<p>I have attached the invoice number <b>'. $invoiceId . '</b> for the work we did and look forward ';
    $body_html .= 'to continuing to work with you in the future.</p>';

    if (!empty($delivery->DeliveryComment)) {
        $body_html .= "<p>" . $delivery->DeliveryComment . "</p>";
    }

    $body_html .= '<p>Thanks for your business.<br/>';
    $body_html .= '<i>Steven Woolston</i></p>';

    $config->email_body = html_entity_decode($body_html);
    
    //  testing
    // array_push($data, $body_html);
    // array_push($data, $customerId);
    // array_push($data, $config);
    // http_response_code(500);
    // echo json_encode(array("message" => "Invoice Id " . $invoiceId ." successfully delivered", "data" => $data));
    // die();

    if ($config->send_email()) {
        date_default_timezone_set('Australia/Brisbane');
        $date = date('Y-m-d H:i:s');
        //  prepare to update the invoice
        $invoice->DateSent = $date;

        //  prepare to update the delivery
        $delivery->DateDelivered = $date;

        if ($invoice->update($invoice->Id) && $delivery->update($delivery->Id)) {
            http_response_code(200);
            echo json_encode(array("message" => "Invoice Id " . $invoiceId ." successfully delivered", "data" => $data));
            die();
        } else {
            http_response_code(500);
            echo json_encode(
                array(
                    "message" => "There was a problem updating the invoice and delivery. InvoiceId => " . $invoiceId . ", DeliveryId => " . $id, 
                    "data" => $data
                )
            );
            die();
        }
    }

    http_response_code(500);
    echo json_encode(array("message" => "Unable to send email for Invoice Id " . $invoiceId, "data" => $data));
}