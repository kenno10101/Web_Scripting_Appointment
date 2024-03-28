<?php
include ("businessLogic/simpleLogic.php");

$request_method = $_SERVER['REQUEST_METHOD'];
$param = "";
$method = "";



$logic = new SimpleLogic();

switch ($request_method) {
    case "GET":
        isset($_GET["method"]) ? $method = $_GET["method"] : false;
        isset($_GET["param"]) ? $param = $_GET["param"] : false;
        $result = $logic->handleRequest($request_method, $method, $param);
        response("GET", $result != null ? 200 : 400, $result);
        break;
    case "POST":
        $data = json_decode(file_get_contents('php://input'), true);
        $method = $data['method'];
        $param = $data['param'];
        $result = $logic->handleRequest($request_method, $method, $param);
        response("POST", $result != null ? 200 : 400, $result);
        break;
    default:
        response($method, 405, "Method not supported yet!");
}


function response($request_method, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($request_method) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        case "POST":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}