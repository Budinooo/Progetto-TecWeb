import { writable } from "svelte/store";

const loginDefault = {
    islogged: false,
    id:""
}

const storedLogin = localStorage.getItem("login");
export const login = writable(storedLogin || JSON.stringify(loginDefault));
login.subscribe(value => {
    localStorage.setItem("login", value);
});