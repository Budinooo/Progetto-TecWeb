//const AuthController = require('./authController');
//import { User } from './login/user.js';
//const User = require('./login/User');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

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
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            // ricerca dell'utente nel file JSON
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

function registrazione(username, email, password) {
    // caricamento del file JSON degli utenti
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            // verifica che l'username o l'email non siano già presenti
            const userExists = data.some(u => u.username === username || u.email === email);
            if (userExists) {
                console.log("Utente già registrato con questo username o email.");
            } else {
                // creazione di un nuovo oggetto utente
                const newUser = {
                    username: username,
                    email: email,
                    password: password,
                    admin: '1'
                };
                // aggiunta del nuovo utente al file JSON
                //data.push(newUser);
                // salvataggio del file JSON aggiornato
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                };
                fetch('users.json', options)
                    .then(() => {
                        console.log("Utente registrato con successo.");
                        window.location.replace('/backoffice');
                    })
                    .catch(error => console.error(error));
            }
        });
}

////////

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('#login');
    const createAccount = document.querySelector('#createAccount');
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
        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                // ricerca dell'utente nel file JSON
                const user = data.find(u => u.username == username && u.password == password);
                if (user && user.admin == 1) {
                    // login effettuato con successo
                    console.log(`Benvenuto ${user.username}!`);
                    setFormMessage(loginForm, "success", "You're logged in!");
                    window.location.replace('./frontend/index.html');
                } else if (user && user.admin == 0) {
                    setFormMessage(loginForm, "error", "You're not an administrator!");
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
        var username = document.getElementById("createUsername").value;
        var email = document.getElementById("createMail").value;
        var password = document.getElementById("passwordCreate").value;
        var passwordConfirm = document.getElementById("confirmPasswordCreate").value;
        if (password == passwordConfirm) {
            registrazione(username, email, password);
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