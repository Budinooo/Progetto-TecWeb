fetch('/db/collection?collection=services', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(services => {
        services = services.result;
        let servicesHtml = '';
        let dateHtml = '';
        services.forEach(service => {
            servicesHtml += `
        <div class="container">
            <div class="col-sm-4">
                <h2 class="title" style="margin-top:50px">${service.name}</h2>
                <img class="card-img-top" src="${service.img}" alt="${service.name}" style="width: 18rem;">
                <p>Description: ${service.description}</p>
                <p>Place: ${service.place}</p>
                <p id="date">Availability:  ${service.availability}</p>
                <button class="btn btn-warning" id="edit-${service._id}" onclick="editService(${service._id})">Edit</button>
                <button class="btn btn-primary" id="availability-${service._id}" onclick="addAvailability(${service._id})">Add Availabile Date</button>
                <button class="btn btn-danger" id="remove-${service._id}" onclick="removeService(${service._id})">Remove</button>
            </div>
            <div class="container" id="formdate${service._id}" style="display:none; width:500px">
            <form class="form form--hidden" id="addDateForm">
            <div class="form-group">
                <label for="scoreInput">New Date</label>
                <input type="date" class="form-control" id="dateService${service._id}">
            </div>
            <button type="submit" class="btn btn-primary" id="saveService" onclick="saveDate(${service._id})">Save</button>
        </form>
            </div>
            <div class="container" id="formcontainer` + service._id + `" style="display:none">
            <form class="form form--hidden" id="editServiceForm">
                <div class="form-group">
                    <label for="scoreInput">Name</label>
                    <input type="text" class="form-control" id="nameService` + service._id + `" value="` + service.name + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Description</label>
                    <input type="text" class="form-control" id="descriptionService` + service._id + `" value="` + service.description + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Place</label>
                    <input type="text" class="form-control" id="placeService` + service._id + `" value="` + service.price + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Availability</label>
                    <input type="date" class="form-control" id="dateService` + service._id + `" value="` + service.availability + `">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Availability</label>
                    <input type="date" class="form-control" id="imageService` + service._id + `" value="` + service.img + `">
                </div>
                <button type="submit" class="btn btn-primary" id="saveService` + service._id + `">Save</button>
            </form>
        </div>
        </div>

      `;
        });
        document.getElementById('services').innerHTML = servicesHtml;
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
    document.getElementById("formcontainer" + serviceId).style.display = "block";
    document.querySelector('#saveService' + serviceId).addEventListener("click", e => {
        const id = serviceId;
        const name = document.querySelector('#nameService' + serviceId).value;
        const description = document.querySelector('#descriptionService' + serviceId).value;
        const place = document.querySelector('#placeService' + serviceId).value;
        const date = document.querySelector('#dateService' + serviceId).value;
        const img = document.querySelector('#imageService' + serviceId).value;
        let obj = {
            collection: 'services',
            elem: {
                "_id": JSON.stringify(id),
                "name": JSON.stringify(name),
                "description": JSON.stringify(description),
                "place": JSON.stringify(place),
                "date": date,
                "img": JSON.stringify(img)
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
        document.getElementById("formeditcontainer").style.display = "none";
    });
}

function addAvailability(serviceId) {
    // logica per la visualizzazione della disponibilità del servizio
    document.getElementById("formdate" + serviceId).style.display = "block";
}

function saveDate(serviceId) {
    let newDate = JSON.stringify(document.getElementById("dateService" + serviceId).value);
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