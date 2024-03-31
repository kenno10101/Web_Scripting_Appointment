<?php
class Appointment
{
    private $id;
    private $title;
    private $location;
    private $date;
    private $expiryDate; // Ablaufdatum des Votings
    private $options;

    public function toArray()
    {
        return [
            "id" => $this->id,
            'title' => $this->title,
            'location' => $this->location,
            'date' => $this->date,
            'expiryDate' => $this->expiryDate,
            'options' => $this->options,
        ];
    }

    public function __construct($id, $title, $location, $date, $expiryDate, $options)
    {
        $this->id = $id;
        $this->title = $title;
        $this->location = $location;
        $this->date = $date;
        $this->expiryDate = $expiryDate;
        $this->options = $options;
    }

}

class Option
{
    private $id;
    private $start_time;
    private $end_time;

    public function toArray()
    {
        return [
            'id' => $this->id,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
        ];
    }

    public function __construct($id, $start_time, $end_time)
    {
        $this->id = $id;
        $this->start_time = $start_time;
        $this->end_time = $end_time;
    }

}
?>