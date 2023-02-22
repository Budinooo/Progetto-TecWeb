import { writable } from "svelte/store";

const storedQuiz = localStorage.getItem("quiz");
export const quiz = writable(storedQuiz || 'null');
quiz.subscribe(value => {
    localStorage.setItem("quiz", value);
});
