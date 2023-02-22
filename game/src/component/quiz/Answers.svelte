<script>
    import { createEventDispatcher } from 'svelte'
    import { fly } from 'svelte/transition';

    export var correctAnswer;
    export var questionCategory;
    export var quizReady;
    export var pointsModifier;
    export var correctAnswerPosition;
    export var wrongAnswers = [];

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const scientificNames = ["Panthera leo", "Otariidae", "Felis catus", "Loxodonta cyclotis","Carassius auratus","Carcharodon carcharias",
        "Formicidae", "Danaus plexippus","Diomedeidae", "Chiroptera", "Falco peregrinus", "Canis lupus", "haliaeetus leucocephalus",
        "Lampyridae", "Naja naja", "Cerastes cerastes", "Balsenoptera musculus", "Oryctolagus cuniculus","Mesocricetus auratus",
        "Ostreidae", "Siluriformes", "Bos Taurus", "Gallus gallus","Syncerus caffer","Terrapene carolina"];

    const diet = ["Carnivore", "Herbivore", "Omnivore"];

    const belongingClass = ["Mammalia","Reptilia","Aves","Arachnida","Insecta","Actinopterygii","Chondrichthyes"];

    const prey = ["Grass, Seeds, Flowers","Deer, Tapir, Wild Boar", "Insects, roots, fruit, flowers, amphibians", "Grass, Fruit, Roots",
        "Human, Lion, Hyena","Squid, krill, and fish","Mice, Frogs, Fruit", "Insects, Small mammals and reptiles","tarantulas",
        "Fish, birds, and small mammals","Any existing animal","Bamboo, Fruits, Rodents", "Krill, Crustaceans, Small Fish",
        "Seals, Sea Lions, Dolphins","Rodents, lizards, and frogs","Leaves, Fruit, Flowers","Fish, crustaceans, deer, buffalo"];

    const predator = ["Dogs, skunks, raccoons, snakes and some birds","Humans, sharks, cats, and rats","Owls, Eagles, Snakes",
        "Birds, Reptiles, Mammals","Roadrunners and bullfrogs","Wolverines, bobcats, foxes, bears, raccoons, and birds","Any existing animal",
        "Humans, Killer Whale pods","Waterbirds, turtles, larger fish","Human, Leopard, Crocodile","Humans, Large felines, Birds of prey",
        "Humans","Human, Fox, Raccoon"];

    const lifespan = ["3 - 8 years","12 - 15 years","25-30 years","100 plus years","60 - 70 years","A few weeks to four to five months",
        "3-5 years","9-10 years","1 day","A few hours","30 - 45 years"];

    export const defineAnswers = () => {
        wrongAnswers=[];
        correctAnswerPosition = Math.floor(Math.random() * 4);
        var answers = [];
        switch(questionCategory){
            case "scientific name":
                answers = scientificNames;
                break;
            case "class":
                answers = belongingClass;
                break;
            case "prey":
                answers = prey;
                break;
            case "predator":
                answers = predator;
                break;
            case "lifespan":
                answers = lifespan;
                break; 
            case "diet":
                answers = diet;
                correctAnswerPosition = Math.floor(Math.random() * 3);
                break;
            default:
                console.log("defaulr")     
        }
        addWrongAnswers(answers);
        addWrongAnswers(answers);
        if (questionCategory != "diet"){
            addWrongAnswers(answers); 
        }else if (wrongAnswers.length === 2){
            wrongAnswers.push(correctAnswer);
        }
    }

    const addWrongAnswers = (answers) => {
        if (correctAnswerPosition === 0 && wrongAnswers.length === 0)
            wrongAnswers.push(correctAnswer);
        var i = Math.floor(Math.random() * answers.length);
        var found = false;
        if (answers[i] == correctAnswer)
            found = true;
        else{
            wrongAnswers.forEach((element) => {
                if (answers[i] === element){
                    found = true;
                }
            });
        }
        if (found)
            addWrongAnswers(answers);
        else if (wrongAnswers.length === correctAnswerPosition){
            wrongAnswers.push(correctAnswer);
            wrongAnswers.push(answers[i]);
        }else
            wrongAnswers.push(answers[i]);
        
        if (correctAnswerPosition === 3 && wrongAnswers.length === 3)
            wrongAnswers.push(correctAnswer);
    }

    const chooseCorrectAnswer = () => {
        let tmp = document.getElementsByClassName('correct');
        for (var i = 0; i < tmp.length; i++) {
            tmp[i].style.backgroundColor = 'rgb(33, 126, 7)'
        }
        gainPoints();
    } 

    const chooseWrongAnswer = () => {
        let tmp1 = document.getElementsByClassName('correct');
        for (let i = 0; i < tmp1.length; i++) {
            tmp1[i].style.backgroundColor = 'rgb(33, 126, 7)'
        }
        let tmp2 = document.getElementsByClassName('wrong');
        for (let i = 0; i < tmp2.length; i++) {
            tmp2[i].style.backgroundColor = 'rgb(168, 9, 9)'
        }
        losePoints();
    } 

    const dispatch = createEventDispatcher()

    const gainPoints = () => {
        dispatch('answerChoosen', {
            pointsModifier    
        })
        pointsModifier = pointsModifier + 5;
    }

    const losePoints = () => {
        pointsModifier = 0;
        dispatch('answerChoosen', {
            pointsModifier    
        })
        pointsModifier = 5;
    }
</script>

<div class="flex">
    {#each wrongAnswers as answer, index (index)}
        {#if correctAnswerPosition === index && quizReady}
            <button class="correct" class:mobile={screenWidth<500} on:click={chooseCorrectAnswer} transition:fly="{{ y: 200, duration: 600*(index+1) }}">{answer}</button> 
        {:else if quizReady}
            <button class="wrong" class:mobile={screenWidth<500} on:click={chooseWrongAnswer} transition:fly="{{ y: 200, duration: 600*(index+1) }}">{answer}</button> 
        {/if}
    {/each}
</div>


<style>
    .flex{
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    button{
        width: 40%;
        height: 14vh;
        border-radius: 10px;
        margin-top: 4vh;
        font-weight: bold;
        border: 3px solid black;
    }

    .mobile{
        width:80%;
        margin-top: 2vh;
    }
</style>