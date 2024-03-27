<?php
class Appointment
{
    private $id;
    private $title;
    private $location;
    private $date;
    private $expiryDate; // Ablaufdatum des Votings

    public function toArray()
    {
        return [
            'title' => $this->title,
            'location' => $this->location,
            'date' => $this->date,
            'expiryDate' => $this->expiryDate,
        ];
    }

    public function __construct($title, $location, $date, $expiryDate)
    {
        $this->title = $title;
        $this->location = $location;
        $this->date = $date;
        $this->expiryDate = $expiryDate;
    }

}
?>