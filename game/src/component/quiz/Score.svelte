<script>
    import { fly } from 'svelte/transition';
    export var score;
    export var attemptsLeft;
    export var pointsModifier;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })
</script>

<div class="scorediv flex content" class:mobile={screenWidth<500}>
    <div class="score">SCORE:  {#key score}
        <span in:fly={{ y: -40 }}>{score}</span>
    {/key} &nbsp&nbsp&nbsp COMBO: {#key pointsModifier}
        <span in:fly={{ y: -40 }}>{pointsModifier}</span>
    {/key} </div>
    <div class="score">LIVES:  
        {#each Array(attemptsLeft) as _}
            <img src="images/heart.png" alt="life remaining">
        {/each}
    </div>
</div>

<style>
    .scorediv{
        margin: auto;
        text-align: center;
        justify-content: center;
        flex-direction: column;
        width: 40%;
        font-weight: bold;
        font-size: 150%;
        margin-top: 4vh;
    }

    img{
        width:10%;
    }

    .mobile{
        width: 100%;
    }
</style>