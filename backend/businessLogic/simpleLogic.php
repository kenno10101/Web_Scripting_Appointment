<?php
include ("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($request_method, $method, $param)
    {
        switch ($request_method) {
            case "GET":
                switch ($method) {
                    case "queryAppointments":
                        $res = $this->dh->queryAppointments();
                        break;
                    case "queryAppointmentById":
                        $res = $this->dh->queryAppointmentById($param);
                        break;
                    case "queryVotingsByAppointmentId":
                        $res = $this->dh->queryVotingsByAppointmentId($param);
                        break;

                    default:
                        $res = null;
                        break;
                }
                break;
            case "POST":
                switch ($method) {
                    case "addAppointment":
                        $res = $this->dh->addAppointment($param);
                        break;
                    case "addAppointmentOption":
                        $res = $this->dh->addTimeOption($param);
                        break;
                    case "addVotes":
                        echo json_encode($param);
                        $res = $this->dh->addVotes($param);
                        break;
                    default:
                        $res = null;
                        break;
                }
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}