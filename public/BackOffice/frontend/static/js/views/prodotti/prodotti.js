fetch('/db/collection?collection=products', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(prodotti => {
        prodotti = prodotti.result;
        let prodottiHtml = '';
        prodotti.forEach(prodotto => {
            prodottiHtml += `
        <div class="col-sm-4">
          <div class="card">
          <img class="card-img-top" src="${prodotto.img}" alt="${prodotto.name}" style="width: 18rem;">
            <div class="card-body" id="${prodotto._id}">
              <h5 class="card-title">${prodotto.name}</h5>
              <p class="card-text">${prodotto.description}</p>
              <p class="card-text">Price €: ${prodotto.price}</p>
              <p class="card-text">Product for: ${prodotto.animal}</p>
              <p class="card-text">Availability: ${prodotto.availability}</p>
              <button class="btn btn-primary" id="editClient" onclick="editClient(${prodotto._id})">Edit</button>
              <button class="btn btn-danger" onclick="removeElement(${prodotto._id})">Remove</button>
            </div>
          </div>
          <div class="container" id="formcontainer${prodotto._id}" style="display:none">
            <form class="form form--hidden" id="addProductForm">
                <div class="form-group">
                    <label for="nameInput">Name</label>
                    <input type="text" class="form-control" id="nameEditInput${prodotto._id}">
                </div>
                <div class="form-group">
                    <label for="favoritesInput">Description</label>
                    <input type="text" class="form-control" id="descriptionEditInput${prodotto._id}">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Price</label>
                    <input type="text" class="form-control" id="priceEditInput${prodotto._id}">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Availability</label>
                    <input type="text" class="form-control" id="availabilityEditInput${prodotto._id}">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Image url</label>
                    <input type="text" class="form-control" id="imageEditInput${prodotto._id}">
                </div>
                <button type="submit" class="btn btn-primary" id="savePEditroduct${prodotto._id}">Save</button>
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
                        "_id": JSON.stringify(prodotti.result),
                        "name": JSON.stringify(document.getElementById("nameInput").value),
                        "description": JSON.stringify(document.getElementById("descriptionInput").value),
                        "price": JSON.stringify(document.getElementById("priceInput").value),
                        "availability": JSON.stringify(document.getElementById("availabilityInput").value),
                        "image": JSON.stringify(document.getElementById("imageInput").value)
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
            });
    });
});

// Rimuove il prodotto selezionato
function removeElement(jsonDataid) {
    // Implementare la logica per rimuovere un prodotto
    let obj = {
        collection: 'products',
        id: JSON.stringify(jsonDataid)
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

function editClient(jsonDataid) {
    // logica per la modifica delle informazioni del cliente
    document.getElementById("formcontainer" + jsonDataid).style.display = "block";
    document.querySelector("form").addEventListener("submit", function(event) {
        let obj = {
            collection: 'products',
            elem: {
                "_id": JSON.stringify(jsonDataid),
                "name": JSON.stringify(document.getElementById("nameEditInput" + jsonDataid).value),
                "description": JSON.stringify(document.getElementById("descriptionEditInput" + jsonDataid).value),
                "price": JSON.stringify(document.getElementById("priceEditInput" + jsonDataid).value),
                "availability": JSON.stringify(document.getElementById("availabilityEditInput" + jsonDataid).value),
                "image": JSON.stringify(document.getElementById("imageEditInput" + jsonDataid).value)
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