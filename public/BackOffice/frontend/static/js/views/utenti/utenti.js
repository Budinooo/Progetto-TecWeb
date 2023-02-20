fetch('/db/collection?collection=users', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(clients => {
        let clientsHtml = '';
        clients.forEach(client => {
            clientsHtml += `
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body" id="${client.id}">
              <h5 class="card-title">${client.name}</h5>
              <p class="card-text">Favorite Animals: ${client.favorites}</p>
              <p class="card-text">Game Score: ${client.score}</p>
              <button class="btn btn-primary" id="editClient" onclick="editClient(${client.id})">Edit</button>
              <button class="btn btn-danger" onclick="removeClient(${client.id})">Remove</button>
            </div>
          </div>
          <div class="container" id="formcontainer${client.id}" style="display:none">
                <form class="form form--hidden" id="addClientForm">
                    <div class="form-group">
                        <label for="nameInput">Name</label>
                        <input type="text" class="form-control" id="nameInput">
                    </div>
                    <div class="form-group">
                        <label for="favoritesInput">Favorite Animals</label>
                        <input type="text" class="form-control" id="favoritesInput">
                    </div>
                    <div class="form-group">
                        <label for="scoreInput">Game Score</label>
                        <input type="text" class="form-control" id="scoreInput">
                    </div>
                    <button type="submit" class="btn btn-primary" id="saveClient">Save</button>
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
        const animals = document.querySelector('#favoritesInput').value;
        const score = document.querySelector('#scoreInput').value;
        addClient(name, animals, score);
        document.getElementById("formcontainer").style.display = "none";
    });
    document.querySelector('#editClient').addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("formcontainer").style.display = "block";
    });
});

function addClient(name, animals, score) {
    // logica per l'aggiunta di un nuovo cliente
    let size;
    fetch('/db/collectionsize?collection=products', {
            method: 'GET'
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            size = data;
        })
    let obj = {
        collection: 'users',
        elem: {
            "_id": (size + 1).stringify,
            "name": name,
            "username": "Geraldadmin",
            "email": "gerald@marcio.com",
            "password": "ciaociao",
            "favorites": animals,
            "pets": [],
            "score": score,
            "admin": "1"
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
        // legge il contenuto del file JSON
        /*
        fetch('/db/collection?collection=products', {
                method: 'GET'
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
                */
        /*
                const userExists = data.some(u => u.name === name);
                if (userExists) {
                    console.log("Utente già registrato con questo username o email.");
                    editClient(userExists.id, name, animals, score);
                } else {
                    // creazione di un nuovo oggetto utente
                    const newUser = {
                        id: data.length + 1,
                        name: name,
                        favorites: animals,
                        score: score
                    };
                    // aggiunta del nuovo utente al file JSON
                    // salvataggio del file JSON aggiornato
                    const options = {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    };
                    fetch('utenti.json', options)
                        .then(() => {
                            console.log("Utente registrato con successo.");
                            window.location.replace('./utenti.html');
                        })
                        .catch(error => console.error(error));
                }
            */
        /*
});

fetch('/db/collectionsize?collection=products', {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

fetch('/db/element?id=1&collection=products', {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

let obj = {
    collection: 'users',
    elem: {
        "_id": "3",
        "name": "Gerald",
        "username": "Geraldadmin",
        "email": "gerald@marcio.com",
        "password": "ciaociao",
        "favorites": ["cat"],
        "pets": [],
        "score": "1000",
        "admin": "1"
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
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

fetch('/db/element?id=3&collection=users', {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

obj = {
    collection: 'users',
    elem: {
        "_id": "3",
        "name": "Gerald",
        "username": "Budino",
        "email": "gerald@marcio.com",
        "password": "ciaociao",
        "favorites": ["cat"],
        "pets": [],
        "score": "1000",
        "admin": "1"
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
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

obj = {
    collection: 'users',
    id: '3'
}

fetch('/db/element', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

fetch('/db/collection?collection=users', {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
    */
}

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    obj = {
        collection: 'users',
        elem: {
            "_id": jsonDataid,
            "name": "Gerald",
            "username": "Budino",
            "email": "gerald@marcio.com",
            "password": "ciaociao",
            "favorites": ["cat"],
            "pets": [],
            "score": "1000",
            "admin": "1"
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
}

function removeClient(clientId) {
    // logica per la rimozione del cliente
    obj = {
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
}