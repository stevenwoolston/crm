<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: authorization, content-type, accept, origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST, PUT, DELETE");

require_once __DIR__ . '/../v2/config/database.php';
require_once __DIR__ . '/../v2/objects/payment.php';

$database = new Database();
$db = $database->getConnection();
$payment = new Payment($db);
$data = json_decode(file_get_contents('php://input'), true);

if (!empty($_GET["invoiceid"]))
{
    $invoiceid = intval($_GET["invoiceid"]);
}

if (!empty($_GET["id"]))
{
    $id = intval($_GET["id"]);
}

$request_method=$_SERVER["REQUEST_METHOD"];
switch($request_method)
{
    case 'GET':
        if (empty($id) && empty($invoiceid)) {
            http_response_code(404);
            echo json_encode(array("message" => "No record found. You did not supply an Id or InvoiceId.", "data" => $payment));
            die();
        }

        if (empty($id)) {
            $stmt = $payment->read($invoiceid);
        } else {
            $stmt = $payment->read_one($id);
        }

        if (empty($stmt)) die();

        $num = $stmt->rowCount();
        $results_arr = array("totalRecords" => $num, "data" => array());
         
        if ($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                extract($row); 
                $results_item = array(
                    "Id" => $Id,
                    "InvoiceId" => $InvoiceId,
                    "DatePaid" => $DatePaid,
                    "Amount" => $Amount
                );
         
                array_push($results_arr["data"], $results_item);
            }
        }
        
        http_response_code(200);
        echo json_encode($results_arr, JSON_NUMERIC_CHECK);        
        break;
    case 'PUT':
        if (empty($id)) {
            http_response_code(404);
            echo json_encode(array("message" => "No record found. You did not supply an Id.", "data" => $payment));
            die();
        }

        $payment->Id = $id;
		$payment->InvoiceId = $data["InvoiceId"];
		$payment->DatePaid = $data["DatePaid"];
		$payment->Amount = $data["Amount"];

        $status = $payment->sanitize()->update($id);
        if ($status) {
            http_response_code(200);
            echo json_encode(array("message" => "Record updated successfully.", "data" => $payment));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create record.", "data" => $status));
        }
        die();
        break;
    case 'POST':
		$payment->InvoiceId = $data["InvoiceId"];
		$payment->DatePaid = $data["DatePaid"];
		$payment->Amount = $data["Amount"];

        $status = $payment->sanitize()->create();
        if ($status) {
            http_response_code(200);
            echo json_encode(array("message" => "Record created successfully.", "data" => $payment));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create record."));
        }
        die();
		break;
	case 'DELETE':
        if (empty($id)) {
            http_response_code(404);
            echo json_encode(array("message" => "No record found. You did not supply an Id.", "data" => $payment));
            die();
        }

        if ($payment->delete($id)) {
            http_response_code(200);
            echo json_encode(array("message" => "Record was deleted."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to delete record."));
        }
		die();
        break;
    case 'OPTIONS':
        http_response_code(200);
        die();
        break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		die();
		break;
}
