<script>
    import Card from "./Card.svelte";
    import {tick} from "svelte";
    import { Popover } from 'sveltestrap';
    import { memory } from "./store";
    import LoadingScreen from "../loading/LoadingScreen.svelte";
    const YOUR_ACCESS_KEY = "L7Fe59lSoILjBgpWKjno9hOoHdGvby60wCspY7MS0iA";
    
    var listCardInfo = [];
    var numberOfCouples = 9;
    var isMemorySet = false;
    var cardChosen;
    var statusCardsChosen = [];
    var couplesFound = [];
    var myMemory = JSON.parse($memory);

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const setupMemory = () => {
        memory.set(JSON.stringify(null));
        listCardInfo = [];
        statusCardsChosen = [];
        couplesFound = [];
        cardChosen = null;
        for (var i = 0; i < numberOfCouples; i++){
            setTimeout(function(){
                setupCardInfo();
                statusCardsChosen = [...statusCardsChosen,false];
                statusCardsChosen = [...statusCardsChosen,false];
                couplesFound = [...couplesFound,false];
                couplesFound = [...couplesFound,false];
                    
            },200*i)
        }
        isMemorySet = true;
    }

    const setupCardInfo = () => {
        var animal = randomAnimal().trim().split(/\s+/);
        animal = animal[animal.length-1];
        fetch("https://api.unsplash.com/search/photos?client_id="+YOUR_ACCESS_KEY+"&query="+animal+"&per_page=3")
        .then((result) => {
            return result.json();
        }).then((data) => {
            var index = Math.floor(Math.random() * data.results.length);
            if (!data.results[index])
                index = 0;
            listCardInfo = [...listCardInfo, {
                src: data.results[index].urls.regular,
                coupleId: statusCardsChosen.length,
                id: listCardInfo.length,
                index: listCardInfo.length,
                name: animal
            }];
            listCardInfo = [...listCardInfo, {
                src: data.results[index].urls.regular,
                coupleId: statusCardsChosen.length,
                id: listCardInfo.length,
                index: listCardInfo.length,
                name: animal
            }];
            if (listCardInfo.length == numberOfCouples * 2){
                mixList();
            }
        })
    }

    const mixList = () => {
        var index = Math.floor(Math.random() * listCardInfo.length);
        var elementToAdd =listCardInfo.splice(index,1);
        for (var i = 0; i< 20; i++){
            index = Math.floor(Math.random() * listCardInfo.length);
            elementToAdd = listCardInfo.splice(index,1,elementToAdd[0]);
            if (i == 19)
                listCardInfo = [...listCardInfo, elementToAdd[0]];
        }
    }

    const saveMemory = () =>{
        myMemory = {
            listCardInfo: listCardInfo,
            statusCardsChosen: statusCardsChosen,
            cardChosen: cardChosen,
            couplesFound: couplesFound
        }
        memory.set(JSON.stringify(myMemory));
    }

    tick().then(()=>{
        if (myMemory){
            listCardInfo = myMemory.listCardInfo;
            statusCardsChosen = myMemory.statusCardsChosen;
            cardChosen = myMemory.cardChosen;
            couplesFound = myMemory.couplesFound;
            isMemorySet = true;
        }else{
            setupMemory();
        }
    })
</script>

<LoadingScreen/>
<div class="container">
    <div class="titlepage" class:titlepagemob={screenWidth<500}> <span class="capital">M</span>EMORY</div>
</div>
<div class="container flex content">
    <button id="info"><i class="bi-info-circle" class:imob={screenWidth<500}></i></button>
    <Popover placement="left" target="info">
        <div slot="title">
        How to play <b>Memory</b>
        </div>
        Find the duplicate of each image. That's simple, right? 
    </Popover>
    {#if isMemorySet}
        {#each listCardInfo as cardInfo (cardInfo.id)}
        <Card {cardInfo} on:cardSelected={saveMemory} bind:thisCardChosen={statusCardsChosen[cardInfo.index]}
            bind:cardChosen={cardChosen} bind:statusCardsChosen={statusCardsChosen} bind:couplesFound={couplesFound}/>
        {/each}
    {/if}
    <div style="width:100%; text-align:center;">
        <button on:click={setupMemory} style="border-radius: 10px; margin-top: 20px; border: 3px solid black;">RESTART<i class="bi-arrow-clockwise"></i></button>
    </div>
</div>

<style>
    .flex{
        flex-wrap: wrap;
        justify-content:space-evenly;
        position: relative;
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