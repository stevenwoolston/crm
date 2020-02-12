<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: authorization, content-type, accept, origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST, PUT, DELETE");

require_once __DIR__ . '/../vendor/autoload.php';
use APIv2\Config\Database;
use APIv2\objects as Models;

$database = new Database();
$db = $database->getConnection();
$customer = new Models\Customer($db);
$data = json_decode(file_get_contents('php://input'), true);

if (!empty($_GET["id"])) {
    $id = intval($_GET["id"]);
}

$request_method=$_SERVER["REQUEST_METHOD"];
switch($request_method)
{
    case 'GET':
        if (empty($id)) {
            $stmt = $customer->read();
        } else {
            $stmt = $customer->read_one($id);
        }

        if (empty($stmt)) die();

        $num = $stmt->rowCount();
        $results_arr = array("totalRecords" => $num, "data" => array());
         
        if ($num > 0) {
        
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)){
                extract($row); 
                $results_item = array(
                    "Id" => $Id,
                    "Name" => $Name,
                    "IsVisible" => (bool)$IsVisible,
                    "Address" => $Address,
                    "Suburb" => $Suburb,
                    "State" => $State,
                    "Postcode" => $Postcode,
                    "URL" => $URL,
                    "InvoicingText" => $InvoicingText,
                    "IsSupportCustomer" => (bool)$IsSupportCustomer,
                    "SupportEndDate" => $SupportEndDate
                );
         
                array_push($results_arr["data"], $results_item);
            }
        
        }
        
        http_response_code(200);
        echo json_encode($results_arr, JSON_NUMERIC_CHECK);        
        break;
    case 'PUT':
        if (empty($id)) {
            http_response_code(500);
            echo json_encode(array("message" => "No record selected."));
            die();
        }

        $customer->Id = $id;
        $customer->Name = $data["Name"];
        $customer->Address = $data["Address"];
        $customer->Suburb = $data["Suburb"];
        $customer->State = $data["State"];
        $customer->Postcode = $data["Postcode"];
        $customer->InvoicingText = $data["InvoicingText"];
        $customer->URL = $data["URL"];
        $customer->IsSupportCustomer = $data["IsSupportCustomer"];
        $customer->SupportEndDate = $data["SupportEndDate"];
        $customer->IsVisible = $data["IsVisible"];

        $status = $customer->sanitize()->update();
        if ($status) {
            http_response_code(200);
            echo json_encode(array("message" => "Record updated successfully.", "data" => $customer));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create record."));
        }

        die();
		break;
    case 'POST':

        $customer->Name = $data["Name"];
        $customer->Address = $data["Address"];
        $customer->Suburb = $data["Suburb"];
        $customer->State = $data["State"];
        $customer->Postcode = $data["Postcode"];
        $customer->InvoicingText = $data["InvoicingText"];
        $customer->URL = $data["URL"];
        $customer->IsSupportCustomer = $data["IsSupportCustomer"];
        $customer->SupportEndDate = $data["SupportEndDate"];
        $customer->IsVisible = $data["IsVisible"];

        $status = $customer->sanitize()->create();
        if ($status) {
            http_response_code(200);
            echo json_encode(array("message" => "Record created successfully.", "data" => $customer));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create record."));
        }

        die();
		break;
	case 'DELETE':
        if ($customer->delete($id)) {
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
		// Invalid Request Method
		header("HTTP/1.0 405 Method Not Allowed");
		die();
		break;
}
