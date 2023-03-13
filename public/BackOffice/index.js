function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add('form_message--$(type)');
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector("form__input-error-message").textContent = message;
}

function clearInputElement(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector("form__input-error-message").textContent = "";
}

////////
function login(username, password) {
    // caricamento del file JSON degli utenti
    fetch('/db/collection?collection=users', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // ricerca dell'utente nel file JSON
            data = data.result;
            const user = data.find(u => u.username === username && u.password === password);
            if (user) {
                // login effettuato con successo
                console.log(`Benvenuto ${user.username}!`);
                log = true;
            } else {
                // login fallito
                console.log("Credenziali non valide.");
            }
        });
}

function registrazione(name, username, email, password) {
    // caricamento del file JSON degli utenti
    fetch('/db/collection?collection=users', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            data = data.result;
            // verifica che l'username o l'email non siano già presenti
            const userExists = data.some(u => u.username === username || u.email === email);
            if (userExists) {
                console.log("Utente già registrato con questo username o email.");
            } else {
                fetch('/db/collectionsize?collection=users', {
                        method: 'GET'
                    }).then(response => response.json())
                    .then(data => {
                        // creazione di un nuovo oggetto utente
                        const newUser = {
                            "name": name,
                            "username": username,
                            "email": email,
                            "password": password,
                            "favorites": [],
                            "pets": [],
                            "score": 0,
                            "admin": 0
                        };
                        const elem = {
                                collection: 'users',
                                elem: newUser
                            }
                            // aggiunta del nuovo utente al file JSON
                            //data.push(newUser);
                            // salvataggio del file JSON aggiornato
                        const options = {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(elem)
                        };
                        fetch('/db/element', options)
                            .then(() => {
                                console.log("Utente registrato con successo.");
                                window.location.replace('/login');
                                fetch('/db/collection?collection=users', {
                                        method: 'GET'
                                    }).then(response => response.json())
                                    .then(data => console.log(data.result))
                            })
                            .catch(error => console.error(error));
                    })
            }
        });
}

////////

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('#login');
    const createAccount = document.querySelector('#createAccount');
    let local = JSON.parse(localStorage.getItem("login"))
    console.log(local);
    //debugger;
    if (local.islogged) {
        fetch('/db/element?id=' + local.id + '&collection=users', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result;
                if (data.admin == 1) {
                    console.log(data);
                    //debugger;
                    setFormMessage(loginForm, "success", "You're logged in!");
                    const longinInfo = {
                        islogged: true,
                        id: data._id
                    }
                    localStorage.setItem("login", JSON.stringify(longinInfo))
                    window.location.replace('./frontend/index.html');
                }
            })
    }
    document.querySelector('#linkCreateAccount').addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccount.classList.remove("form--hidden");
    });
    document.querySelector('#linkLogin').addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccount.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        //login
        var username = document.getElementById("loginUsername").value;
        var password = document.getElementById("loginPassword").value;
        fetch('/db/collection?collection=users', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = data.result
                    // ricerca dell'utente nel file JSON
                const user = data.find(u => u.username == username && u.password == password);
                if (user && user.admin == 1) {
                    // login effettuato con successo
                    console.log(`Benvenuto ${user.username}!`);
                    setFormMessage(loginForm, "success", "You're logged in!");
                    const longinInfo = {
                        islogged: true,
                        id: user._id
                    }
                    localStorage.setItem("login", JSON.stringify(longinInfo))
                    window.location.replace('./frontend/index.html');
                } else if (user && user.admin == 0) {
                    setFormMessage(loginForm, "error", "You're not an administrator!");
                    const longinInfo = {
                        islogged: true,
                        id: user._id
                    }
                    localStorage.setItem("login", JSON.stringify(longinInfo))
                    window.location.replace("/")
                } else {
                    // login fallito
                    console.log("Credenziali non valide.");
                    setFormMessage(loginForm, "error", "Something went wrong!");
                }
            });
    });

    /////
    createAccount.addEventListener("submit", e => {
        e.preventDefault();

        //registrazione
        var name = document.getElementById("createName").value;
        var username = document.getElementById("createUsername").value;
        var email = document.getElementById("createMail").value;
        var password = document.getElementById("passwordCreate").value;
        var passwordConfirm = document.getElementById("confirmPasswordCreate").value;
        if (password == passwordConfirm) {
            registrazione(name, username, email, password);
        }
    });
    ////

    document.querySelectorAll("form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id == "signUpUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters");
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputElement(inputElement);
        });
    });
});