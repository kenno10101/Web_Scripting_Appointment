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

    public function queryAppointmentOptions($id)
    {
        $sql = "SELECT * FROM appointment_options WHERE appointment_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $options = array();

        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $option =  new Option($row["start_time"], $row["end_time"]);
                $options[] = $option->toArray();
            }
        }

        return $options;
    }
    public function queryAppointments()
    {

        $sql = "SELECT * FROM Appointment";
        $result = $this->conn->query($sql);

        $appointments = array();

        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $appointmentOptions = $this->queryAppointmentOptions($row["id"]);
                $appointment = new Appointment($row["title"], $row["location"], $row["date"], $row["expiryDate"], $appointmentOptions);
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
            $appointmentOptions = $this->queryAppointmentOptions($row["id"]);
            $appointment = new Appointment($row["title"], $row["location"], $row["date"], $row["expiryDate"], $appointmentOptions);
        }
        return $appointment->toArray();
    }

    public function addAppointment($appointment)
    {

        $sql = "INSERT INTO Appointment (title, location, date, expiryDate) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssss", $appointment["title"], $appointment["location"], $appointment["date"], $appointment["expiryDate"]);

        $stmt->execute();
        return $stmt->insert_id;
    }
}
