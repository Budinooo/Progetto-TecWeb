<script>
    import { fade } from 'svelte/transition';

    export var questionCategory;
    export var quizReady;

    var animalName;

    const questionCategories = ["scientific name", "belonging class", "prey","predator","lifespan", "diet"];

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })
    
    export const setQuestion = (animal) => {
        var i = Math.floor(Math.random() * questionCategories.length);
        animalName = animal.name;
        switch (i){
            case 0: 
                if (animal.taxonomy.scientific_name){
                    questionCategory = "scientific name";
                    return animal.taxonomy.scientific_name;
                }
            case 1:    
                if (animal.taxonomy.class){
                    questionCategory = "class";
                    return animal.taxonomy.class;
                }
            case 2:
                if (animal.characteristics.prey){
                    questionCategory = "prey";
                    return animal.characteristics.prey;
                }
                if (animal.characteristics.main_prey){
                    questionCategory = "prey";
                    return animal.characteristics.main_prey;
                }
            case 3:
                if (animal.characteristics.predators){
                    questionCategory = "predator";
                    return animal.characteristics.predators;
                }
            case 4:
                if (animal.characteristics.lifespan){
                    questionCategory = "lifespan";
                    return animal.characteristics.lifespan;
                }
            case 5:
                if (animal.characteristics.diet){
                    questionCategory = "diet";
                    return animal.characteristics.diet;
                }
        }
        setQuestion(animal);
    }

    export const setSavedQuestion = (name) =>{
        animalName = name;
    }
</script>

{#if quizReady}
    <p class:mobile={screenWidth<500} transition:fade>What is the {questionCategory} of the {animalName}?</p>
{/if}

<style>
    p{
        text-align: center;
        font-size: 180%;
        font-weight: bold;
        margin-top: 4vh;
    }

    .mobile{
        margin-top: 2vh;
        margin-bottom: -1vh;
    }
</style>