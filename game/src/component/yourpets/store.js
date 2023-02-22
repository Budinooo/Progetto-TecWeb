import { writable } from "svelte/store";

const storedPets = localStorage.getItem("mypets");
export const myPets = writable(storedPets || '[]');
myPets.subscribe(value => {
    localStorage.setItem("mypets", value);
});