var idService = [];
var selectedLocation;
var locations = [];
var services = [];

fetch('/db/collection?collection=services', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        services = data.result;

        fetch('/db/collection?collection=locations', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                locations = data.result;
                let locationsHtml = '';
                for (let i = 0; i < locations.length; i++) {
                    var location = locations[i];
                    locationsHtml += `
                    <option value="${location.name}">${location.name}</option>
                `;
                }
                document.getElementById("locations").innerHTML += locationsHtml;
                selectLocation();
            })
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

function selectLocation() {
    selectedLocation = locations.find(location => location.name == document.getElementById("locations").value)
    let servicesHtml = '';
    var data = [];
    let dateHtml = [];
    for (var i = 0; i < selectedLocation.services.length; i++) {
        const service = services.find(service => service.name == selectedLocation.services[i].name)
        idService[i] = service._id;
        dateHtml[i] = '';
        data = selectedLocation.services[i].availability;
        servicesHtml += `
        <div class="container">
            <div class="col-sm-4">
                <h2 class="title" style="margin-top:50px">${service.name}</h2>
                <img class="card-img-top" src="${service.img}" alt="${service.name}" style="width: 18rem;">
                <p>Description: ${service.description}</p>
                <p>Place: ${selectedLocation.name}</p>
                <p>Price: €${service.price}</p>
                <p id="date">Availability:  ${selectedLocation.services[i].availability}</p>
                <button class="btn btn-warning" id="edit-${i}" onclick="editService(${i})" style="margin-top: 5px">Edit</button>
                <button class="btn btn-primary" id="availability-${i}" onclick="addAvailability(${i})" style="margin-top: 5px">Add Availabile Date</button>
                <button class="btn btn-danger" id="availability-${i}" onclick="removeAvailability(${i})" style="margin-top: 5px">Remove Availabile Date</button>
                <button class="btn btn-danger" id="remove-${i}" onclick="formRemoveService(${i})" style="margin-top: 5px">Remove</button>
            </div>
            <div class="container" id="formdate${i}" style="display:none; width:500px">
            <form class="form form--hidden" id="addDateForm">
            <div class="form-group">
                <label for="scoreInput">New Date</label>
                <input type="date" class="form-control" id="newDateService${i}">
            </div>
            <button type="submit" class="btn btn-primary" id="saveDateService${i}">Save</button>
        </form>
            </div>
            <div class="container" id="removeDatecontainer${i}" style="display: none">
                <div class="container" id="availableDate${i}" style="margin-left:50px; margin-bottom:50px" style="max-width: 100%"></div>
            </div>
            <div class="container" id="formRemovecontainer${i}" style="display:none">
            <h2>Are you sure?</h2>
            <button class="btn btn-danger" aria-pressed="false" aria-role="button" aria-label="Yes" onclick="removeService(${i})">yes</button>
            <button class="btn btn-primary" aria-pressed="false" aria-role="button" aria-label="No" onclick="formRemoveService(${i})">no</button>
          </div>
            <div class="container" id="formEditcontainer` + i + `" style="display:none">
            <form class="form form--hidden" id="editServiceForm">
                <div class="form-group">
                    <label for="scoreInput">Name</label>
                    <input type="text" class="form-control" id="nameEditService` + i + `" value="` + service.name + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Description</label>
                    <input type="text" class="form-control" id="descriptionEditService` + i + `" value="` + service.description + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Price</label>
                    <input type="number" class="form-control" id="priceEditService` + i + `" value="` + service.price + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Image</label>
                    <input type="text" class="form-control" id="imageEditService` + i + `" value="` + service.img + `">
                </div>
                <button type="submit" class="btn btn-primary" id="saveEditService` + i + `">Save</button>
            </form>
        </div>
        </div>

      `;
        for (var j = 0; j < data.length; j++) {
            let date = data[j];
            dateHtml[i] += `
            <button class="btn btn-danger" id="date${i}" style="margin-top: 5px" onclick="removeDate(${i},` + j + `)">` + date + `</button>
            `;
        }
    }
    document.getElementById('services').innerHTML = servicesHtml;
    for (var i = 0; i < selectedLocation.services.length; i++) {
        document.getElementById('availableDate' + i).innerHTML = dateHtml[i];
    };
}

function editService(serviceId) {
    // logica per la modifica del servizio
    if (document.getElementById("formEditcontainer" + serviceId).style.display == "none") {
        document.getElementById("formEditcontainer" + serviceId).style.display = "block";
    } else if (document.getElementById("formEditcontainer" + serviceId).style.display == "block") {
        document.getElementById("formEditcontainer" + serviceId).style.display = "none";
    }
    document.getElementById('saveEditService' + serviceId).addEventListener("click", e => {
        e.preventDefault();
        const id = idService[serviceId];
        const name = document.getElementById("nameEditService" + serviceId).value;
        const description = document.getElementById("descriptionEditService" + serviceId).value;
        const price = document.getElementById("priceEditService" + serviceId).value;
        const img = document.getElementById("imageEditService" + serviceId).value;
        if (name != "" && img != "" && price != "" && description != "") {
            let obj = {
                collection: 'services',
                elem: {
                    "_id": id,
                    "name": name,
                    "description": description,
                    "price": price,
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
                    if (name != services[serviceId].name) {
                        var locationsToModify = [];
                        for (var i = 0; i < locations.length; i++) {
                            var location = locations[i];
                            for (var j = 0; j < location.services.length; j++) {
                                if (location.services[j].name == services[serviceId].name) {
                                    location.services[j].name = name;
                                    locationsToModify.push(location);
                                    break;
                                }
                            }
                        }
                        for (var i = 0; i < locationsToModify.length; i++) {
                            let obj = {
                                collection: 'locations',
                                elem: locationsToModify[i]
                            }
                            fetch('/db/element', {
                                method: 'PUT',
                                headers: {
                                    'Content-type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(obj)
                            }).then(() => {
                                setTimeout(function() {
                                    document.location.reload();
                                }, 500)
                            })
                        }
                    }else{
                        document.location.reload();
                    }
                })
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
        if (newDate != "") {
            selectedLocation.services[serviceId].availability.push(newDate);
            let obj = {
                collection: 'locations',
                elem: selectedLocation
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
        }
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
    selectedLocation.services[serviceId].availability.splice(newDate, 1);
    let obj = {
        collection: 'locations',
        elem: selectedLocation
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
}

/*function saveDate(serviceId) {
    let newDate = JSON.stringify(document.getElementById("dateService" + serviceId).value);
    if (newDate != "") {
        fetch('/db/element?id=' + idService[serviceId] + '&collection=services', {
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
                        "_id": idService[serviceId],
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
}*/

function removeService(serviceId) {
    // logica per la modifica del servizio
    var services = selectedLocation.services;
    services.splice(serviceId, 1);
    let obj = {
        collection: 'locations',
        elem: {
            "_id": selectedLocation._id,
            "name": selectedLocation.name,
            "services": services
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
        ///////
        /*
        let obj = {
            collection: 'services',
            id: idService[serviceId]
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
            */
}

function logout() {
    const longinInfo = {
        islogged: false,
        id: ""
    }
    localStorage.setItem("login", JSON.stringify(longinInfo));
}

function formRemoveService(serviceId) {
    if (document.getElementById("formRemovecontainer" + serviceId).style.display === "none") {
        document.getElementById("formRemovecontainer" + serviceId).style.display = "block";
    } else if (document.getElementById("formRemovecontainer" + serviceId).style.display === "block") {
        document.getElementById("formRemovecontainer" + serviceId).style.display = "none";
    }
}

/*

                <div class="form-group">
                    <label for="scoreInput">Place</label>
                    <input type="text" class="form-control" id="placeEditService` + i + `" value="` + selectedLocation.name + `">
                </div>
                
                <div class="form-group" style="display:none">
                    <label for="scoreInput">Date</label>
                    <input type="text" class="form-control" id="dateEditService` + i + `" value="` + selectedLocation.services[i].availability + `">
                </div>
*/