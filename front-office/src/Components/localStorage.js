import { writable } from "svelte/store";

const storedMemory = localStorage.getItem("memory");
export const memory = writable(storedMemory || 'null');
memory.subscribe(value => {
    localStorage.setItem("memory", value);
});