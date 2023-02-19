$.getJSON("prodotti.json", function(data) {
    // Crea card per ogni prodotto
    var productCards = "";
    for (var i = 0; i < data.products.length; i++) {
        productCards += "<div class='card' style='width: 18rem;'>";
        productCards += "<img class='card-img-top' src='" + data.products[i].image + "' alt='" + data.products[i].name + "'>";
        productCards += "<div class='card-body'>";
        productCards += "<h5 class='card-title'>" + data.products[i].name + "</h5>";
        productCards += "<p class='card-text'>" + data.products[i].description + "</p>";
        productCards += "<p class='card-text'>Price: €" + data.products[i].price + "</p>";
        productCards += "<p class='card-text'>Availability: " + data.products[i].availability + "</p>";
        productCards += "<button  class='btn btn-primary' id='editBtn' data-index='" + i + "'>Edit</button>";
        productCards += "<button  class='btn btn-danger' id='removeBtn' style='margin-left:2em' data-index='" + i + "'>Remove</button>";
        productCards += "</div>";
        productCards += "</div>";
    }
    $("#productCards").html(productCards);

    // Apre il form di modifica per il prodotto selezionato
    $("#editBtn").click(function() {
        var index = $(this).data("index");
        // Implementare la logica per aprire il form di modifica
        document.getElementById("formcontainer").style.display = "block";
        document.querySelector("form").addEventListener("submit", function(event) {
            event.preventDefault();
            //document.getElementById("jsonData").style.display = "block";
            document.getElementById("formcontainer").style.display = "none";
            fetch('prodotti.json')
                .then(response => response.json())
                .then(data => {
                    // modifica l'oggetto JavaScript
                    data.push({
                        id: '4',
                        name: index.name,
                        description: index.description,
                        price: index.price,
                        availability: index.availability,
                        image: index.image
                    });

                    // scrive il contenuto del file JSON
                    fetch('prodotti.json', {
                        method: 'PUT',
                        body: JSON.stringify(data)
                    });
                });
        });
    });
});

// Aggiunge un nuovo prodotto
$("#addBtn").click(function() {
    // logica per l'aggiunta di un nuovo prodotto
    // legge il contenuto del file JSON
    document.getElementById("formcontainer").style.display = "block";
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();
        //document.getElementById("jsonData").style.display = "block";
        document.getElementById("formcontainer").style.display = "none";
        fetch('prodotti.json')
            .then(response => response.json())
            .then(data => {
                // modifica l'oggetto JavaScript
                // creazione di un nuovo oggetto prodotto
                const newProduct = {
                    id: data.products.length + 1,
                    name: document.getElementById("nameInput").value,
                    description: document.getElementById("descriptionInput").value,
                    price: document.getElementById("priceInput").value,
                    availability: document.getElementById("availabilityInput").value,
                    image: document.getElementById("imageInput").value
                };
                // aggiunta del nuovo utente al file JSON
                // salvataggio del file JSON aggiornato
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(newProduct)
                };
                fetch('prodotti.json', options)
                    .then(() => {
                        console.log("Prodotto registrato con successo.");
                        window.location.replace('./prodotti.html');
                    })
                    .catch(error => console.error(error));
            });
    });
});

// Rimuove il prodotto selezionato
$("#removeBtn").click(function() {
    // Implementare la logica per rimuovere un prodotto
});