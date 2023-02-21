fetch('/db/collection?collection=products', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(prodotti => {
        let prodottiHtml = '';
        prodotti.forEach(prodotto => {
            prodottiHtml += `
        <div class="col-sm-4">
          <div class="card">
          <img class="card-img-top" src="${prodotto.image}" alt="${prodotto.name}" style="width: 18rem;">
            <div class="card-body" id="${prodotto.id}">
              <h5 class="card-title">${prodotto.name}</h5>
              <p class="card-text">${prodotto.description}</p>
              <p class="card-text">Price €: ${prodotto.price}</p>
              <p class="card-text">Availability: ${prodotto.availability}</p>
              <button class="btn btn-primary" id="editClient" onclick="editClient(${prodotto.id})">Edit</button>
              <button class="btn btn-danger" onclick="removeElement(${prodotto.id})">Remove</button>
            </div>
          </div>
          <div class="container" id="formcontainer${prodotto.id}" style="display:none">
            <form class="form form--hidden" id="addProductForm">
                <div class="form-group">
                    <label for="nameInput">Name</label>
                    <input type="text" class="form-control" id="nameInput">
                </div>
                <div class="form-group">
                    <label for="favoritesInput">Description</label>
                    <input type="text" class="form-control" id="descriptionInput">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Price</label>
                    <input type="text" class="form-control" id="priceInput">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Availability</label>
                    <input type="text" class="form-control" id="availabilityInput">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Image url</label>
                    <input type="text" class="form-control" id="imageInput">
                </div>
                <button type="submit" class="btn btn-primary" id="saveProduct">Save</button>
            </form>
        </div>
        </div>
      `;
        });
        document.getElementById('productCards').innerHTML = prodottiHtml;
    });

// Aggiunge un nuovo prodotto
$("#addBtn").click(function() {
    // logica per l'aggiunta di un nuovo prodotto
    // legge il contenuto del file JSON
    document.getElementById("formcontainer").style.display = "block";
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("formcontainer").style.display = "none";
        fetch('/db/collectionsize?collection=products', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(prodotti => {
                let obj = {
                    collection: 'products',
                    elem: {
                        _id: (prodotti + 1).stringify,
                        name: document.getElementById("nameInput").value,
                        description: document.getElementById("descriptionInput").value,
                        price: document.getElementById("priceInput").value,
                        availability: document.getElementById("availabilityInput").value,
                        image: document.getElementById("imageInput").value
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
            });

    });
});

// Rimuove il prodotto selezionato
function removeElement(jsonDataid) {
    // Implementare la logica per rimuovere un prodotto
    obj = {
        collection: 'products',
        id: jsonDataid
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

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    document.getElementById("formcontainer" + jsonDataid).style.display = "block";
    document.querySelector("form").addEventListener("submit", function(event) {
        obj = {
            collection: 'products',
            elem: {
                "_id": jsonDataid,
                "name": document.getElementById("nameInput").value,
                "description": document.getElementById("descriptionInput").value,
                "price": document.getElementById("priceInput").value,
                "availability": document.getElementById("availabilityInput").value,
                "image": document.getElementById("imageInput").value
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
    });

}