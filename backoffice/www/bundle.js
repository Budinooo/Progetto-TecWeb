document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("#login"),t=document.querySelector("#createAccount");document.querySelector("#linkCreateAccount").addEventListener("click",(n=>{n.preventDefault(),e.classList.add("form--hidden"),t.classList.remove("form--hidden")})),document.querySelector("#linkLogin").addEventListener("click",(n=>{n.preventDefault(),e.classList.remove("form--hidden"),t.classList.add("form--hidden")})),e.addEventListener("submit",(t=>{t.preventDefault(),function(e,t,n){const r=e.querySelector(".form__message");r.textContent="You're logged in!",r.classList.remove("form__message--success","form__message--error"),r.classList.add("form_message--$(type)")}(e),window.location.replace("../frontend/index.html")})),document.querySelectorAll("form__input").forEach((e=>{e.addEventListener("blur",(t=>{"signUpUsername"==t.target.id&&t.target.value.length>0&&t.target.value.length<10&&function(e,t){e.classList.add("form__input--error"),e.parentElement.querySelector("form__input-error-message").textContent="Username must be at least 10 characters"}(e)})),e.addEventListener("input",(t=>{!function(e){e.classList.remove("form__input--error"),e.parentElement.querySelector("form__input-error-message").textContent=""}(e)}))}))})),fetch("utenti.json").then((e=>e.json())).then((e=>{let t="";e.forEach((e=>{t+=`\n        <div class="col-sm-4">\n          <div class="card">\n            <div class="card-body">\n              <h5 class="card-title">${e.name}</h5>\n              <p class="card-text">Animali preferiti: ${e.favorites}</p>\n              <p class="card-text">Punteggio giochi: ${e.score}</p>\n              <button class="btn btn-primary" onclick="editClient(${e})">Modifica</button>\n              <button class="btn btn-danger" onclick="removeClient(${e.id})">Rimuovi</button>\n            </div>\n          </div>\n        </div>\n      `})),document.getElementById("clients").innerHTML=t}));