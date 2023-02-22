<script>
    import { tick } from "svelte";
    export var wordsNumber;
    export var wordChosen;
    export var index;
    import { wordle } from "./store";
    
    var myWord = JSON.parse($wordle);

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var letterTurn = 0;
    var input;
    const maxLenght = 1;

    const letterEntered = (event) => {
        if (isLetter(event)) {
            input = event.key;
            letterTurn++;
            setTimeout(function(){
                if (letterTurn >= 7)
                    letterTurn = 6;
                else
                    changeFocus(letterTurn)
            }, 100);
            
        }else if (event.key === "Backspace" || event.key === "Delete"){
            letterTurn--;
            setTimeout(function(){
                if (letterTurn > 0)
                    changeFocus(letterTurn)
            }, 100);
        }
    }

    const isLetter = (event) => {
        if(event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event.keyCode <= 122){
            return true;
        }else{
            return false;
        }
    }

    const changeFocus = (id) => {
        letterTurn = id;
        document.getElementById("letterBox"+id).focus();
    }
    console.log(wordChosen)

    export const guessWord = (toSave) => {
        var word = [];
        var isWordEntered = true;
        for (var i = 0; i <= 5; i++){
            word[i] = document.getElementById("letterBox"+(i+1)).value.toLowerCase();
            if (word[i] == null || word[i] == ' ' || word[i] == '')
                isWordEntered = false;
        }
        if (isWordEntered){
            if (toSave){
                let wordToAdd = [...myWord.words,word];
                myWord = {
                    wordChosen: wordChosen,
                    wordsNumber: wordsNumber+1,
                    words: wordToAdd
                }
                wordle.set(JSON.stringify(myWord))
            }
            var isWordCorrect = "CORRWORD";
            for (var i = 0; i <= 5; i++){
                if (!checkLetter(word[i], i+1))
                    isWordCorrect = "WRONGWORD";
                document.getElementById("letterBox"+(i+1)).removeAttribute('id')
            }
            return isWordCorrect;
        }
        return "NOWORD"; 
    }

    const checkLetter = (letter, index) => {
        if (wordChosen.charAt(index-1) == letter){
            document.getElementById("letterBox"+index).style.backgroundColor = "green"
            return true;
        }else if (searchLetter(letter)){
            document.getElementById("letterBox"+index).style.backgroundColor = "orange"
        }else{
            document.getElementById("letterBox"+index).style.backgroundColor = "red"
        }
        return false;
    }

    const searchLetter = (letter) => {
        var found = false;
        var i = 0;
        while (!found && i<wordChosen.length){
            if (wordChosen.charAt(i) == letter){
                found = true;
            }
            i++;
        }
        return found;
    }

    if (myWord?.wordsNumber > index + 1){
        tick().then(()=>{
            let word = myWord.words[index]
            for (let i = 0; i <= 5; i++){
                document.getElementById("letterBox"+(i+1)).value = word[i];
            }
            guessWord(false);
        })
    }
</script>

<div class="flex">
    {#each Array(wordChosen.length) as _, index (index)}
        <input id={"letterBox"+(index+1)} type="text" value="" on:keydown={letterEntered} class:mobile={screenWidth<500}
            on:click={()=>changeFocus(index+1)} style="text-transform:uppercase" maxlength={maxLenght}>
    {/each}
</div>

<style>
    .flex{
        justify-content: center;
        width: 100%;
    }

    div > input{
        width: 75px;
        height: 75px;
        max-width: 16%;
        text-align: center;
        font-weight: bold;
        font-size: 200%;
        border: 4px solid black;
        margin-right: 2px;
        margin-top: 4px;
    }

    .mobile{
        width: 60px;
        height: 60px;
        max-width: 16%;
        font-size: 160%;
    }
</style>