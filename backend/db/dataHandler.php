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

    public function queryAppointmentOptionsByAppointmentId($id)
    {
        $sql = "SELECT * FROM appointment_options WHERE appointment_fk = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $options = array();

        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $option = new Option($row["options_id"], $row["start_time"], $row["end_time"]);
                $options[] = $option;
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
                $appointmentOptions = $this->queryAppointmentOptionsByAppointmentId($row["id"]);
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
            $appointmentOptions = $this->queryAppointmentOptionsByAppointmentId($row["id"]);
            $appointment = new Appointment($row["id"], $row["title"], $row["location"], $row["date"], $row["expiryDate"], $appointmentOptions);
        }
        return $appointment->toArray();
    }

    public function queryVotingsByAppointmentId($id)
    {
        $sql = "SELECT * FROM appointment_options INNER JOIN voting_list ON appointment_options.options_id = voting_list.option_fk INNER JOIN options_voting ON voting_list.voting_fk = options_voting.voting_id WHERE appointment_fk = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $votings = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $option = new Option($row["options_id"], $row["start_time"], $row["end_time"]);
                if (isset($votings[$row["voting_id"]])) {
                    // If a voting object with this ID already exists, add the option to it
                    $votings[$row["voting_id"]]->addOption($option);
                } else {
                    // If it doesn't exist, create a new voting object
                    $voting = new Voting($row["voting_id"], $row["appointment_fk"], [$option], $row["name"], $row["comment"]);
                    $votings[$row["voting_id"]] = $voting;
                }
            }
        }


        return $votings;
    }

    public function queryAppointmentOptionById($id)
    {



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
        $sql = "INSERT INTO appointment_options (appointment_fk, start_time, end_time) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sss", $timeOption["appointment_id"], $timeOption["start_time"], $timeOption["end_time"]);
        $stmt->execute();
        return $stmt->insert_id;
    }

    public function addVotes($votes)
    {
        $sql = "INSERT INTO options_voting (name, comment) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $votes["name"], $votes["comment"]);
        $stmt->execute();
        $inserted_id = $stmt->insert_id;
        $this->addVoteIntoVotingList($votes["selected_options"], $inserted_id);

        return $inserted_id;
    }
    public function addVoteIntoVotingList($votes, $inserted_id)
    {
        foreach ($votes as $vote) {

            $sql = "INSERT INTO voting_list (voting_fk, option_fk) VALUES (?, ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ii", $inserted_id, $vote["id"]);
            $stmt->execute();
        }

    }

}
