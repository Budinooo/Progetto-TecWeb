/*
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("prodotti");
    }

    async getHtml() {
        return `
                    <h1>Bacheca</h1>
                    <p>Tutti i messaggi dei nostri clienti!</p>
                `;
    }
} 
*/

$.getJSON("prodotti.json", function(data) {
    // Crea card per ogni prodotto
    var productCards = "";
    for (var i = 0; i < data.products.length; i++) {
        productCards += "<div class='card' style='width: 18rem;'>";
        productCards += "<img class='card-img-top' src='" + data.products[i].image + "' alt='" + data.products[i].name + "'>";
        productCards += "<div class='card-body'>";
        productCards += "<h5 class='card-title'>" + data.products[i].name + "</h5>";
        productCards += "<p class='card-text'>" + data.products[i].description + "</p>";
        productCards += "<p class='card-text'>Prezzo: €" + data.products[i].price + "</p>";
        productCards += "<p class='card-text'>Disponibilità: €" + data.products[i].availability + "</p>";
        productCards += "<button  class='btn btn-primary' data-index='" + i + "'>Modifica</button>";
        productCards += "</div>";
        productCards += "</div>";
    }
    $("#productCards").html(productCards);

    // Apre il form di modifica per il prodotto selezionato
    $(".editBtn").click(function() {
        var index = $(this).data("index");
        // Implementare la logica per aprire il form di modifica
    });
});

// Aggiunge un nuovo prodotto
$("#addBtn").click(function() {
    // Implementare la logica per aggiungere un prodotto
});

// Rimuove il prodotto selezionato
$("#removeBtn").click(function() {
    // Implementare la logica per rimuovere un prodotto
});