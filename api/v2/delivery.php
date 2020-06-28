<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: authorization, content-type, accept, origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST, PUT, DELETE");

require_once __DIR__ . '/../v2/config/database.php';
require_once __DIR__ . '/../v2/objects/delivery.php';

$database = new APIv2\config\Database();
$db = $database->getConnection();
$delivery = new APIv2\objects\Delivery($db);
$data = json_decode(file_get_contents('php://input'), true);

if (!empty($_GET["id"]))
{
    $id = intval($_GET["id"]);
}

if (!empty($_GET["invoiceid"]))
{
    $invoiceId = intval($_GET["invoiceid"]);
}

$request_method=$_SERVER["REQUEST_METHOD"];
switch($request_method)
{
    case 'GET':
        if (empty($id)) {
            $stmt = $delivery->read($invoiceId);
        } else {
            $stmt = $delivery->read_one($id);
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
                    "DateDelivered" => $DateDelivered,
                    "DeliveredTo" => $DeliveredTo,
                    "DeliveryComment" => $DeliveryComment
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
            echo json_encode(array("message" => "No record found. You did not supply an Id.", "data" => $delivery));
            die();
        }

        $delivery->Id = $id;
		$delivery->InvoiceId = $data["InvoiceId"];
		$delivery->DateDelivered = $data["DateDelivered"];
        $delivery->DeliveredTo = $data["DeliveredTo"];
        $delivery->DeliveryComment = $data["DeliveryComment"];
        
        $status = $delivery->sanitize()->update($id);
        if ($status) {
            http_response_code(200);
            echo json_encode(array("message" => "Record updated successfully.", "data" => $delivery));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create record."));
        }
        die();
        break;
    case 'POST':

		$delivery->InvoiceId = $data["InvoiceId"];
		$delivery->DeliveredTo = $data["DeliveredTo"];
        $delivery->DeliveryComment = $data["DeliveryComment"];

        $status = $delivery->sanitize()->create();
        if ($status) {
            http_response_code(200);
            echo json_encode(array("message" => "Record created successfully.", "data" => $delivery));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create record."));
        }
        die();
		break;
	case 'DELETE':
        if (empty($id)) {
            http_response_code(404);
            echo json_encode(array("message" => "No record found. You did not supply an Id.", "data" => $delivery));
            die();
        }

        if ($delivery->delete($id)) {
            http_response_code(200);
            echo json_encode(array("message" => "Record was deleted."));
        } else{
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