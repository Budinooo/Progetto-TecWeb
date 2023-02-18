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
        const name = document.querySelector('#nameInput');
        const animals = document.querySelector('#favoritesInput');
        const score = document.querySelector('#scoreInput');
        //addClient(name, animals, score);
        //addForm.classList.add("form--hidden");
        document.getElementById("formcontainer").style.display = "none";
    });
});

function addClient(name, animals, score) {
    // logica per l'aggiunta di un nuovo cliente
    // legge il contenuto del file JSON
    fetch('utenti.json')
        .then(response => response.json())
        .then(data => {
            // modifica l'oggetto JavaScript
            data.push({
                id: '4',
                name: name,
                animali_preferiti: animals,
                punteggio: score
            });

            // scrive il contenuto del file JSON
            fetch('utenti.json', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        });
}

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    /*
    document.getElementById("name").value = "Name: " + "jsonData.name";
    document.getElementById("favorites").innerHTML = "Favorite Animals: " + "jsonData.favorites";
    document.getElementById("score").innerHTML = "Game Score: " + "jsonData.score";
    */
    fetch('utenti.json')
        .then(response => response.json())
        .then(data => {
            // ricerca dell'utente nel file JSON
            const jsonData = data.find(u => u.id === jsonDataid);
        });
    document.getElementById("formcontainer").style.display = "block";
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
        jsonData.name = document.getElementById("nameInput").value;
        jsonData.favorites = document.getElementById("favoritesInput").value;
        jsonData.score = document.getElementById("scoreInput").value;
        //document.getElementById("jsonData").style.display = "block";
        document.getElementById("formcontainer").style.display = "none";
        document.getElementById(jsonDataid).style.display = "block";
        /*
        document.getElementById("name").innerHTML = "Nome: " + jsonData.name;
        document.getElementById("favorites").innerHTML = "Animali preferiti: " + jsonData.favorites;
        document.getElementById("score").innerHTML = "Punteggio: " + jsonData.score;
        */
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