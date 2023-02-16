fetch('services.json')
    .then(response => response.json())
    .then(services => {
        let servicesHtml = '';
        services.forEach(service => {
            servicesHtml += `
        <h2 class="title" style="margin-top:50px">${service.name}</h2>
        <p>Description: ${service.description}</p>
        <button class="btn btn-primary" id="book-${service.id}" onclick="bookService(${service.id})">Book</button>
        <button class="btn btn-warning" id="edit-${service.id}" onclick="editService(${service.id})">Edit</button>
        <button class="btn btn-danger" id="availability-${service.id}" onclick="showAvailability(${service.id})">Availability</button>
        <div id="calendar-${service.id}"></div>
      `;
        });
        document.getElementById('services').innerHTML = servicesHtml;
    });

function bookService(serviceId) {
    // logica per la prenotazione del servizio
}

function editService(serviceId) {
    // logica per la modifica del servizio
}

function showAvailability(serviceId) {
    // logica per la visualizzazione della disponibilità del servizio
}