import { loadAppointments } from "./appointments/appointments.js";
import { addAppointment } from "./appointments/appointments.js";
import { loadAppointmentById } from "./appointments/appointmentDetails.js";
import { addAppointmentOption } from "./appointments/appointmentDetails.js";
import { viewAppointment } from "./appointments/appointmentDetails.js";
import { addVote, loadVotingsByAppointmentId, createVotingsList } from "./votings/votings.js";
import { resetAppointmentOptionForm, resetSubmitVotingForm, resetAppointmentForm, closeAllAccordions, resetAppointmentDetails } from "./utils/reset.js";

//Starting point for JQuery init
$(document).ready(function () {
    $("#appointmentDetails").hide();
    loadAppointments();
});

// Funktion zum Hinzufügen eines Termins
$("#addAppointmentForm").submit(function (event) {
    event.preventDefault();
    var title = $("#title").val();
    var location = $("#location").val();
    var date = $("#date").val();
    var expiryDate = $("#expiryDate").val();

    // Error Handling (Felder dürfen nicht leer sein und das Ablaufdatum darf nicht nach dem Termin liegen)
    if (title.trim() == "" || location.trim() == "" || date.trim() == "" || expiryDate.trim() == "") {
        $("#error_appointment").text("Input is required.");
        title.trim() == "" ? $("#title").addClass("is-invalid") : $("#title").removeClass("is-invalid");
        location.trim() == "" ? $("#location").addClass("is-invalid") : $("#location").removeClass("is-invalid");
        date.trim() == "" ? $("#date").addClass("is-invalid") : $("#date").removeClass("is-invalid");
        expiryDate.trim() == "" ? $("#expiryDate").addClass("is-invalid") : $("#expiryDate").removeClass("is-invalid");
        return;
    }
    if (expiryDate > date) {
        $("#error_appointment").text("Voting Expiry Date cannot be after Appointment Date.");
        title.trim() == "" ? $("#title").addClass("is-invalid") : $("#title").removeClass("is-invalid");
        location.trim() == "" ? $("#location").addClass("is-invalid") : $("#location").removeClass("is-invalid");
        expiryDate > date ? ($("#date").addClass("is-invalid"), $("#expiryDate").addClass("is-invalid")) : ($("#date").removeClass("is-invalid"), $("#expiryDate").removeClass("is-invalid"));
        return;
    }

    // Erstellen des Termins als Objekt und Aufruf der Methode zum Hinzufügen
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

// Funktion zum Anzeigen der Termindetails
var currentBtn;
var detailsOpen = false;
$(document).on("click", ".view-btn", function () {
    var index = $(this).closest("tr").attr("id").replace("appointment", "");
    viewAppointment(index);

    // Setzt Klassen und Text zurück des voherigen Hide Buttons
    detailsOpen == true ? (currentBtn.removeClass("hide-btn"), currentBtn.addClass("view-btn"), currentBtn.text("View Details")) : (detailsOpen = true);
    currentBtn = $(this);
    $("#detailsHidden").removeClass("col-lg");
    currentBtn.removeClass("view-btn");
    currentBtn.addClass("hide-btn");
    currentBtn.text("Hide Details");
});

// Funktion zum Ausblenden der Termindetails
$(document).on("click", ".hide-btn", function () {
    detailsOpen = false;
    $("#detailsHidden").addClass("col-lg");
    $(this).addClass("view-btn");
    $(this).removeClass("hide-btn");
    $(this).text("View Details");
    $("#appointmentDetails").hide();
});


// Funktion zum Hinzufügen einer verfügbaren Zeit
$("#submitAppointmentOption").click(function () {
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();

    // Error Handling (Felder dürfen nicht leer sein und die Startzeit darf nicht nach der Endzeit liegen)
    if (startTime.trim() == "" || endTime.trim() == "") {
        $("#error_appointmentOption").text("Input is required.");
        startTime.trim() == "" ? $("#startTime").addClass("is-invalid") : $("#startTime").removeClass("is-invalid");
        endTime.trim() == "" ? $("#endTime").addClass("is-invalid") : $("#endTime").removeClass("is-invalid");
        return;
    }

    if (startTime > endTime) {
        $("#error_appointmentOption").text("Start time cannot be after End time.");
        startTime > endTime ? ($("#startTime").addClass("is-invalid"), $("#endTime").addClass("is-invalid")) : ($("#startTime").removeClass("is-invalid"), $("#endTime").removeClass("is-invalid"));
        return;
    }

    // Erstellen der Zeitoption als Objekt und Aufruf der Methode zum Hinzufügen
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



// Funktion zum Abschicken der Voting(s) mit Name und Kommentar
$("#submitVoting").click(function () {
    var name = $("#name").val();
    var comment = $("#comment").val();

    // Error Handling (Felder dürfen nicht leer sein und mindestens eine Zeitoption muss ausgewählt sein)
    if (name == "" || $(".appointmentOption:checked").length == 0) {
        $("#error_submitVoting").text("Input is required.");
        name == "" ? $("#name").addClass("is-invalid") : $("#name").removeClass("is-invalid");
        $(".appointmentOption:checked").length == 0 ? $("#error_votingCheckbox").text("Please select at least one time option.") : $("#error_votingCheckbox").text("");

        return;
    }

    var appointment_id = $("#appointmentDetails").data("appointment-id");
    var selectedTimes = [];

    // Erfassen der ausgewählten Zeiten und jeweils die Methode zum Einfügen aufrufen mit unterschiedlicher Zeit
    $(".appointmentOption:checked").each(function () {
        var time_id = $(this).closest("tr").attr("id").replace("time", "");
        selectedTimes.push({ id: time_id });
    });
    var optionsVote = {
        method: "addVotes",
        param: {
            name: name,
            selected_options: selectedTimes,
            comment: comment,
        }
    };
    console.log("Options Vote:", optionsVote);

    addVote(optionsVote);
    resetSubmitVotingForm();

    var myCollapse = document.getElementsByClassName('collapse')[1];
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
        toggle: true
    });
});



$('#toggleVotingsButton').on('click', function () {
    $('#votings').empty();
});

$('#votingsAccordion').on('shown.bs.collapse', function () {
    var appointment_id = $("#appointmentDetails").data("appointment-id");

    console.log("Appointment ID:", appointment_id);
    loadVotingsByAppointmentId(appointment_id);
});