import { writable } from "svelte/store";

const storedWordle = localStorage.getItem("wordle");
export const wordle = writable(storedWordle || 'null');
wordle.subscribe(value => {
    localStorage.setItem("wordle", value);
});