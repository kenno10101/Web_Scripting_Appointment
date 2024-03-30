//Starting point for JQuery init
$(document).ready(function () {
    $("#appointmentDetails").hide();
    loadAppointments();
});


$("#addAppointmentForm").submit(function (event) {
    event.preventDefault();

    var appointment = {
        method: "addAppointment",
        param: {
            title: $("#title").val(),
            location: $("#location").val(),
            date: $("#date").val(),
            expiryDate: $("#expiryDate").val()
        }
    };

    addAppointment(appointment);
});


$(document).on("click", ".view-btn", function () {
    var index = $(this).closest("tr").attr("id").replace("appointment", "");
    viewAppointment(index);
});


// Funktion zum Hinzufügen einer verfügbaren Zeit
$("#addTimeOption").click(function () {
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var appointmentId = $("#appointmentDetails").data("appointment-id");

    var option = { start_time: startTime, end_time: endTime, appointment_id: appointmentId};

    addTimeOption(option);


});

$("#submitVoting").click(function () {
    var name = $("#name").val();
    var comment = $("#comment").val();
    var selectedTimes = [];

    // Erfassen der ausgewählten Zeiten
    //TODO: fix this
    $(".timeOption:checked").each(function () {
        var startTime = $(this).data('start');
        var endTime = $(this).data('end');
        selectedTimes.push({ startTime: startTime, endTime: endTime });
    });

    // Hier können Sie die Daten weiter verarbeiten, z.B. per AJAX an den Server senden
    console.log("Name:", name);
    console.log("Comment:", comment);
    console.log("Selected Times:", selectedTimes);
});




function loadAppointments() {
    $.ajax({
        type: "GET",
        url: "../../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointments" },
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                createAppointmentList(response);
            }
        }
    });
}

function createAppointmentList(data) {
    // Clear the list first in case it already contains entries
    $("#appointmentList").empty();

    // Loop through the data and add a new list item for each entry
    console.log("Data:");
    console.log(data);
    $.each(data, function (index, appointment) {
        $("#appointmentList").append(`
        <tr id='appointment${index + 1}'>
            <td>${appointment.title}</td>
            <td>${appointment.location}</td>
            <td>${appointment.date}</td>
            <td>${appointment.expiryDate}</td>
            <td>
                <button class='btn btn-secondary view-btn' id='viewButton${index + 1}'>View Details</button>
            </td>
        </tr>
    `);
    });
}


function addAppointment(appointment) {
    $.ajax({
        type: "POST",
        url: "../../backend/serviceHandler.php",
        data: JSON.stringify(appointment),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
            // Reload the appointments after adding a new one
            loadAppointments();
        }
    });
}

function addTimeOption(option) {
    //TODO: Implement AJAX call to add a new time option
    //option has start, end and appointment id
    console.log(option);
}

function viewAppointment(index) {
    // Get the ID of the appointment
    var appointmentId = index; // Replace this with the actual ID if it's not the index

    // Call loadAppointmentById with the ID
    $("#appointmentDetails").fadeIn();
    $("#appointmentDetails").data("appointment-id", index);
    loadAppointmentById(appointmentId);
}

function loadAppointmentById(id) {
    $.ajax({
        type: "GET",
        url: "../../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointmentById", param: id },
        dataType: "json",
        success: function (response) {

            // Display the appointment details
            createAppointmentDetails(response);
        }
    });
}

function createAppointmentDetails(appointment) {
    console.log(appointment);
    $("#availableTimesList").empty();

    $("#appointmentTitle").text(appointment.title);
    $("#appointmentLocation").text(appointment.location);
    $("#appointmentDate").val(appointment.date);
    $("#appointmentExpiryDate").val(appointment.expiryDate);

    // Loop through the available times and add a new list item for each entry
    if (appointment.options.length == 0) {
        $("#availableTimesList").append(`
        <tr><td>No available times</td><td></td><td></td></tr>     `);
    } else {
        $.each(appointment.options, function (index, time) {
            $("#availableTimesList").append(`
                <tr id='time${index + 1}'>
                    <td>${time.start_time}</td>
                    <td>${time.end_time}</td>
                    <td><input type='checkbox' class='timeOption'></input></td>
                </tr>     
            `);
        });
    }
}