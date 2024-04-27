import { resetAppointmentOptionForm, resetAppointmentDetails, resetSubmitVotingForm, closeAllAccordions } from "../utils/reset.js";
import { formatDate } from "../utils/date.js";

// Funktion zum Laden eines Termins anhand der ID
export function loadAppointmentById(id) {
    $.ajax({
        type: "GET",
        url: "../../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointmentById", param: id },
        dataType: "json",
        beforeSend: function () {

            resetAppointmentOptionForm();
            resetAppointmentDetails();

            $("#appointmentDetails_loading").show();

        },
        success: function (response) {
            // Display the appointment details
            createAppointmentDetails(response);
        },
        complete: function () {
            // Hide the loading sign
            $("#appointmentDetails_loading").hide();
        }
    });
}

// Funktion zum Erstellen der Termindetails
export function createAppointmentDetails(appointment) {
    console.log("Appointment:");
    console.log(appointment);
    $("#appointmentTitle").text(appointment.title);
    $("#appointmentLocation").text(appointment.location);
    $("#appointmentDate").text(formatDate(appointment.date));
    $("#appointmentExpiryDate").text(formatDate(appointment.expiryDate));

    var currentDate = new Date();
    var expiryDate = new Date(appointment.expiryDate);

    var isExpired = expiryDate < currentDate;
    console.log(isExpired);

    if (isExpired) {
        $('#timeOptionAccordion').hide();
    } else {
        $('#timeOptionAccordion').show();
    }


    // Loop through the available times and add a new list item for each entry
    if (appointment.options.length == 0) {
        $("#availableAppointmentOptions").append(`
        <tr><td>No available times</td><td></td><td></td></tr>     `);
    } else {
        $("#availableAppointmentOptions").empty();
        $.each(appointment.options, function (index, time) {

            var checkboxHtml = isExpired ? 'Expired' : "<input type='checkbox' class='appointmentOption'></input>";

            $("#availableAppointmentOptions").append(`
                <tr id='time${time.id}'>
                    <td>${time.start_time}</td>
                    <td>${time.end_time}</td>
                    <td>${checkboxHtml}</td>
                </tr>     
            `);
        });
    }
}

export function viewAppointment(index) {
    // Get the ID of the appointment

    resetAppointmentOptionForm();
    resetSubmitVotingForm();
    closeAllAccordions();

    // Call loadAppointmentById with the ID
    $("#appointmentDetails").fadeIn();
    $("#appointmentDetails").data("appointment-id", index);
    loadAppointmentById(index);
}

export function addAppointmentOption(appointmentOption) {
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

