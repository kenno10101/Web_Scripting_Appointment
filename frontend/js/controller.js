//Starting point for JQuery init
$(document).ready(function () {
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
        $("#appointmentList").append("<li><p id='appointment" + index + 1 + "'>" + appointment.title + " " + appointment.location + " " + appointment.date + " " + appointment.expiryDate + "</p><button id='viewButton" + index + 1 + "' onclick='viewAppointment(" + (index + 1) + ")'>View</button></li>");
    });
}

function viewAppointment(index) {
    // Get the ID of the appointment
    var appointmentId = index; // Replace this with the actual ID if it's not the index

    // Call loadAppointmentById with the ID
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
    $("#appointmentDetails").empty();

    // Create a new list item for each detail
    $("#appointmentDetails").append("<li>Title: " + appointment.title + "</li>");
    $("#appointmentDetails").append("<li>Location: " + appointment.location + "</li>");
    $("#appointmentDetails").append("<li>Date: " + appointment.date + "</li>");
    $("#appointmentDetails").append("<li>Expiry Date: " + appointment.expiryDate + "</li>");
}