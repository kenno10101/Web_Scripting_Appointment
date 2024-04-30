// Funktion zum Laden der Termine
import { formatDate } from "../utils/date.js";
export function loadAppointments() {
    $.ajax({
        type: "GET",
        url: "../../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointments" },
        dataType: "json",
        beforeSend: function () {
            // Show the loading sign
            $("#appointments_loading").show();
        },
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                createAppointmentList(response);
            }
        },
        complete: function () {
            // Hide the loading sign
            $("#appointments_loading").hide();
        }
    });
}

// Funktion zum Erstellen der Terminliste
export function createAppointmentList(data) {
    // Clear the list first in case it already contains entries
    $("#appointmentList").empty();

    // Loop through the data and add a new list item for each entry
    console.log("Data:");
    console.log(data);
    $.each(data, function (index, appointment) {
        var expiryDate = new Date(appointment.expiryDate);
        var currentDate = new Date();

        // Check if the expiry date is in the past
        var isExpired = expiryDate < currentDate;

        // Add the 'expired' class if the expiry date is in the past
        var rowClass = isExpired ? 'table-secondary' : '';
        $("#appointmentList").append(`
        <tr id='appointment${appointment.id}' class="${rowClass}">
            <td>${appointment.title}</td>
            <td>${appointment.location}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${formatDate(appointment.expiryDate)}</td>
            <td>
                <button class='btn btn-secondary view-btn' id='viewButton${appointment.id}'>View Details</button>
            </td>
        </tr>
    `);
    });
}


// Funktion zum Hinzufügen eines Termins
export function addAppointment(appointment) {
    $.ajax({
        type: "POST",
        url: "../../backend/serviceHandler.php",
        data: JSON.stringify(appointment),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            // Reload the appointments after adding a new one
            loadAppointments();
        }
    });
}

