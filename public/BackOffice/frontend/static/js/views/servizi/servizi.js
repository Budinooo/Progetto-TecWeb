fetch('services.json')
    .then(response => response.json())
    .then(services => {
        let servicesHtml = '';
        let dateHtml = '';
        services.forEach(service => {
            servicesHtml += `
        <div class="container">
            <div class="col-sm-4">
                <h2 class="title" style="margin-top:50px">${service.name}</h2>
                <p>Description: ${service.description}</p>
                <p>Place: ${service.place}</p>
                <p id="date">Availability:  ${service.availability}</p>
                <button class="btn btn-primary" id="book-${service.id}" onclick="bookService(${service.id})">Book</button>
                <button class="btn btn-warning" id="edit-${service.id}" onclick="editService(${service.id})">Edit</button>
                <button class="btn btn-danger" id="availability-${service.id}" onclick="addAvailability(${service.id})">Add Availabile Date</button>
                <button class="btn btn-danger" id="remove-${service.id}" onclick="removeService(${service.id})">Remove</button>
            </div>
            <div class="container" id="formdate${service.id}" style="display:none; width:500px">
            <form class="form form--hidden" id="addDateForm">
            <div class="form-group">
                <label for="scoreInput">New Date</label>
                <input type="date" class="form-control" id="dateService">
            </div>
            <button type="submit" class="btn btn-primary" id="saveService">Save</button>
        </form>
            </div>
            <div class="container" id="formcontainer` + service.id + `" style="display:none">
            <form class="form form--hidden" id="editServiceForm">
                <div class="form-group">
                    <label for="scoreInput">Name</label>
                    <input type="text" class="form-control" id="nameService">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Description</label>
                    <input type="text" class="form-control" id="descriptionService">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Place</label>
                    <input type="text" class="form-control" id="placeService">
                </div>
                <div class="form-group">
                    <label for="scoreInput">Availability</label>
                    <input type="date" class="form-control" id="dateService">
                </div>
                <button type="submit" class="btn btn-primary" id="saveService">Save</button>
            </form>
        </div>
        </div>

      `;
        });
        document.getElementById('services').innerHTML = servicesHtml;
        $('.date').datepicker({
            multidate: true,
            format: 'dd-mm-yyyy'
        });

    });

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

function editService(serviceId) {
    // logica per la modifica del servizio
    document.getElementById("formcontainer" + serviceId).style.display = "block";
}

function addAvailability(serviceId) {
    // logica per la visualizzazione della disponibilità del servizio
    //scrivere dato di data aggiunta
    document.getElementById("formdate" + serviceId).style.display = "block";
}

function saveDate(serviceId) {
    console.log(serviceId);
    document.getElementById("formdate" + serviceId).style.display = "none";
}

function removeService(serviceId) {
    // logica per la modifica del servizio
    document.getElementById("formcontainer" + serviceId).style.display = "block";
}