
export function addVote(optionsVote) {
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


export function loadVotingsByAppointmentId(appointment_id) {
    $.ajax({
        type: "GET",
        url: "../../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryVotingsByAppointmentId", param: appointment_id },
        dataType: "json",
        beforeSend: function () {
            // Show the loading sign
            $("#votings_loading").show();
        },
        success: function (response) {
            console.log(response);
            createVotingsList(response);

        },
        complete: function () {
            // Hide the loading sign
            $("#votings_loading").hide();
        }
    });
}

export function createVotingsList(data) {

    // Loop through the data and add a new list item for each entry
    console.log(data);
    $.each(data, function (index, voting) {

        // Create a new Bootstrap card for each voting
        let votingCard = `
        <div class="card">
            <div class="card-header">
                ${voting.name}
            </div>
            <div class="card-body">
                <h5 class="card-title">${voting.comment}</h5>
                <p class="card-text">gevoted für</p>
                <ul>
    `;

        // Add each option to the card
        for (const option of voting.options) {
            votingCard += `
            <li>
                ${option.start_time} - ${option.end_time}
            </li>
        `;
        }

        votingCard += `
                </ul>
            </div>
        </div>
    `;

        // Append the card to the votings div
        $('#votings').append(votingCard);
    });
}