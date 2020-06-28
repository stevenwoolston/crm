<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: authorization, content-type, accept, origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST, PUT, DELETE");

require_once __DIR__ . '/../v2/config/database.php';
require_once __DIR__ . '/../v2/objects/invoice.php';

$database = new APIv2\config\Database();
$db = $database->getConnection();
$invoice = new APIv2\objects\Invoice($db);
$data = json_decode(file_get_contents('php://input'), true);
$report_name = $_GET["rpt"];
switch($report_name)
{
    case 'invoicesdue':
        $stmt = $invoice->due_today();
        if (empty($stmt)) die();

        $num = $stmt->rowCount();
        $results_arr = array("totalRecords" => $num, "data" => array());
         
        if ($num > 0) {
            $results_arr["data"] = $stmt->fetchAll();
        }
        
        http_response_code(200);
        echo json_encode($results_arr, JSON_NUMERIC_CHECK);        
        break;
	default:
		header("HTTP/1.0 404 No report found.");
		die();
		break;
}
