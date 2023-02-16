/*import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
            super(params);
            this.setTitle("bacheca");
        }
            async getHtml() {
                return `
                    <h1>Bacheca</h1>
                    <p>Tutti i messaggi dei nostri clienti!</p>
                `;
}
            }*/

// Caricamento dei messaggi dal file JSON
$.getJSON("bacheca.json", function(messages) {
    // Iterazione attraverso tutti i messaggi
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        // Creazione della card per ogni messaggio
        var card = `
        <div class="card mb-3">
          <div class="card-header">
            <h5>` + message.senderName + `</h5>
          </div>
          <div class="card-body">
            <h5 class="card-title">` + message.title + `</h5>
            <p class="card-text">` + message.text + `</p>
            <p>Reference Product: ` + message.product + `</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-warning" onclick="editMessage(` + message.id + `)">Edit</button>
            <button class="btn btn-danger" onclick="deleteMessage(` + message.id + `)">Remove</button>
          </div>
        </div>
      `;
        // Aggiunta della card al container
        $("#messageContainer").append(card);
    }
});

function editMessage(messageId) {
    // logica per la modifica delle informazioni del cliente
}

function removeMessage(messageId) {
    // logica per la rimozione del cliente
}