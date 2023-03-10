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
            <button class="btn btn-danger" onclick="formRemoveMessage(` + message._id + `)">Remove</button>
            <button class="btn btn-danger" onclick="formRemoveImage(` + message._id + `)">Remove Image</button>
          </div>
          <div class="container" id="formRemovecontainer${message._id}" style="display:none">
          <h2>Are you sure?</h2>
          <button class="btn btn-danger" aria-pressed="false" aria-role="button" aria-label="Yes" onclick="removeMessage(${message._id})">yes</button>
          <button class="btn btn-primary" aria-pressed="false" aria-role="button" aria-label="No" onclick="formRemoveMessage(${message._id})">no</button>
        </div>
        <div class="container" id="formRemoveImagecontainer${message._id}" style="display:none">
        <h2>Are you sure?</h2>
        <button class="btn btn-danger" aria-pressed="false" aria-role="button" aria-label="Yes" onclick="deleteImage(${message._id})">yes</button>
        <button class="btn btn-primary" aria-pressed="false" aria-role="button" aria-label="No" onclick="formRemoveImage(${message._id})">no</button>
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
            <button class="btn btn-danger" onclick="formRemoveAnswerMessage(` + element._id + `)">Remove</button>
            <button class="btn btn-danger" onclick="formRemoveAnswerImage(` + element._id + `)">Remove Image</button>
          </div>
          <div class="container" id="formRemoveAnswercontainer` + element._id + `" style="display:none">
          <h2>Are you sure?</h2>
          <button class="btn btn-danger" aria-pressed="false" aria-role="button" aria-label="Yes" onclick="removeAnswer(` + message._id + `,` + j + `)">yes</button>
          <button class="btn btn-primary" aria-pressed="false" aria-role="button" aria-label="No" onclick="formRemoveAnswerMessage(` + element._id + `)">no</button>
        </div>
        <div class="container" id="formRemoveAnswerImagecontainer` + element._id + `" style="display:none">
        <h2>Are you sure?</h2>
        <button class="btn btn-danger" aria-pressed="false" aria-role="button" aria-label="Yes" onclick="deleteAnswerImage(` + message._id + `,` + j + `)">yes</button>
        <button class="btn btn-primary" aria-pressed="false" aria-role="button" aria-label="No" onclick="formRemoveAnswerImage(` + element._id + `)">no</button>
        </div>
          
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

function formRemoveMessage(messageId) {
    if (document.getElementById("formRemovecontainer" + messageId).style.display == "none") {
        document.getElementById("formRemovecontainer" + messageId).style.display = "block";
    } else if (document.getElementById("formRemovecontainer" + messageId).style.display == "block") {
        document.getElementById("formRemovecontainer" + messageId).style.display = "none";
    }
}

function formRemoveImage(messageId) {
    if (document.getElementById("formRemoveImagecontainer" + messageId).style.display == "none") {
        document.getElementById("formRemoveImagecontainer" + messageId).style.display = "block";
    } else if (document.getElementById("formRemoveImagecontainer" + messageId).style.display == "block") {
        document.getElementById("formRemoveImagecontainer" + messageId).style.display = "none";
    }
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

function formRemoveAnswerMessage(messageId) {
    if (document.getElementById("formRemoveAnswercontainer" + messageId).style.display == "none") {
        document.getElementById("formRemoveAnswercontainer" + messageId).style.display = "block";
    } else if (document.getElementById("formRemoveAnswercontainer" + messageId).style.display == "block") {
        document.getElementById("formRemoveAnswercontainer" + messageId).style.display = "none";
    }
}

function formRemoveAnswerImage(messageId) {
    if (document.getElementById("formRemoveAnswerImagecontainer" + messageId).style.display == "none") {
        document.getElementById("formRemoveAnswerImagecontainer" + messageId).style.display = "block";
    } else if (document.getElementById("formRemoveAnswerImagecontainer" + messageId).style.display == "block") {
        document.getElementById("formRemoveAnswerImagecontainer" + messageId).style.display = "none";
    }
}

function logout() {
    const longinInfo = {
        islogged: false,
        id: ""
    }
    localStorage.setItem("login", JSON.stringify(longinInfo));
}