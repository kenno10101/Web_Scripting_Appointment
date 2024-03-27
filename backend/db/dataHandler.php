<?php
include ("./models/appointment.php");
include ("db.php");


class DataHandler
{
    private $conn;
    public function __construct()
    {
        global $conn;
        $this->conn = $conn;
    }
    public function queryAppointments()
    {
        $sql = "SELECT * FROM Appointment";
        $result = $this->conn->query($sql);

        $appointments = array();

        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $appointment = new Appointment($row["title"], $row["location"], $row["date"], $row["expiryDate"]);
                $appointments[] = $appointment->toArray();
            }
        }

        return $appointments;
    }

    public function queryAppointmentById($id)
    {

        $sql = "SELECT * FROM Appointment WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);

        $stmt->execute();
        $result = $stmt->get_result();
        $appointment = NULL;
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $appointment = new Appointment($row["title"], $row["location"], $row["date"], $row["expiryDate"]);
        }
        return $appointment->toArray();
    }
}
