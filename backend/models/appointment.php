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
            'title' => $this->title,
            'location' => $this->location,
            'date' => $this->date,
            'expiryDate' => $this->expiryDate,
            'options' => $this->options,
        ];
    }

    public function __construct($title, $location, $date, $expiryDate, $options)
    {
        $this->title = $title;
        $this->location = $location;
        $this->date = $date;
        $this->expiryDate = $expiryDate;
        $this->options = $options;
    }

}

class Option
{
    private $start_time;
    private $end_time;

    public function toArray()
    {
        return [
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
        ];
    }

    public function __construct($start_time, $end_time)
    {
        $this->start_time = $start_time;
        $this->end_time = $end_time;
    }

}
?>