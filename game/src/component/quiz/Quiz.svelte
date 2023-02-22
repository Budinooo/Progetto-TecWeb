<script>
    import Answers from "./Answers.svelte";
    import Question from "./Question.svelte";
    import Score from "./Score.svelte";
    import { createEventDispatcher } from 'svelte'
    import {tick} from "svelte";
    import LoadingScreen from "../loading/LoadingScreen.svelte";
    import { Popover } from 'sveltestrap';
    import { quiz } from "./store";
    import Leaderboard from "./Leaderboard.svelte";

    var questionCategory;
    var animalName;
    var correctAnswer;
    var quizReady = false;
    var gameEnded = false;
    var attemptsLeft;
    var score;
    var pointsModifier = 5;
    var myQuiz = JSON.parse($quiz);
    var correctAnswerPosition;
    var answers;

    var questionObject;
    var answersObject;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const initQuiz = () => {
        gameEnded = false;
        if(myQuiz){
            attemptsLeft = myQuiz.attemptsLeft;
            score = myQuiz.score;
            pointsModifier = myQuiz.pointsModifier;
            questionCategory = myQuiz.questionCategory;
            correctAnswerPosition = myQuiz.correctAnswerPosition;
            answers = myQuiz.answers;
            questionObject.setSavedQuestion(myQuiz.animalName);
            tick().then(()=>{
                quizReady = true;
            })
        }else{
            attemptsLeft = 3;
            score = 0;
            chooseAnimal();
            createQuiz();
        }
    };

    const chooseAnimal = () =>{
        animalName = randomAnimal().trim().split(/\s+/);
        animalName = animalName[animalName.length-1];
    }

    const createQuiz = () =>{
        var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                let response = JSON.parse(xmlHttp.responseText);
                if (response.length>0){
                    let index = Math.floor(Math.random()*response.length);
                    animalName = response[index].name;
                    correctAnswer = questionObject.setQuestion(response[index]);
                    tick().then(()=>{
                        answersObject.defineAnswers();
                        saveQuiz();
                        quizReady = true;
                    })
                }else{
                    chooseAnimal();
                    createQuiz();
                }
                
            }
        }
        xmlHttp.open( "GET", 'https://api.api-ninjas.com/v1/animals?name=' + animalName, true ); 
        xmlHttp.setRequestHeader("X-Api-Key","XeRLqZeWmuiW7/PMyztdHQ==HoJJOzopIX90X1xe");
        xmlHttp.send( null );
    }

    const saveQuiz = () => {
        myQuiz = {
            animalName: animalName,
            score: score,
            pointsModifier: pointsModifier,
            attemptsLeft: attemptsLeft,
            questionCategory: questionCategory,
            correctAnswerPosition: correctAnswerPosition,
            answers: answers
        }
        quiz.set(JSON.stringify(myQuiz));
    }
    
    const dispatch = createEventDispatcher()

    const updateScore = (event) => {
        let value = event.detail.pointsModifier
        score += value;
        if (value <= 0){
            if (--attemptsLeft <= 0){
                //partita finita
                gameEnded = true;
                myQuiz = null;
                quiz.set(JSON.stringify(myQuiz));
                dispatch('matchEnded')
            }
        }

        if (attemptsLeft>0){
            //prossima domanda
            setTimeout(function(){
                quizReady = false;
            }, 1000);
            setTimeout(chooseAnimal, 3000);
            setTimeout(createQuiz, 3000);
        }
    }

    setTimeout(function(){
        initQuiz();
    }, 7200);//7200
</script>

<LoadingScreen/>
<div class="container">
    <div class="titlepage" class:titlepagemob={screenWidth<500}><span class="capital">Q</span>UIZ</div>
    <Score {score} {attemptsLeft} {pointsModifier}/>
    <div class="quiz content" class:mobile={screenWidth<500}>
        {#if gameEnded}
            <Leaderboard {score} on:replay={initQuiz}/>
        {:else}
            <button id="info"><i class="bi-info-circle" class:imob={screenWidth<500}></i></button>
            <Popover placement="left" target="info">
                <div slot="title">
                How to play <b>Quiz</b>
                </div>
                Get the highest <b>score</b> possible by guessing the right answer of each question. Pay attention: 
                if you guess more questions in a row your <b>combo</b> will increase and you will earn more and more points for each correct answer. 
                But, if you give the wrong answer you will have to start over with the basic combo. You have only 3 <span style="color:red">lives</span>
                available, with the third wrong answer the game will end. 
            </Popover>
            <Question bind:questionCategory={questionCategory} {quizReady} bind:this={questionObject}/>
            <Answers bind:this={answersObject} {questionCategory} {correctAnswer} {quizReady} bind:pointsModifier={pointsModifier}
                bind:wrongAnswers={answers} bind:correctAnswerPosition={correctAnswerPosition} on:answerChoosen={updateScore}/>
        {/if}
    </div>
</div>


<style>
    .quiz{
        width: 100%;
        height: 65vh;
        position: relative;
    }

    .mobile{
        height: 85vh;
    }

    #info{
        position: absolute;
        top: 0;
        right: 0;
        background-color: transparent;
        border: 1px solid transparent;
    }

    i{
        font-size: 120%;
    }

    .imob{
        font-size: 100%;
    }
</style>