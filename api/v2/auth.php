<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: authorization, content-type, accept, origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS, POST, PUT, DELETE");

require_once __DIR__ . '/../v2/config/database.php';
require_once __DIR__ . '/../v2/objects/auth.php';

$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);
$route = $_GET['route'];
$data = json_decode(file_get_contents('php://input'), true);

switch($route)
{
    case 'me':
       
        if (empty($data["id"])) {
            http_response_code(401);
            $results_arr = array("totalRecords" => 0, "data" => "No user data passed.");
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            die();
        }

        $auth->Id = $data["id"];
        $stmt = $auth->me();
        $num = $stmt->rowCount();
        $results_arr = array("totalRecords" => $num, "data" => array());

        if ($num > 0) {
        
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)){
                extract($row); 
                $results_item = array(
                    "Id" => $Id,
                    "EmailAddress" => $EmailAddress,
                    "IsVisible" => (bool)$IsVisible,
                );
                array_push($results_arr["data"], $results_item);
            }
        } else {
            http_response_code(401);
            $results_arr = array("totalRecords" => 0, "data" => "No user found.");
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            die();
        }
        
        http_response_code(200);
        echo json_encode($results_arr, JSON_NUMERIC_CHECK);        
        break;
    case 'signout':

        if (empty($data["id"])) {
            http_response_code(500);
            $results_arr = array("totalRecords" => 0, "data" => "Bad credentials.");
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            die();
        }

        $auth->ID = $data["id"];
        $stmt = $auth->me($id);
        $num = $stmt->rowCount();

        if ($num > 0) {
            http_response_code(200);
            $results_arr = array("totalRecords" => 0, "data" => true);
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            break;
        } else {
            http_response_code(401);
            $results_arr = array("totalRecords" => 0, "data" => "No user found.");
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            die();
        }

        http_response_code(501);
        $results_arr = array("totalRecords" => 0, "data" => "Server error");
        echo json_encode($results_arr, JSON_NUMERIC_CHECK);        
        break;

    case 'signin':

        if (empty($data["emailaddress"]) || empty($data["password"])) {
            http_response_code(401);
            $results_arr = array("totalRecords" => 0, "data" => "No user data passed.");
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            die();
        }

        $auth->EmailAddress = $data["emailaddress"];
        $password = $data["password"];
        $stmt = $auth->signin($password);

        $num = $stmt->rowCount();
        $results_arr = array("totalRecords" => $num, "data" => array());
        if ($num > 0) {
        
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)){
                extract($row); 
                $results_item = array(
                    "Id" => $Id,
                    "EmailAddress" => $EmailAddress,
                    "IsVisible" => (bool)$IsVisible,
                );
                array_push($results_arr["data"], $results_item);
            }
        } else {
            http_response_code(401);
            $results_arr = array("totalRecords" => 0, "data" => "Credentials incorrect.");
            echo json_encode($results_arr, JSON_NUMERIC_CHECK);
            die();
        }
        
        http_response_code(200);
        echo json_encode($results_arr, JSON_NUMERIC_CHECK);        
        break;

	default:
		// Invalid Request Method
		header("HTTP/1.0 405 Method Not Allowed");
		die();
		break;
}
