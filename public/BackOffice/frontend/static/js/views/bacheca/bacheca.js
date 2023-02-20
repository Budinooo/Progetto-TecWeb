// Caricamento dei messaggi dal file JSON
$.getJSON("bacheca.json", function(messages) {
    // Iterazione attraverso tutti i messaggi
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        // Creazione della card per ogni messaggio
        var card = `
        <div class="card mb-3" id="` + message.id + `">
          <div class="card-header">
            <h5>` + message.senderName + `</h5>
          </div>
          <div class="card-body">
            <h5 class="card-title">` + message.title + `</h5>
            <p class="card-text" id="messageText">` + message.text + `</p>
            <p>Reference Product: ` + message.product + `</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-warning" onclick="editMessage(` + message.id + `)">Edit</button>
            <button class="btn btn-danger" onclick="deleteMessage(` + message.id + `)">Remove</button>
          </div>
          <div class="container" id="formcontainer` + message.id + `" style="display:none">
            <form class="form form--hidden" id="editMessageForm">
                <div class="form-group">
                    <label for="scoreInput">Message</label>
                    <input type="text" class="form-control" id="newMessage">
                </div>
                <button type="submit" class="btn btn-primary" id="saveClient">Save</button>
            </form>
        </div>
        </div>
      `;
        // Aggiunta della card al container
        $("#messageContainer").append(card);
    }
});

function editMessage(messageId) {
    // logica per la modifica delle informazioni del cliente
    /*
    document.getElementById("name").value = "Name: " + "jsonData.name";
    document.getElementById("favorites").innerHTML = "Favorite Animals: " + "jsonData.favorites";
    document.getElementById("score").innerHTML = "Game Score: " + "jsonData.score";
    */
    fetch('bacheca.json')
        .then(response => response.json())
        .then(data => {
            // ricerca dell'utente nel file JSON
            const jsonData = data.find(u => u.id === messageId);
        });
    document.getElementById("formcontainer" + messageId).style.display = "block";
    document.getElementById(jsonDataid).style.display = "none";
    /*
        document.getElementById("editButton").addEventListener("click", function() {
            document.getElementById("formcontainer").style.display = "block";
            document.getElementById(jsonData.id).style.display = "none";
            document.getElementById("nameInput").value = jsonData.name;
            document.getElementById("favoritesInput").value = jsonData.favorites;
            document.getElementById("scoreInput").value = jsonData.score;
        });
    */
    document.querySelector("form").addEventListener("submit", function(event) {
        //event.preventDefault();
        jsonData.message = document.getElementById("messageText").value;
        //document.getElementById("jsonData").style.display = "block";
        document.getElementById("formcontainer" + messageId).style.display = "none";
        document.getElementById(jsonDataid).style.display = "block";
        /*
        document.getElementById("name").innerHTML = "Nome: " + jsonData.name;
        document.getElementById("favorites").innerHTML = "Animali preferiti: " + jsonData.favorites;
        document.getElementById("score").innerHTML = "Punteggio: " + jsonData.score;
        */
    });
}

function removeMessage(messageId) {
    // logica per la rimozione del cliente
}