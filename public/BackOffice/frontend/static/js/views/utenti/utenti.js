fetch('/db/collection?collection=users', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(clients => {
        clients = clients.result;
        let clientsHtml = '';
        clients.forEach(client => {
            clientsHtml += `
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body" id="${client._id}">
              <h5 class="card-title">${client.name}</h5>
              <p class="card-text">Username: ${client.username}</p>
              <p class="card-text">email: ${client.email}</p>
              <p class="card-text">password: ${client.password}</p>
              <p class="card-text">Favorite Animals: ${client.favorites}</p>
              <p class="card-text">Pets: ${client.pets}</p>
              <p class="card-text">Game Score: ${client.score}</p>
              <button class="btn btn-primary" id="editClient" onclick="editClient(${client._id})">Edit</button>
              <button class="btn btn-danger" onclick="removeClient(${client._id})">Remove</button>
            </div>
          </div>
          <div class="container" id="formeditcontainer" style="display:none">
                <form class="form form--hidden" id="editClientForm">
                    <div class="form-group">
                        <label for="nameInput">Name</label>
                        <input type="text" class="form-control" id="nameInput" value="${client.name}">
                    </div>
                    <div class="form-group">
                        <label for="nameInput">username</label>
                        <input type="text" class="form-control" id="usernameInput" value="${client.username}">
                    </div>
                    <div class="form-group">
                        <label for="emailInput">Mail</label>
                        <input type="text" class="form-control" id="emailInput" value="${client.email}">
                    </div>
                    <div class="form-group">
                        <label for="passwordInput">Password</label>
                        <input type="text" class="form-control" id="passwordInput" value="${client.password}">
                    </div>
                    <div class="form-group">
                        <label for="favoritesInput">Favorite Animals</label>
                        <input type="text" class="form-control" id="favoritesInput" value="${client.favorites}">
                    </div>
                    <div class="form-group">
                        <label for="animalsInput">Pets</label>
                        <input type="text" class="form-control" id="petsInput" value="${client.pets}">
                    </div>
                    <div class="form-group">
                        <label for="scoreInput">Game Score</label>
                        <input type="text" class="form-control" id="scoreInput" value="${client.score}">
                    </div>
                    <div class="form-group">
                        <label for="adminInput">Admin</label>
                        <input type="checkbox" class="form-control" id="adminInput">
                    </div>
                    <button type="submit" class="btn btn-primary" id="editSaveClient">Save</button>
                </form>
            </div>
        </div>
      `;
        });
        document.getElementById('clients').innerHTML = clientsHtml;
    });


document.addEventListener("DOMContentLoaded", () => {
    const addForm = document.querySelector('#addClientForm');
    document.querySelector('#addClientButton').addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("formcontainer").style.display = "block";
    });
    document.querySelector('#saveClient').addEventListener("click", e => {
        e.preventDefault();
        const name = document.querySelector('#nameInput').value;
        const username = document.querySelector('#usernameInput').value;
        const animals = document.querySelector('#favoritesInput').value;
        const email = document.querySelector('#emailInput').value;
        const password = document.querySelector('#passwordInput').value;
        const pets = document.querySelector('#petsInput').value;
        const admin = document.querySelector('#adminInput').value;
        const score = document.querySelector('#scoreInput').value;
        addClient(name, username, email, password, pets, admin, animals, score);
        document.getElementById("formcontainer").style.display = "none";
    });
});

function addClient(name, username, email, password, pets, admin, animals, score) {
    // logica per l'aggiunta di un nuovo cliente
    let size;
    fetch('/db/collectionsize?collection=products', {
            method: 'GET'
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            size = data.result;
        })
    let obj = {
        collection: 'users',
        elem: {
            "_id": JSON.stringify(size),
            "name": name,
            "username": username,
            "email": email,
            "password": password,
            "favorites": animals,
            "pets": pets,
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
    location.reload();
}

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    document.getElementById("formeditcontainer").style.display = "block";
    document.querySelector('#editSaveClient').addEventListener("click", e => {
        e.preventDefault();
        const id = document.querySelector('#id').value;
        const name = document.querySelector('#nameInput').value;
        const username = document.querySelector('#usernameInput').value;
        const animals = document.querySelector('#favoritesInput').value;
        const email = document.querySelector('#emailInput').value;
        const password = document.querySelector('#passwordInput').value;
        const pets = document.querySelector('#petsInput').value;
        const admin = document.querySelector('#adminInput').value;
        const score = document.querySelector('#scoreInput').value;
        let obj = {
            collection: 'users',
            elem: {
                "_id": jsonDataid,
                "name": name,
                "username": username,
                "email": email,
                "password": password,
                "favorites": animals,
                "pets": pets,
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
        document.getElementById("formeditcontainer").style.display = "none";
    });
    location.reload();
}

function removeClient(clientId) {
    // logica per la rimozione del cliente
    let obj = {
        collection: 'users',
        id: clientId
    }
    fetch('/db/element', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    location.reload();
}