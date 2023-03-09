// Caricamento dei messaggi dal file JSON
fetch('/db/collection?collection=communityFeed', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(messages => {
        messages = messages.result;
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
            <button class="btn btn-danger" onclick="removeMessage(` + message._id + `)">Remove</button>
            <button class="btn btn-danger" onclick="deleteImage(` + message._id + `)">Remove Image</button>
          </div>
          <div class="container" id="formcontainer` + message._id + `" style="display:none">
            <form class="form form--hidden" id="editMessageForm` + message._id + `">
                <div class="form-group">
                    <label for="scoreInput">Message</label>
                    <textarea class="form-control" id="newMessage` + message._id + `">` + message.description + `</textarea>
                </div>
                <button type="submit" class="btn btn-primary" id="saveEdit` + message._id + `">Save</button>
            </form>
        </div>
        <div class="container mt-5" id="responseContainer"></div>
        </div>
      `;

            // Aggiunta della card al container
            $("#messageContainer").append(card);
            for (var j = 0; j < response.length; j++) {
                var element = response[j];
                var res = `
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
            <button class="btn btn-warning" onclick="editAnswer(` + element._id + `, ` + message._id + `,` + j + `)">Edit</button>
            <button class="btn btn-danger" onclick="removeAnswer(` + message._id + `,` + j + `)">Remove</button>
            <button class="btn btn-danger" onclick="deleteAnswerImage(` + message._id + `,` + j + `)">Remove Image</button>
          </div>
          <div class="container mt-5" id="responseContainer"></div>
          <div class="container" id="formcontainer` + element._id + `" style="display:none">
            <form class="form form--hidden" id="editMessageForm` + element._id + `">
                <div class="form-group">
                    <label for="scoreInput">Message</label>
                    <input type="text" class="form-control" id="newMessage` + element._id + `" value="` + element.description + `">
                </div>
                <button type="submit" class="btn btn-primary" id="saveEdit` + element._id + `">Save</button>
            </form>
        </div>
        </div>
        </div>
      `;

                $("#responseContainer").append(res);
            };
        }
    });

function deleteImage(messageId) {
    fetch('/db/element?id=' + messageId + '&collection=communityFeed', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            //let date = data.availability;
            //date.push(newDate);
            let obj = {
                collection: 'communityFeed',
                elem: {
                    "_id": JSON.stringify(data._id),
                    "author": data.author,
                    "title": data.title,
                    "description": data.description,
                    "file": "",
                    "date": data.date,
                    "answers": data.answers
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
                .then(() => {
                    location.reload();
                })
        });
}

function editMessage(messageId) {
    // logica per la modifica delle informazioni del cliente
    if (document.getElementById("formcontainer" + messageId).style.display == "none") {
        document.getElementById("formcontainer" + messageId).style.display = "block";
    } else if (document.getElementById("formcontainer" + messageId).style.display == "block") {
        document.getElementById("formcontainer" + messageId).style.display = "none";
    }
    document.getElementById("saveEdit" + messageId).addEventListener("click", e => {
        e.preventDefault();
        const message = document.getElementById("newMessage" + messageId).value;
        fetch('/db/element?id=' + messageId + '&collection=communityFeed', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                console.log(data);
                //let date = data.availability;
                //date.push(newDate);
                let obj = {
                    collection: 'communityFeed',
                    elem: {
                        "_id": JSON.stringify(messageId),
                        "author": data.author,
                        "title": data.title,
                        "description": document.getElementById("newMessage" + messageId).value,
                        "file": data.img,
                        "date": data.date,
                        "answers": data.answers
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
                    .then(() => {
                        location.reload();
                    })
            })
        document.getElementById("formcontainer" + messageId).style.display = "none";
    });
}

function removeMessage(messageId) {
    // logica per la rimozione del messaggio
    let obj = {
        collection: 'communityFeed',
        id: JSON.stringify(messageId)
    }
    fetch('/db/element', {
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

//////answers
function deleteAnswerImage(messageId, answerPos) {
    fetch('/db/element?id=' + messageId + '&collection=communityFeed', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            let answer = data.answers;
            var mes = answer[answerPos];
            answer.splice(answerPos, 1);
            mes.file = "";
            answer.push(mes)
            let obj = {
                collection: 'communityFeed',
                elem: {
                    "_id": JSON.stringify(messageId),
                    "author": data.author,
                    "title": data.title,
                    "description": data.description,
                    "file": data.img,
                    "date": data.date,
                    "answers": answer
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
                .then(() => {
                    location.reload();
                })
        })
}

function editAnswer(answerId, messageId, answerPos) {
    // logica per la modifica delle informazioni del cliente
    if (document.getElementById("formcontainer" + answerId).style.display == "none") {
        document.getElementById("formcontainer" + answerId).style.display = "block";
    } else if (document.getElementById("formcontainer" + answerId).style.display == "block") {
        document.getElementById("formcontainer" + answerId).style.display = "none";
    }
    //document.getElementById(jsonDataid).style.display = "none";
    document.getElementById("saveEdit" + answerId).addEventListener("click", e => {
        e.preventDefault();
        const message = document.getElementById("newMessage" + answerId).value;
        fetch('/db/element?id=' + messageId + '&collection=communityFeed', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                let answer = data.answers;
                var mes = answer[answerPos];
                answer.splice(answerPos, 1);
                mes.description = document.getElementById("newMessage" + answerId).value;
                answer.push(mes)
                let obj = {
                    collection: 'communityFeed',
                    elem: {
                        "_id": JSON.stringify(messageId),
                        "author": data.author,
                        "title": data.title,
                        "description": data.description,
                        "file": data.img,
                        "date": data.date,
                        "answers": answer
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
                    .then(() => {
                        location.reload();
                    })
            })
        document.getElementById("formcontainer" + answerId).style.display = "none";
        //document.getElementById(jsonDataid).style.display = "block";
    });
}

function removeAnswer(messageId, answerPos) {
    // logica per la rimozione del messaggio
    fetch('/db/element?id=' + messageId + '&collection=communityFeed', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            let answer = data.answers;
            var mes = answer[answerPos];
            answer.splice(answerPos, 1);
            let obj = {
                collection: 'communityFeed',
                elem: {
                    "_id": JSON.stringify(messageId),
                    "author": data.author,
                    "title": data.title,
                    "description": data.description,
                    "file": data.img,
                    "date": data.date,
                    "answers": answer
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
                .then(() => {
                    location.reload();
                })
        })
}