// Connessione al database
/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const db = client.db("test");
    const usersCollection = db.collection("users");

    // Funzione per effettuare il login
    function login(username, password) {
        return usersCollection.findOne({ username: username, password: password })
            .then(user => {
                if (user) {
                    // Login riuscito, restituisci l'utente
                    return user;
                } else {
                    // Login fallito, restituisci un errore
                    return Promise.reject("Username o password errati");
                }
            });
    }

    // Esempio di chiamata alla funzione login
    login("user1", "password1")
        .then(user => {
            console.log("Login riuscito:", user);
            client.close();
        })
        .catch(err => {
            console.error("Errore:", err);
            client.close();
        });
});
*/


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
        setFormMessage(loginForm, "success", "You're logged in!");


        window.location.replace('../frontend/index.html');


    });

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