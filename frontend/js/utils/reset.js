//TODO: outsource in Utils file

export function resetAppointmentDetails() {
    $("#appointmentTitle").empty();
    $("#appointmentLocation").empty();
    $("#appointmentDate").val("");
    $("#appointmentExpiryDate").val("");
    $("#availableAppointmentOptions").empty();
    $("#error_appointmentOption").text("");
}

export function resetAppointmentOptionForm() {
    $("#startTime").val("");
    $("#endTime").val("");
    $("#startTime").removeClass("is-invalid");
    $("#endTime").removeClass("is-invalid");
    $("#error_appointmentOption").text("");
}


export function resetSubmitVotingForm() {
    $("#name").val("");
    $("#comment").val("");
    $("#name").removeClass("is-invalid");
    $("#comment").removeClass("is-invalid");
    $("#error_submitVoting").text("");
    $("#error_votingCheckbox").text("");
}

export function resetAppointmentForm() {
    $("#title").val("");
    $("#location").val("");
    $("#date").val("");
    $("#expiryDate").val("");
}

export function closeAllAccordions() {
    $('#votings').empty();
    $('.collapse').collapse('hide');

}
