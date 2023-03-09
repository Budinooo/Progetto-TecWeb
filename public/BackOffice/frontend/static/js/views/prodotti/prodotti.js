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
          <div class="card" style="margin-top:5px">
          <img class="card-img-top" src="${prodotto.img}" alt="${prodotto.name}" style="width: 18rem;">
            <div class="card-body" id="${prodotto._id}">
              <h5 class="card-title">${prodotto.name}</h5>
              <p class="card-text">${prodotto.description}</p>
              <p class="card-text">Price €${prodotto.price}</p>
              <p class="card-text">Product for: ${prodotto.animal}</p>
              <button class="btn btn-primary" id="editClient" onclick="editClient(${prodotto._id})">Edit</button>
              <button class="btn btn-danger" onclick="removeElement(${prodotto._id})">Remove</button>
            </div>
          </div>
          <div class="container" id="formcontainer${prodotto._id}" style="display:none">
            <form class="form form--hidden" id="editProductForm${prodotto._id}">
                <div class="form-group">
                    <label for="nameInput">Name</label>
                    <input type="text" class="form-control" id="nameEditInput${prodotto._id}" value="${prodotto.name}">
                </div>
                <div class="form-group">
                    <label for="favoritesInput">Description</label>
                    <input type="text" class="form-control" id="descriptionEditInput${prodotto._id}" value="${prodotto.description}">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Price</label>
                    <input type="number" class="form-control" id="priceEditInput${prodotto._id}" value="${prodotto.price}">
                </div>
                <div class="form-group">
                    <label for="imageInput">Image url</label>
                    <input type="text" class="form-control" id="imageEditInput${prodotto._id}" value="${prodotto.img}">
                </div>
                <div class="form-group">
                    <label for="tagInput">Tag</label>
                    <select name="pets" id="tagEditInput${prodotto._id}">
                        <option value="food">Food</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="clothing">Clothing</option>
                        <option value="toy">Toy</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="animalInput">Animal</label>
                    <select name="pets" id="animalEditInput${prodotto._id}">
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="fish">Fish</option>
                        <option value="bird">Bird</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" id="saveEditProduct${prodotto._id}">Save</button>
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
    if (document.getElementById("formcontainer").style.display == "none") {
        document.getElementById("formcontainer").style.display = "block";
    } else if (document.getElementById("formcontainer").style.display == "block") {
        document.getElementById("formcontainer").style.display = "none";
    }
    document.getElementById("saveClient").addEventListener("click", function(event) {
        event.preventDefault();
        const name = document.getElementById("nameInput").value;
        const img = document.getElementById("imageInput").value;
        const tag = document.getElementById("tagInput").value;
        const animal = document.getElementById("animalInput").value;
        const price = document.getElementById("priceInput").value;
        const description = document.getElementById("descriptionInput").value;
        if (name != "" && img != "" && tag != "" && animal != "" && price != "" && description != "") {
            document.getElementById("formcontainer").style.display = "none";
            fetch('/db/collectionsize?collection=products', {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(prodotti => {
                    let obj = {
                        collection: 'products',
                        elem: {
                            "name": document.getElementById("nameInput").value,
                            "description": document.getElementById("descriptionInput").value,
                            "price": document.getElementById("priceInput").value,
                            "img": document.getElementById("imageInput").value,
                            "tag": document.getElementById("tagInput").value,
                            "animal": document.getElementById("animalInput").value
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
        }
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
    productId = JSON.stringify(jsonDataid);
    if (document.getElementById("formcontainer" + productId).style.display == "none") {
        document.getElementById("formcontainer" + productId).style.display = "block";
    } else if (document.getElementById("formcontainer" + productId).style.display == "block") {
        document.getElementById("formcontainer" + productId).style.display = "none";
    }
    document.getElementById("saveEditProduct" + productId).addEventListener("click", e => {
        e.preventDefault();
        const name = document.getElementById("nameEditInput" + jsonDataid).value;
        const img = document.getElementById("imageEditInput" + jsonDataid).value;
        const tag = document.getElementById("tagEditInput" + jsonDataid).value;
        const animal = document.getElementById("animalEditInput" + jsonDataid).value;
        const price = document.getElementById("priceEditInput" + jsonDataid).value;
        const description = document.getElementById("descriptionEditInput" + jsonDataid).value;
        if (name != "" && img != "" && tag != "" && animal != "" && price != "" && description != "") {
            fetch('/db/element?id=' + jsonDataid + '&collection=products', {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => {
                    data = data.result;
                    console.log(data._id);
                    let obj = {
                        collection: 'products',
                        elem: {
                            "_id": productId,
                            "name": document.getElementById("nameEditInput" + jsonDataid).value,
                            "img": document.getElementById("imageEditInput" + jsonDataid).value,
                            "tag": document.getElementById("tagEditInput" + jsonDataid).value,
                            "animal": document.getElementById("animalEditInput" + jsonDataid).value,
                            "price": document.getElementById("priceEditInput" + jsonDataid).value,
                            "description": document.getElementById("descriptionEditInput" + jsonDataid).value
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
                })
        }
    })
}

function logout() {
    const longinInfo = {
        islogged: false,
        id: ""
    }
    localStorage.setItem("login", JSON.stringify(longinInfo));
}
/*
function saveEdit(jsonDataid) {
    console.log(jsonDataid);
    fetch('/db/element?id=' + jsonDataid + '&collection=products', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            let obj = {
                collection: 'products',
                elem: {
                    "_id": JSON.stringify(jsonDataid),
                    "name": document.getElementById("nameEditInput" + jsonDataid).value,
                    "description": document.getElementById("descriptionEditInput" + jsonDataid).value,
                    "price": document.getElementById("priceEditInput" + jsonDataid).value,
                    "img": document.getElementById("imageEditInput" + jsonDataid).value,
                    "tag": data.tag,
                    "animal": data.animal
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
        })
}
*/