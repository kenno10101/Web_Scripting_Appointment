//Starting point for JQuery init
$(document).ready(function () {
    $("#appointmentDetails").hide();
    loadAppointments();
});


// Funktion zum Laden der Termine
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

// Funktion zum Laden eines Termins anhand der ID
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

// Funktion zum Erstellen der Terminliste
function createAppointmentList(data) {
    // Clear the list first in case it already contains entries
    $("#appointmentList").empty();

    // Loop through the data and add a new list item for each entry
    console.log("Data:");
    console.log(data);
    $.each(data, function (index, appointment) {
        $("#appointmentList").append(`
        <tr id='appointment${appointment.id}'>
            <td>${appointment.title}</td>
            <td>${appointment.location}</td>
            <td>${appointment.date}</td>
            <td>${appointment.expiryDate}</td>
            <td>
                <button class='btn btn-secondary view-btn' id='viewButton${appointment.id}'>View Details</button>
            </td>
        </tr>
    `);
    });
}

// Funktion zum Erstellen der Termindetails
function createAppointmentDetails(appointment) {
    console.log("Appointment:");
    console.log(appointment);
    $("#availableAppointmentOptions").empty();

    $("#appointmentTitle").text(appointment.title);
    $("#appointmentLocation").text(appointment.location);
    $("#appointmentDate").val(appointment.date);
    $("#appointmentExpiryDate").val(appointment.expiryDate);

    // Loop through the available times and add a new list item for each entry
    if (appointment.options.length == 0) {
        $("#availableAppointmentOptions").append(`
        <tr><td>No available times</td><td></td><td></td></tr>     `);
    } else {
        $.each(appointment.options, function (index, time) {
            $("#availableAppointmentOptions").append(`
                <tr id='time${time.id}'>
                    <td>${time.start_time}</td>
                    <td>${time.end_time}</td>
                    <td><input type='checkbox' class='appointmentOption'></input></td>
                </tr>     
            `);
        });
    }
}


// Funktion zum Hinzufügen eines Termins
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
    resetAppointmentForm();
});


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

// Funktion zum Anzeigen der Termindetails
$(document).on("click", ".view-btn", function () {
    var index = $(this).closest("tr").attr("id").replace("appointment", "");
    viewAppointment(index);
});


function viewAppointment(index) {
    // Get the ID of the appointment

    resetAppointmentOptionForm();
    resetSubmitVotingForm();

    // Call loadAppointmentById with the ID
    $("#appointmentDetails").fadeIn();
    $("#appointmentDetails").data("appointment-id", index);
    loadAppointmentById(index);
}


// Funktion zum Hinzufügen einer verfügbaren Zeit
$("#submitAppointmentOption").click(function () {
    startTime = $("#startTime").val();
    endTime = $("#endTime").val();

    if (startTime.trim() == "" || endTime.trim() == "") {
        $("#error_appointmentOption").text("Input is required.");
        startTime.trim() == "" ? $("#startTime").addClass("is-invalid") : $("#startTime").removeClass("is-invalid");
        endTime.trim() == "" ? $("#endTime").addClass("is-invalid") : $("#endTime").removeClass("is-invalid");
        return;
    }


    var appointmentOption = {
        method: "addAppointmentOption",
        param: {
            start_time: $("#startTime").val(),
            end_time: $("#endTime").val(),
            appointment_id: $("#appointmentDetails").data("appointment-id")
        }
    };
    addAppointmentOption(appointmentOption);
    resetAppointmentOptionForm();
});


function addAppointmentOption(appointmentOption) {
    //timeSlot has start, end and appointment id
    $.ajax({
        type: "POST",
        url: "../../backend/serviceHandler.php",
        data: JSON.stringify(appointmentOption),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            loadAppointmentById(appointmentOption.param.appointment_id);
        }
    });
}

// Funktion zum Abschicken der Voting(s) mit Name und Kommentar
$("#submitVoting").click(function () {
    var name = $("#name").val();
    var comment = $("#comment").val();

    if (name == "" || comment == "" || $(".appointmentOption:checked").length == 0) {
        $("#error_submitVoting").text("Input is required.");
        name == "" ? $("#name").addClass("is-invalid") : $("#name").removeClass("is-invalid");
        comment == "" ? $("#comment").addClass("is-invalid") : $("#comment").removeClass("is-invalid");
        $(".appointmentOption:checked").length == 0 ? $("#error_votingCheckbox").text("Please select at least one time option.") : $("#error_votingCheckbox").text("");

        return;
    }

    var appointment_id = $("#appointmentDetails").data("appointment-id");
    var selectedTimes = [];


    // Erfassen der ausgewählten Zeiten und jeweils die Methode zum Einfügen aufrufen mit unterschiedlicher Zeit
    $(".appointmentOption:checked").each(function () {
        var time_id = $(this).closest("tr").attr("id").replace("time", "");
        selectedTimes.push({ id: time_id });

        var optionsVote = {
            method: "addVote",
            param: {
                name: name,
                options_id: time_id,
                appointment_id: appointment_id,
                comment: comment
            }
        };
        addVote(optionsVote);
    });

    console.log("Appointment ID:", appointment_id);
    console.log("Name:", name);
    console.log("Comment:", comment);
    console.log("Selected Times:", selectedTimes);

    resetSubmitVotingForm();


});

function addVote(optionsVote) {
    //vote has name, comment, appointment_id and option_id
    $.ajax({
        type: "POST",
        url: "../../backend/serviceHandler.php",
        data: JSON.stringify(optionsVote),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            loadAppointmentById(optionsVote.param.appointment_id);
        }
    });
}


function resetAppointmentOptionForm() {
    $("#startTime").val("");
    $("#endTime").val("");
    $("#startTime").removeClass("is-invalid");
    $("#endTime").removeClass("is-invalid");
    $("#error_appointmentOption").text("");
}


function resetSubmitVotingForm() {
    $("#name").val("");
    $("#comment").val("");
    $("#name").removeClass("is-invalid");
    $("#comment").removeClass("is-invalid");
    $("#error_submitVoting").text("");
    $("#error_votingCheckbox").text("");
}

function resetAppointmentForm() {
    $("#title").val("");
    $("#location").val("");
    $("#date").val("");
    $("#expiryDate").val("");
}














