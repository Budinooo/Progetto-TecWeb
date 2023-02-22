<script>
    import Word from "./Word.svelte";
    import { Popover } from 'sveltestrap';
    import { wordle } from "./store";
    import { firework } from '../fireworks'
    import LoadingScreen from "../loading/LoadingScreen.svelte";

    var wordChosen;
    var attempts = 5;
    var wordsNumber = 1;
    var myWordle = JSON.parse($wordle);
    var isWordGenerated = false;
    var gameLost = false;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const generateWord = () => {
        gameLost = false;
        var res = randomAnimal().trim().split(/\s+/);
        if (res[res.length-1].length != 6)
            generateWord();
        else{
            wordsNumber = 1;
            wordChosen = res[res.length-1].toLowerCase();
            myWordle = {
                wordChosen: wordChosen,
                wordsNumber: wordsNumber,
                words: []
            }
            wordle.set(JSON.stringify(myWordle))
            isWordGenerated = true;
        } 
    }

    let guessedWord;

    const wordGuessed = () => {
		var res = guessedWord(true);
        switch (res){
            case 'NOWORD':
                // reminder inserita parola troppo corta 
                break;
            case 'CORRWORD':
                // parola giusta
                firework();
                break;
            case 'WRONGWORD':
                // parola sbagliata
                wordsNumber = wordsNumber + 1;
                if (--attempts <= 0){ // finiti i tentativi
                    alert("finiti tentativi")
                }
                break;
        }
	}

    const restart = () =>{
        generateWord();
        location.reload(); 
    }


    if (myWordle){
        wordsNumber = myWordle.wordsNumber;
        wordChosen = myWordle.wordChosen;
        isWordGenerated = true;
    }else
        generateWord();

     // 6 è la lunghezza più frequente .trim().split(/\s+/);

</script>

<LoadingScreen/>
<div class="container">
    <div class="titlepage" class:titlepagemob={screenWidth<500}> <span class="capital">W</span>ORDLE</div>
</div>
<div class="container containerx flex content">
    <button id="info"><i class="bi-info-circle" class:imob={screenWidth<500}></i></button>
    <Popover placement="left" target="info">
        <div slot="title">
          How to play <b>Wordle</b>
        </div>
        Try to guess the word. The word will always be an animal of 6 letters. Each box contains a letter. After you fill each one,
        they will color. <span style="color: green">Green</span> means that the letter is correct and it is in the correct position.
        <span style="color: orange">Orange</span> means that the letter is correct and it is in the wrong position.
        <span style="color: red">Red</span> means that the letter is wrong. You only have <b>6</b> tries to guess the word. 
    </Popover>
    {#if isWordGenerated}
        {#each Array(wordsNumber) as _, index (index)}
            <Word {wordChosen} bind:guessWord={guessedWord} {index} {wordsNumber}/>
        {/each}
    {/if}
    {#if gameLost}
        <div style="color:#ff6a3d; width:100%; text-align:center; font-weight:bold; margin-top:20px"> I'm sorry, you had only 6 tries to guess the word. Restart the game to try again!</div>
    {/if}
    <div class="flex" style="justify-content:center; margin-top:20px; gap:10px;">
        <button id="guess" on:click={wordGuessed}>Guess</button>
        <button on:click={restart} style="border-radius: 10px;border: 3px solid black;">RESTART<i class="bi-arrow-clockwise"></i></button>
    </div>
</div>

<style>
    .containerx{
        justify-content: center;
        flex-direction: column;
        position: relative;
        margin-bottom: 200px;
    }

    #guess{
        border: 3px solid rgb(0, 0, 0);
        border-radius: 10px;
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