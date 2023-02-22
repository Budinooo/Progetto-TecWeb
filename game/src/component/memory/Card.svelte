<script>
    import { createEventDispatcher } from 'svelte'
    import { firework } from '../fireworks';
    export var cardInfo;
    export var cardChosen;
    export var thisCardChosen = false;
    export var statusCardsChosen = [];
    export var couplesFound = [];

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const dispatch = createEventDispatcher()

    const selectCard = () => {
        let trueCount = 0;
        statusCardsChosen.forEach(status => {
            if (status) 
                trueCount++;
        })
        if (trueCount < 2){
            statusCardsChosen[cardInfo.index] = true;
            if (cardChosen?.id == cardInfo.id){
                statusCardsChosen[cardInfo.index] = false;
                cardChosen = null;
                dispatch('cardSelected');
            }else{
                if (cardChosen && cardChosen != cardInfo  && trueCount == 1){
                    setTimeout(function(){
                        for (let index = 0; index < statusCardsChosen.length; index++) {
                            statusCardsChosen[index] = false;
                            dispatch('cardSelected');
                        }
                    }, 2000);
                    if (cardChosen?.coupleId == cardInfo.coupleId){
                        couplesFound[cardChosen.index] = true;
                        couplesFound[cardInfo.index] = true;
                        let allTrue = true;
                        for (let i = 0; i < couplesFound.length; i++){
                            if (!couplesFound[i])
                                allTrue = false;
                        }
                        if (allTrue)
                            firework();
                    }
                    cardChosen = null;
                    dispatch('cardSelected');
                }else{
                    cardChosen = cardInfo;
                    dispatch('cardSelected');
                }
            }
        }
    }
</script>


{#if couplesFound[cardInfo.index]}
    <div class = "card found" class:mobile = {screenWidth < 500}>
        <div class="imgContainer"> 
            <img src={cardInfo.src} alt={cardInfo.name}>
        </div>
    </div>
{:else if thisCardChosen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class = "card" class:mobile = {screenWidth < 500} on:click={selectCard}>
        <div class="imgContainer"> 
            <img src={cardInfo.src} alt={cardInfo.name}>
        </div>
    </div>
{:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class = "card back" class:mobile = {screenWidth < 500} on:click={selectCard}>
        <img src="images/logo-card.png" alt="logo">
    </div>
{/if}


<style>
    .card{
        width: 15%;
        height:250px;
        border: 4px solid black;
        cursor: pointer;
        margin-right: 1%;
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 5px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }

    img{
        max-height: 240px;
        max-width: 100%;
    }

    .mobile{
        width: 30%;
        height: 150px;
    }

    .mobile img{
        max-height: 150px;
        max-width: 100%;
    }

    .back > img{
        width: 100%;
    }

    .back{
        background-color: rgb(119, 19, 147);
    }

    .found{
        border: 4px solid green;
    }
</style>