// Caricamento dei messaggi dal file JSON
fetch('http://localhost:8000/db/collection?collection=communityFeed', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(messages => {
        messages = messages.result;
        var res = [];
        // Iterazione attraverso tutti i messaggi
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            var response = message.answers;
            // Creazione della card per ogni messaggio
            var card = `
        <div class="card mb-3" id="` + message._id + `">
          <div class="card-header">
            <h5>` + message.author + `</h5>
          </div>
          <div class="card-body">
            <h5 class="card-title">` + message.title + `</h5>
            <p class="card-text" id="messageText` + message.author + `">` + message.description + `</p>
            <img class="card-img-top" src="` + message.file + `" alt="` + message.author + `" style="width: 18rem;">
            <p>Reference Date: ` + message.date + `</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-warning" onclick="editMessage(` + message._id + `)">Edit</button>
            <button class="btn btn-danger" onclick="deleteMessage(` + message._id + `)">Remove</button>
            <button class="btn btn-danger" onclick="deleteImage(` + message._id + `)">Remove Image</button>
          </div>
          <div class="container mt-5" id="responseContainer"></div>
          <div class="container" id="formcontainer` + message._id + `" style="display:none">
            <form class="form form--hidden" id="editMessageForm` + message._id + `">
                <div class="form-group">
                    <label for="scoreInput">Message</label>
                    <textarea class="form-control" id="newMessage` + message._id + `">` + message.description + `</textarea>
                </div>
                <button type="submit" class="btn btn-primary" id="saveClient">Save</button>
            </form>
        </div>
        </div>
      `;
            response.forEach((element, j) => {
                res[j] = `
        <div class="card mb-3" id="` + element._id + `">
          <div class="card-header">
            <h5>` + element.author + `</h5>
          </div>
          <div class="card-body">
            <h5 class="card-title">` + element.author + `</h5>
            <p class="card-text" id="messageText` + element.author + `">` + element.description + `</p>
            <img class="card-img-top" src="` + element.file + `" alt="` + element.file + `" style="width: 18rem;">
            <p>Date: ` + element.date + `</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-warning" onclick="editMessage(` + element._id + `)">Edit</button>
            <button class="btn btn-danger" onclick="deleteMessage(` + element._id + `)">Remove</button>
            <button class="btn btn-danger" onclick="deleteImage(` + element._id + `)">Remove Image</button>
          </div>
          <div class="container mt-5" id="responseContainer"></div>
          <div class="container" id="formcontainer` + element._id + `" style="display:none">
            <form class="form form--hidden" id="editMessageForm` + element._id + `">
                <div class="form-group">
                    <label for="scoreInput">Message</label>
                    <input type="text" class="form-control" id="newMessage` + element._id + `" value="` + element.description + `">
                </div>
                <button type="submit" class="btn btn-primary" id="saveClient">Save</button>
            </form>
        </div>
        </div>
        </div>
      `;
            });
            // Aggiunta della card al container
            $("#messageContainer").append(card);
            for (var i = 0; i < res.length; i++) {
                //aggiunta delle risposte alla card
                $("#responseContainer").append(res[i]);
            }
        }
    });

function deleteImage(messageId) {
    fetch('http://localhost:8000/db/element?id=' + messageId + '&collection=communityFeed', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            let date = data.availability;
            date.push(newDate);
            let obj = {
                collection: 'communityFeed',
                elem: {
                    "_id": JSON.stringify(data._id),
                    "author": JSON.stringify(data.author),
                    "title": JSON.stringify(data.title),
                    "description": JSON.stringify(message),
                    "file": "",
                    "date": JSON.stringify(data.date),
                    "answers": data.answers
                }
            }
            fetch('http://localhost:8000/db/element', {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(obj)
                })
                .then(() => {
                    location.reload();
                })
        });
}

function editMessage(messageId) {
    // logica per la modifica delle informazioni del cliente
    document.getElementById("formcontainer" + messageId).style.display = "block";
    document.getElementById(jsonDataid).style.display = "none";
    document.querySelector("formcontainer" + messageId).addEventListener("submit", function(event) {
        event.preventDefault();
        const message = document.getElementById("newMessage" + messageId).value;
        fetch('http://localhost:8000/db/element?id=' + messageId + '&collection=communityFeed', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                let date = data.availability;
                date.push(newDate);
                let obj = {
                    collection: 'communityFeed',
                    elem: {
                        "_id": JSON.stringify(data._id),
                        "author": data.author,
                        "title": data.title,
                        "description": JSON.stringify(message),
                        "file": data.img,
                        "date": data.date,
                        "answers": data.answers
                    }
                }
                fetch('http://localhost:8000/db/element', {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(obj)
                    })
                    .then(() => {
                        location.reload();
                    })
            })
        document.getElementById("formcontainer" + messageId).style.display = "none";
        document.getElementById(jsonDataid).style.display = "block";
    });
}

function removeMessage(messageId) {
    // logica per la rimozione del messaggio
    let obj = {
        collection: 'communityFeed',
        id: JSON.stringify(messageId)
    }
    fetch('http://localhost:8000/db/element', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        .then(() => {
            location.reload();
        })
}