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
                $option = new Option($row["options_id"], $row["start_time"], $row["end_time"]);
                $options[] = $option->toArray();
            }
        }

        return $options;
    }
    public function queryAppointments()
    {

        $sql = "SELECT * FROM appointment";
        $result = $this->conn->query($sql);

        $appointments = array();

        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $appointmentOptions = $this->queryAppointmentOptions($row["id"]);
                $appointment = new Appointment($row["id"], $row["title"], $row["location"], $row["date"], $row["expiryDate"], $appointmentOptions);
                $appointments[] = $appointment->toArray();
            }
        }

        return $appointments;
    }

    public function queryAppointmentById($id)
    {

        $sql = "SELECT * FROM appointment WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);

        $stmt->execute();
        $result = $stmt->get_result();
        $appointment = NULL;
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $appointmentOptions = $this->queryAppointmentOptions($row["id"]);
            $appointment = new Appointment($row["id"], $row["title"], $row["location"], $row["date"], $row["expiryDate"], $appointmentOptions);
        }
        return $appointment->toArray();
    }

    public function addAppointment($appointment)
    {

        $sql = "INSERT INTO appointment (title, location, date, expiryDate) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssss", $appointment["title"], $appointment["location"], $appointment["date"], $appointment["expiryDate"]);

        $stmt->execute();
        return $stmt->insert_id;
    }

    public function addTimeOption($timeOption)
    {
        $sql = "INSERT INTO appointment_options (appointment_id, start_time, end_time) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sss", $timeOption["appointment_id"], $timeOption["start_time"], $timeOption["end_time"]);
        $stmt->execute();
        return $stmt->insert_id;
    }
    public function addVote($vote)
    {
        $sql = "INSERT INTO options_voting (appointment_id, options_id, name, comment) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssss", $vote["appointment_id"], $vote["options_id"], $vote["name"], $vote["comment"]);
        $stmt->execute();
        return $stmt->insert_id;
    }
}
