<script>
    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    /*
        
    <div class="flex container foot">
        <div class="info">
            <p style="font-weight: 800; font-size: 120%; color:#9daaf2">Shop</p>
            <div class="flex footlinks">
                <a href="/shop">Home</a>
                <a href="/service">Services</a>
                <a href="/feed">Feed</a>
            </div>
        </div>
        <div class="info">
            <p style="font-weight: 800; font-size: 120%; color:#9daaf2">Game</p>
            <div class="flex footlinks">
                <a href="/game">Game</a>
                <a href="/game/quiz">Quiz</a>
                <a href="/game/memory">Memory</a>
                <a href="/game/wordle">Wordle</a>
                <a href="/game/funnyvideos">Funny videos</a>
                <a href="/game/animalinfo">Animal info</a>
                <a href="/game/medinfo">Medical info</a>
                <a href="/game/yourpets">Your pets</a>
            </div>
        </div>
        <div class="info">
            <p style="font-weight: 800; font-size: 120%; color:#9daaf2">Backoffice</p>
            <div class="flex footlinks">
                <a href="/shop">Home</a>
                <a href="/service">Services</a>
                <a href="/feed">Feed</a>
            </div>
        </div>
    </div>
    */
</script>

<footer class="footer">
    {#if screenWidth > 500}
        <p style="font-weight: bold; text-align:center; font-size:200%; color:white; padding-top:10px">
            <span style="color:#ff6a3d">Number 1</span> Pet store in the W<img src="images/dog-house.png" alt="logo" width="25px" style="margin-bottom:5px"/>rld</p>
    {:else}
        <div style="font-weight: bold; text-align:center; font-size:200%; color:white; padding-top:10px"> <span style="color:#ff6a3d">Number 1</span> Pet store</div>
        <div style="font-weight: bold; text-align:center; font-size:190%; color:white; padding-top:10px; margin-bottom:20px"> in the W<img src="images/dog-house.png" alt="logo" width="25px" style="margin-bottom:5px"/>rld</div>
    {/if}
    
    <div id="socials" class="container">
        <i class="bi-facebook"></i>
        <i class="bi-instagram"></i>
        <i class="bi-twitter"></i>
        <i class="bi-youtube"></i>
        <i class="bi-linkedin"></i>
        <i class="bi-tiktok"></i>
    </div>
</footer>

<style>
    footer{
        width: 100%;
        background-color: #1a2238;
        margin-top: 30px;
    }

    .foot{
        border-top: 3px solid white;
        border-bottom: 3px solid white;
        justify-content: space-evenly;
        padding-bottom: 10px;
        padding-top: 10px;
    }

    .info{
        color:white;
        width:25%;
        margin-left: 3vw;
    }

    .footlinks{
        flex-direction: column;
        gap:3px;
        margin-top: -4px;
    }

    .footlinks > a{
        text-decoration: none;
        color: white;
        font-weight: 600;
        font-size: 90%;
        width: fit-content;
    }

    #socials{
        display: flex;
        margin: auto;
        justify-content: center;
        padding-top: 5px;
        padding-bottom: 5px;
        border-top: 3px solid white;
    }

    i{
        color:white;
        font-size: 120%;
        margin-right: 5px;
    }

    i:hover{
        cursor: pointer;
    }
</style>