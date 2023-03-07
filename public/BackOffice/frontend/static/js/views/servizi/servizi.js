fetch('/db/collection?collection=services', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(services => {
        services = services.result;
        let servicesHtml = '';
        var data = [];
        let dateHtml = [];
        for (var i = 0; i < services.length; i++) {
            var service = services[i];
            dateHtml[i] = '';
            data = service.availability;
            servicesHtml += `
        <div class="container">
            <div class="col-sm-4">
                <h2 class="title" style="margin-top:50px">${service.name}</h2>
                <img class="card-img-top" src="${service.img}" alt="${service.name}" style="width: 18rem;">
                <p>Description: ${service.description}</p>
                <p>Place: ${service.place}</p>
                <p id="date">Availability:  ${service.availability}</p>
                <button class="btn btn-warning" id="edit-${service._id}" onclick="editService(${service._id})" style="margin-top: 5px">Edit</button>
                <button class="btn btn-primary" id="availability-${service._id}" onclick="addAvailability(${service._id})" style="margin-top: 5px">Add Availabile Date</button>
                <button class="btn btn-danger" id="availability-${service._id}" onclick="removeAvailability(${service._id})" style="margin-top: 5px">Remove Availabile Date</button>
                <button class="btn btn-danger" id="remove-${service._id}" onclick="removeService(${service._id})" style="margin-top: 5px">Remove</button>
            </div>
            <div class="container" id="formdate${service._id}" style="display:none; width:500px">
            <form class="form form--hidden" id="addDateForm">
            <div class="form-group">
                <label for="scoreInput">New Date</label>
                <input type="date" class="form-control" id="newDateService${service._id}">
            </div>
            <button type="submit" class="btn btn-primary" id="saveDateService${service._id}">Save</button>
        </form>
            </div>
            <div class="container" id="removeDatecontainer${service._id}" style="display: none">
                <div class="container" id="availableDate${service._id}" style="margin-left:50px; margin-bottom:50px" style="max-width: 100%"></div>
            </div>
            <div class="container" id="formEditcontainer` + service._id + `" style="display:none">
            <form class="form form--hidden" id="editServiceForm">
                <div class="form-group">
                    <label for="scoreInput">Name</label>
                    <input type="text" class="form-control" id="nameEditService` + service._id + `" value="` + service.name + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Description</label>
                    <input type="text" class="form-control" id="descriptionEditService` + service._id + `" value="` + service.description + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Place</label>
                    <input type="text" class="form-control" id="placeEditService` + service._id + `" value="` + service.place + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Price</label>
                    <input type="text" class="form-control" id="priceEditService` + service._id + `" value="` + service.price + `">
                </div>
                <div class="form-group" style="display:none">
                    <label for="scoreInput">Date</label>
                    <input type="text" class="form-control" id="dateEditService` + service._id + `" value="` + service.availability + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Image</label>
                    <input type="text" class="form-control" id="imageEditService` + service._id + `" value="` + service.img + `">
                </div>
                <button type="submit" class="btn btn-primary" id="saveEditService` + service._id + `">Save</button>
            </form>
        </div>
        </div>

      `;
            for (var j = 0; j < data.length; j++) {
                let date = data[j];
                dateHtml[i] += `
                <button class="btn btn-danger" id="date${service._id}" style="margin-top: 5px" onclick="removeDate(${service._id},` + j + `)">` + date + `</button>
                `;
            }
        };
        document.getElementById('services').innerHTML = servicesHtml;
        for (var i = 0; i < services.length; i++) {
            var service = services[i];
            document.getElementById('availableDate' + service._id).innerHTML = dateHtml[i];
        };
    });
/*
function bookService(serviceId) {
    // logica per la prenotazione del servizio
    document.getElementById("formdate" + serviceId).style.display = "block";
    fetch('services.json')
        .then(response => response.json())
        .then(services => {
            let servicesHtml = '';
            services.forEach(service => {
                if (service.id == serviceId) {
                    service.availability.forEach(date => {
                        servicesHtml += `
                        <option value=${date.date}>${date.date}</option>
                        `;
                    });
                }

            });
            document.getElementById('bookDate').innerHTML = servicesHtml;
        });
}
*/
function editService(serviceId) {
    // logica per la modifica del servizio
    if (document.getElementById("formEditcontainer" + serviceId).style.display == "none") {
        document.getElementById("formEditcontainer" + serviceId).style.display = "block";
    } else if (document.getElementById("formEditcontainer" + serviceId).style.display == "block") {
        document.getElementById("formEditcontainer" + serviceId).style.display = "none";
    }
    document.getElementById('saveEditService' + serviceId).addEventListener("click", e => {
        e.preventDefault();
        const id = JSON.stringify(serviceId);
        const name = document.getElementById("nameEditService" + serviceId).value;
        const description = document.getElementById("descriptionEditService" + serviceId).value;
        const place = document.getElementById("placeEditService" + serviceId).value;
        const price = document.getElementById("priceEditService" + serviceId).value;
        const date = (document.getElementById("dateEditService" + serviceId).value).split(",");
        const img = document.getElementById("imageEditService" + serviceId).value;
        if (name != "" && img != "" && place != "" && price != "" && description != "") {
            let obj = {
                collection: 'services',
                elem: {
                    "_id": id,
                    "name": name,
                    "description": description,
                    "price": price,
                    "place": place,
                    "availability": date,
                    "img": img
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
            document.getElementById("formEditcontainer").style.display = "none";
        }
    });
}

function addAvailability(serviceId) {
    // logica per la visualizzazione della disponibilità del servizio
    if (document.getElementById("formdate" + serviceId).style.display == "none") {
        document.getElementById("formdate" + serviceId).style.display = "block";
    } else if (document.getElementById("formdate" + serviceId).style.display == "block") {
        document.getElementById("formdate" + serviceId).style.display = "none";
    }
    document.getElementById("saveDateService" + serviceId).addEventListener("click", e => {
        e.preventDefault();
        let newDate = document.getElementById("newDateService" + serviceId).value;
        //debugger;
        fetch('/db/element?id=' + serviceId + '&collection=services', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                let date = data.availability;
                date.push(newDate);
                let obj = {
                    collection: 'services',
                    elem: {
                        "_id": JSON.stringify(serviceId),
                        "name": data.name,
                        "description": data.description,
                        "price": data.price,
                        "place": data.place,
                        "img": data.img,
                        "availability": date
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
        document.getElementById("formdate" + serviceId).style.display = "none";
    })
}

function removeAvailability(serviceId) {
    if (document.getElementById("removeDatecontainer" + serviceId).style.display === "none") {
        document.getElementById("removeDatecontainer" + serviceId).style.display = "block";
    } else if (document.getElementById("removeDatecontainer" + serviceId).style.display === "block") {
        document.getElementById("removeDatecontainer" + serviceId).style.display = "none";
    }
}

function removeDate(serviceId, newDate) {
    // logica per la rimozione della disponibilità del servizio
    //debugger;
    fetch('/db/element?id=' + serviceId + '&collection=services', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            let date = data.availability;
            date.splice(newDate, 1);
            let obj = {
                collection: 'services',
                elem: {
                    "_id": JSON.stringify(serviceId),
                    "name": data.name,
                    "description": data.description,
                    "price": data.price,
                    "place": data.place,
                    "img": data.img,
                    "availability": date
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

function saveDate(serviceId) {
    let newDate = JSON.stringify(document.getElementById("dateService" + serviceId).value);
    if (newDate != "") {
        fetch('/db/element?id=' + serviceId + '&collection=services', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                let date = data.availability;
                date.push(newDate);
                let obj = {
                    collection: 'services',
                    elem: {
                        "_id": JSOn.stringify(serviceId),
                        "name": data.name,
                        "description": data.description,
                        "price": data.price,
                        "img": data.img,
                        "availability": date
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
        document.getElementById("formdate" + serviceId).style.display = "none";
    }
}

function removeService(serviceId) {
    // logica per la modifica del servizio
    let obj = {
        collection: 'services',
        id: JSON.stringify(serviceId)
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