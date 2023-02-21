// Caricamento dei messaggi dal file JSON
fetch('/db/collection?collection=communityFeed', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(messages => {
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
    document.getElementById("formcontainer" + messageId).style.display = "block";
    document.getElementById(jsonDataid).style.display = "none";
    document.querySelector("formcontainer" + messageId).addEventListener("submit", function(event) {
        event.preventDefault();
        const message = document.getElementById("messageText").value;
        obj = {
            collection: 'communityFeed',
            elem: {
                "description": message
            }
        }
        fetch('/db/element', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        document.getElementById("formcontainer" + messageId).style.display = "none";
        document.getElementById(jsonDataid).style.display = "block";
    });
}

function removeMessage(messageId) {
    // logica per la rimozione del messaggio
    obj = {
        collection: 'communityFeed',
        id: messageId
    }
    fetch('/db/element', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(obj)
    })
}