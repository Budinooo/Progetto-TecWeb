<script>
    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })
</script>

<div class="container">
    
    <div class="welcome" class:moblogguest={screenWidth<500}>
        WELCOME TO THE FUN ZONE
    </div>
    <div class='flex' class:mobileflex={screenWidth<500} style="justify-content:space-evenly">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='choosefun flex' class:mobile={screenWidth<500} >
            <div class="title" class:mobiletitle={screenWidth<500}><div>GAMES</div> </div>
            <div class = "fun flex" class:mobfun={screenWidth<500}>
                <a class='game flex' class:mobilefun={screenWidth<500} href="/game/quiz"><img src="images/answer.png" alt="quiz"> QUIZ </a>
                <a class='game flex' class:mobilefun={screenWidth<500} href="/game/wordle"><img src="https://static01.nyt.com/images/2022/03/02/crosswords/alpha-wordle-icon-new/alpha-wordle-icon-new-square320-v3.png?format=pjpg&quality=75&auto=webp&disable=upscale" alt="wordle">WORDLE </a>
                <a class='game flex' class:mobilefun={screenWidth<500} href="/game/memory"><img src="images/memory.png" alt="memory">MEMORY </a>
            </div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='choosefun flex' class:mobile={screenWidth<500} >
            <div class="title"  class:mobiletitle={screenWidth<500}><div>INFO & VIDEOS</div></div>
            <div class = "fun flex" class:mobfun={screenWidth<500}>
                <a class='entertainment flex' class:mobilefun={screenWidth<500} href="/funnyvideos"><img src="images/youtube.png" alt="funny videos">FUNNY VIDEOS </a>
                <a class='entertainment flex' class:mobilefun={screenWidth<500} href="/animalinfo"><img src="images/did-you-know.png" alt="quiz">ANIMAL INFO </a>
                <a class='entertainment flex' class:mobilefun={screenWidth<500} href="/medinfo"><img src="images/stethoscope.png" alt="quiz">MEDICAL INFO </a>
            </div>
        </div>
    </div>
    <div class="logguest" class:moblogguest={screenWidth<500}>
        <a href="/" style="color:#ff6a3d; font-weight:800">LOG IN</a>  OR KEEP PLAYING AS A <span style="color:#ff6a3d; font-weight:800">GUEST</span> 
    </div>
    
</div>

<style>
    .fun{
        width: 100%;
        height: 84%;
        flex-wrap: wrap;
        justify-content:  space-evenly;
        background-color: white;
        padding-bottom: 10px;
    }

    .mobfun{
        height: 80%;
    }

    a{
        color: black;
    }

    a:hover{
        color: black; 
    }

    .welcome{
        border: 8px solid #1a2238;
        border-radius: 10px;
        margin: auto;
        text-align: center;
        font-weight: 800;
        font-size: 150%;
        margin-top: 2vh;
        background-color: white;
        width:50vw;
        color:#1a2238;  
    }

    .logguest{
        border: 8px solid #1a2238;
        border-radius: 10px;
        margin: auto;
        text-align: center;
        font-weight: bold;
        font-size: 150%;
        margin-top: 2vh;
        background-color: #1a2238;
        width:50vw;
        color:white;
    }

    .moblogguest{
        width:100%;
    }

    .choosefun{
        border: 8px solid #1a2238;
        color: #1a2238;
        border-radius: 10px;
        width: 45%;
        height: 70vh;
        background-color: #1a2238;
        flex-direction: column;
        justify-content: space-around;
        text-align: center;
        font-weight: bold;
        font-size: 200%;
        margin-top: 4vh;
        margin-bottom: 2vh;
    }

    .game{
        font-size: 80%;
        border-radius: 10px;
        width: 40%;
        text-decoration: none;
        flex-direction: column;
        margin-top: 2vh;
        padding-top: 5px;
        color: #1a2238;
    }

    .game:hover{
        cursor: pointer;
        background-color: rgba(255, 106, 61, 0.548);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        font-weight: 800;
    }

    .entertainment{
        font-size: 80%;
        border-radius: 10px;
        width: 45%;
        text-decoration: none;
        flex-direction: column;
        margin-top: 2vh;
        color: #1a2238;
    }

    .entertainment:hover{
        cursor: pointer;
        background-color: rgba(157, 170, 242, 0.5);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        font-weight: 800;
    }

    .mobileflex{
        flex-direction: column;
        justify-content: center;
    }

    .mobile{
        width: 100%;
        height: 60vh;
        font-size: 210%;
    }

    .mobilefun{
        flex-direction: column;
        justify-content: center;
    }

    img{
        width:50%;
        margin: auto
    }

    .game > img {
        width: 56%
    }

    .title{
        background-color: #1a2238;
        color:white;
        height: 16%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:150%;
        font-weight: 800;
    }

    .mobiletitle{
        font-size:115%;
        height: 20%;
    }
</style>