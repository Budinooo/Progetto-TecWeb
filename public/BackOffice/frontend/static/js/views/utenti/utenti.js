var ids = [];

fetch('/db/collection?collection=users', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(clients => {
        clients = clients.result;
        let clientsHtml = '';
        let adminHtml = [];
        for (var i = 0; i < clients.length; i++) {
            let client = clients[i];
            adminHtml[i] = '';
            ids[i] = client._id;
            //debugger;
            clientsHtml += `
        <div class="col-sm-4">
          <div class="card" style=margin-top:5px>
            <div class="card-body" id="${i}">
              <h5 class="card-title">${client.name}</h5>
              <p class="card-text">Username: ${client.username}</p>
              <p class="card-text">email: ${client.email}</p>
              <p class="card-text">password: ${client.password}</p>
              <p class="card-text">Game Score: ${client.score}</p>
              <button class="btn btn-primary" id="editClient${i}" onclick="editClient(${i})">Edit</button>
              <button class="btn btn-danger" onclick="formRemoveClient(${i})">Remove</button>
            </div>
          </div>
          <div class="container" id="formRemovecontainer${i}" style="display:none">
          <h2>Are you sure?</h2>
          <button class="btn btn-danger" aria-pressed="false" aria-role="button" aria-label="Yes" onclick="removeClient(${i})">yes</button>
          <button class="btn btn-primary" aria-pressed="false" aria-role="button" aria-label="No" onclick="formRemoveClient(${i})">no</button>
        </div>
          <div class="container" id="formeditcontainer${i}" style="display:none">
                <form class="form form--hidden" id="editClientForm">
                    <div class="form-group">
                        <label for="nameInput">Name</label>
                        <input type="text" class="form-control" id="nameEditInput${i}" value="${client.name}">
                    </div>
                    <div class="form-group">
                        <label for="nameInput">username</label>
                        <input type="text" class="form-control" id="usernameEditInput${i}" value="${client.username}">
                    </div>
                    <div class="form-group">
                        <label for="emailInput">Mail</label>
                        <input type="text" class="form-control" id="emailEditInput${i}" value="${client.email}">
                    </div>
                    <div class="form-group">
                        <label for="passwordInput">Password</label>
                        <input type="text" class="form-control" id="passwordEditInput${i}" value="${client.password}">
                    </div>
                    <div class="form-group">
                        <label for="scoreInput">Game Score</label>
                        <input type="number" class="form-control" id="scoreEditInput${i}" value="${client.score}">
                    </div>
                    <div class="form-group">
                        <label for="adminInput">Admin</label>
                        <select name="Admin" id="adminEditInput${i}">
                            <option value=0>Not Admin</option>
                            <option value=1>Admin</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" id="editSaveClient${i}" style= margin-top:5px>Save</button>
                </form>
            </div>
        </div>
      `;
            if (client.admin == false) {
                adminHtml[i] += `
        <option value=0>Not Admin</option>
        <option value=1>Admin</option>
                `;
            } else {
                adminHtml[i] += `
        <option value=1>Admin</option>
        <option value=0>Not Admin</option>
                `;
            }
        };
        document.getElementById('clients').innerHTML = clientsHtml;
        for (var i = 0; i < clients.length; i++) {
            let client = clients[i];
            document.getElementById('adminEditInput' + i).innerHTML = adminHtml[i];
        }
    });


document.addEventListener("DOMContentLoaded", () => {
    const addForm = document.querySelector('#addClientForm');
    document.querySelector('#addClientButton').addEventListener("click", e => {
        e.preventDefault();
        if (document.getElementById("formcontainer").style.display == "none") {
            document.getElementById("formcontainer").style.display = "block";
        } else if (document.getElementById("formcontainer").style.display == "block") {
            document.getElementById("formcontainer").style.display = "none";
        }
    });
    document.querySelector('#saveClient').addEventListener("click", e => {
        e.preventDefault();
        const name = document.querySelector('#nameInput').value;
        const username = document.querySelector('#usernameInput').value;
        const email = document.querySelector('#emailInput').value;
        const password = document.querySelector('#passwordInput').value;
        const admin = document.querySelector('#adminInput').value;
        const score = Number(document.querySelector('#scoreInput').value);
        if (name != "" && username != "" && email != "" && password != "") {
            addClient(name, username, email, password, admin, score);
        }
    });
});

function addClient(name, username, email, password, admin, score) {
    // logica per l'aggiunta di un nuovo cliente
    let size;
    fetch('/db/collection?collection=users', {
            method: 'GET'
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            data = data.result;
            const userExists = data.some(u => u.username === username || u.email === email);
            if (!userExists) {
                let obj = {
                    collection: 'users',
                    elem: {
                        "name": name,
                        "username": username,
                        "email": email,
                        "password": password,
                        "favorites": [],
                        "pets": [],
                        "score": score,
                        "admin": admin
                    }
                };

                fetch('/db/element', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(obj)
                    })
                    .then(() => {
                        location.reload();
                    })
            } else if (userExists) {
                document.getElementById("userAlreadyExists").style.display = "block";
            }
        })
}

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    if (document.getElementById("formeditcontainer" + jsonDataid).style.display == "none") {
        document.getElementById("formeditcontainer" + jsonDataid).style.display = "block";
    } else if (document.getElementById("formeditcontainer" + jsonDataid).style.display == "block") {
        document.getElementById("formeditcontainer" + jsonDataid).style.display = "none";
    }
    document.getElementById("editSaveClient" + jsonDataid).addEventListener("click", e => {
        e.preventDefault();
        fetch('/db/element?id=' + ids[jsonDataid] + '&collection=users', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                const name = document.getElementById('nameEditInput' + jsonDataid).value;
                const username = document.getElementById('usernameEditInput' + jsonDataid).value;
                const email = document.getElementById('emailEditInput' + jsonDataid).value;
                const password = document.getElementById('passwordEditInput' + jsonDataid).value;
                const admin = document.getElementById('adminEditInput' + jsonDataid).value;
                const score = Number(document.getElementById('scoreEditInput' + jsonDataid).value);
                if (name != null && username != null && email != null && password != null) {
                    let obj = {
                        collection: 'users',
                        elem: {
                            "_id": ids[jsonDataid],
                            "name": name,
                            "username": username,
                            "email": email,
                            "password": password,
                            "favorites": data.favorites,
                            "pets": data.pets,
                            "score": score,
                            "admin": admin
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
                }
            })
        document.getElementById("formeditcontainer" + jsonDataid).style.display = "none";
    });
}

function removeClient(clientId) {
    // logica per la rimozione del cliente
    console.log(JSON.stringify(ids[clientId]));
    let obj = {
        collection: 'users',
        id: ids[clientId]
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

function logout() {
    const longinInfo = {
        islogged: false,
        id: ""
    }
    localStorage.setItem("login", JSON.stringify(longinInfo));
}

function formRemoveClient(clientId) {
    console.log(clientId);
    if (document.getElementById("formRemovecontainer" + clientId).style.display == "none") {
        document.getElementById("formRemovecontainer" + clientId).style.display = "block";
    } else if (document.getElementById("formRemovecontainer" + clientId).style.display == "block") {
        document.getElementById("formRemovecontainer" + clientId).style.display = "none";
    }
}