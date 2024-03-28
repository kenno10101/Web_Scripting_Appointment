//Starting point for JQuery init
$(document).ready(function () {
    $("#appointmentDetails").hide();
    loadAppointments();
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
        $("#appointmentList").append("<tr id='appointment" + (index + 1) + "'><td>" + appointment.title + "</td><td>" + appointment.location + "</td><td>" + appointment.date + "</td><td>" + appointment.expiryDate + "</td><td><button class='btn btn-secondary' id='viewButton" + (index + 1) + "' onclick='viewAppointment(" + (index + 1) + ")'>View Details</button></td></tr>");
    });
}

function viewAppointment(index) {
    // Get the ID of the appointment
    var appointmentId = index; // Replace this with the actual ID if it's not the index

    // Call loadAppointmentById with the ID
    $("#appointmentDetails").fadeIn();
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
            console.log(response);

            // Display the appointment details
            createAppointmentDetails(response);
        }
    });
}

function createAppointmentDetails(appointment) {
    // Clear the details in case they already contain data
    $("#appointmentDetailsList").empty();


    // Create a new list item for each detail
    $("#appointmentDetailsDescription").append("<li>Title: " + appointment.title + "</li>");
    $("#appointmentDetailsDescription").append("<li>Location: " + appointment.location + "</li>");
    $("#appointmentDetailsDescription").append("<li>Date: " + appointment.date + "</li>");
    $("#appointmentDetailsDescription").append("<li>Expiry Date: " + appointment.expiryDate + "</li>");

    // Create a list for appointment options
    for (let i = 0; i < appointment.options.length; i++) {
        $("#appointmentDetailsList").append("<tr><td>Start Time: " + appointment.options[i].start_time + "</td><td>End Time: " + appointment.options[i].end_time + "</td><td><input type='checkbox' id='voteBox" + (i + 1) + "' onclick='voteOption(" + (i + 1) + ")'></td></tr>");
    }
    $.each(appointment.options, function (appointment) {
        $("#appointmentDetailsList").append("<li>Start Time: " + appointment.options[i].start_time + "<input type='checkbox' name='' id=''></li>");
        $("#appointmentDetailsList").append("<li>End Time: " + appointment.options[i].end_time + "<input type='checkbox' name='' id=''></li>");
    });
}