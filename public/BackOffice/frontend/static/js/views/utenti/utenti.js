/*
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Utenti");
    };

    async getHtml() {
        return fetch('/frontend/static/js/views/utenti/utenti.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(htmlText => {
                // restituisce il contenuto del file HTML come stringa
                return htmlText;
            })
            .catch(error => {
                console.error(error);
                return error;
            });
    }

}
*/

fetch('utenti.json')
    .then(response => response.json())
    .then(clients => {
        let clientsHtml = '';
        clients.forEach(client => {
            clientsHtml += `
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${client.name}</h5>
              <p class="card-text">Favorite Animals: ${client.favorites}</p>
              <p class="card-text">Game Score: ${client.score}</p>
              <button class="btn btn-primary" onclick="editClient(${client})">Edit</button>
              <button class="btn btn-danger" onclick="removeClient(${client.id})">Remove</button>
            </div>
          </div>
        </div>
      `;
        });
        document.getElementById('clients').innerHTML = clientsHtml;
    });

function addClient() {
    // logica per l'aggiunta di un nuovo cliente
    // legge il contenuto del file JSON
    fetch('utenti.json')
        .then(response => response.json())
        .then(data => {
            // modifica l'oggetto JavaScript
            data.push({
                id: '4',
                name: 'Nuovo cliente',
                animali_preferiti: 'gatti',
                punteggio: 10
            });

            // scrive il contenuto del file JSON
            fetch('utenti.json', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        });

}

function editClient(jsonData) {
    // logica per la modifica delle informazioni del cliente
    document.getElementById("name").innerHTML = "Name: " + jsonData.name;
    document.getElementById("favorites").innerHTML = "Favorite Animals: " + jsonData.favorites;
    document.getElementById("score").innerHTML = "Game Score: " + jsonData.score;

    document.getElementById("editButton").addEventListener("click", function() {
        document.getElementById("formContainer").style.display = "block";
        document.getElementById("jsonData").style.display = "none";
        document.getElementById("nameInput").value = jsonData.name;
        document.getElementById("favoritesInput").value = jsonData.favorites;
        document.getElementById("scoreInput").value = jsonData.score;
    });

    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();
        jsonData.name = document.getElementById("nameInput").value;
        jsonData.favorites = document.getElementById("favoritesInput").value;
        jsonData.score = document.getElementById("scoreInput").value;
        document.getElementById("jsonData").style.display = "block";
        document.getElementById("formContainer").style.display = "none";
        document.getElementById("name").innerHTML = "Nome: " + jsonData.name;
        document.getElementById("favorites").innerHTML = "Animali preferiti: " + jsonData.favorites;
        document.getElementById("score").innerHTML = "Punteggio: " + jsonData.score;
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