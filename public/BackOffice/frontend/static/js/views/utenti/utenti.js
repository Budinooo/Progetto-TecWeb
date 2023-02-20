fetch('utenti.json')
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
        //addForm.classList.remove("form--hidden");
        document.getElementById("formcontainer").style.display = "block";
    });
    document.querySelector('#saveClient').addEventListener("click", e => {
        e.preventDefault();
        const name = document.querySelector('#nameInput').value;
        const animals = document.querySelector('#favoritesInput').value;
        const score = document.querySelector('#scoreInput').value;
        addClient(name, animals, score);
        //addForm.classList.add("form--hidden");
        document.getElementById("formcontainer").style.display = "none";
    });
    document.querySelector('#editClient').addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("formcontainer").style.display = "block";
    });
});

function addClient(name, animals, score) {
    // logica per l'aggiunta di un nuovo cliente
    // legge il contenuto del file JSON
    fetch('/db/collection?collection=products',{
        method:'GET'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
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
        */});

    fetch('/db/collectionsize?collection=products',{
        method:'GET'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
        })

    fetch('/db/element?id=1&collection=products',{
        method:'GET'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
        })

    let obj = {
        collection:'users',
        elem:{ 
            "_id":"3",
            "name": "Gerald",
            "username": "Geraldadmin",
            "email": "gerald@marcio.com",
            "password":"ciaociao",
            "favorites": ["cat"],
            "pets":[],
            "score": "1000",
            "admin": "1"
        }
    };

    fetch('/db/element',{
        method:'POST',
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

    fetch('/db/element?id=3&collection=users',{
        method:'GET'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
        })

    obj = {
        collection:'users',
        elem:{
            "_id":"3",
            "name": "Gerald",
            "username": "Budino",
            "email": "gerald@marcio.com",
            "password":"ciaociao",
            "favorites": ["cat"],
            "pets":[],
            "score": "1000",
            "admin": "1"
        }
    }

    fetch('/db/element',{
        method:'PUT',
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
        collection:'users',
        id:'3'
    }

    fetch('/db/element',{
        method:'DELETE',
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

    fetch('/db/collection?collection=users',{
        method:'GET'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
        })
}

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    document.getElementById("formcontainer" + jsonDataid).style.display = "block";
    /*
    document.getElementById("name").value = "Name: " + "jsonData.name";
    document.getElementById("favorites").innerHTML = "Favorite Animals: " + "jsonData.favorites";
    document.getElementById("score").innerHTML = "Game Score: " + "jsonData.score";
    */
    /*
     fetch('utenti.json')
         .then(response => response.json())
         .then(data => {
             // ricerca dell'utente nel file JSON
             const jsonData = data.find(u => u.id === jsonDataid);
         });
     document.getElementById("formcontainer").style.display = "block";
     document.getElementById(jsonDataid).style.display = "none";
     */
    /*
        document.getElementById("editButton").addEventListener("click", function() {
            document.getElementById("formcontainer").style.display = "block";
            document.getElementById(jsonData.id).style.display = "none";
            document.getElementById("nameInput").value = jsonData.name;
            document.getElementById("favoritesInput").value = jsonData.favorites;
            document.getElementById("scoreInput").value = jsonData.score;
        });
    */
    /*
     document.querySelector("form").addEventListener("submit", function(event) {
         //event.preventDefault();
         jsonData.name = document.getElementById("nameInput").value;
         jsonData.favorites = document.getElementById("favoritesInput").value;
         jsonData.score = document.getElementById("scoreInput").value;
         //document.getElementById("jsonData").style.display = "block";
         document.getElementById("formcontainer").style.display = "none";
         document.getElementById(jsonDataid).style.display = "block";
         /*
         /*
         document.getElementById("name").innerHTML = "Nome: " + jsonData.name;
         document.getElementById("favorites").innerHTML = "Animali preferiti: " + jsonData.favorites;
         document.getElementById("score").innerHTML = "Punteggio: " + jsonData.score;
         */
    //});


    ////////////////////////////////////////////////////////////////
    // prendi l'elemento della card
    const card = document.querySelector('.card');

    // prendi gli elementi del form
    const titleInput = document.getElementById('card-title-input');
    const descriptionInput = document.getElementById('card-description-input');
    const imageInput = document.getElementById('card-image-input');
    const editCardForm = document.getElementById('edit-card-form');

    // popola i valori della card con quelli del form
    titleInput.value = card.querySelector('.card-title').innerText;
    descriptionInput.value = card.querySelector('.card-description').innerText;
    imageInput.value = card.querySelector('.card-image').innerText;

    // ascolta l'evento di submit del form
    editCardForm.addEventListener('submit', function(event) {
        // previeni il comportamento predefinito del form
        event.preventDefault();

        // aggiorna i valori della card con quelli del form
        card.querySelector('.card-title').innerText = titleInput.value;
        card.querySelector('.card-description').innerText = descriptionInput.value;
        card.querySelector('.card-image').innerText = imageInput.value;
    });
}

function removeClient(clientId) {
    // logica per la rimozione del cliente
    //const fs = require('fs');

    // Leggiamo il file JSON
    let data = fs.readFileSync('utenti.json');
    // Convertiamo il file JSON in un oggetto JavaScript
    let jsonData = JSON.parse(data);

    // Rimuoviamo l'elemento con l'ID specifico dall'oggetto
    let index = jsonData.findIndex(obj => obj.id === id);
    jsonData.splice(index, 1);

    // Scriviamo il nuovo contenuto sul file
    fs.writeFileSync('data.json', JSON.stringify(jsonData));
}