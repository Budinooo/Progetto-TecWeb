<script>
    import AnimalCard from "./AnimalCard.svelte";

    var isScreenMobile;
    if (window.innerWidth < 500)
        isScreenMobile = true;
    else 
        isScreenMobile = false;
    window.addEventListener("resize", function(event) {
        if (window.innerWidth < 500)
            isScreenMobile = true;
        else 
            isScreenMobile = false;
    })

    var storedPets = JSON.parse(localStorage.getItem("mypets"));
    var results = [];
    var cardsDisplayed = [];
    var numberPages = 0;
    var actualPage;
    var numberCardsPerPage = 3;

    var isResultsEmpty = false;
    var isSearchStarted = false;
    
    let local = JSON.parse(localStorage.getItem("login"))
    if (local.islogged){
        fetch('http://localhost:8000/db/element?id='+local.id+'&collection=users',{
            method:'GET'
        }).then(response => response.json())
        .then(data => {
            storedPets = data.result.pets;
        })
    }

    const searchAnimals = (animal) => {
        isSearchStarted = false;
        isResultsEmpty = false;
        results = [];
        cardsDisplayed = [];
        var search;
        setTimeout(function(){
            if(animal)
            search = animal;
            else 
                search = document.getElementById("animalInfoSearch").value;
            if (search && search.length >= 3){
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() { 
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                        results = JSON.parse(xmlHttp.responseText);
                        isSearchStarted = true;
                        if (results.length != 0){
                            for (var i = 0; i < numberCardsPerPage && i < results.length; i++){
                                cardsDisplayed[i] = results[i];
                            }
                            numberPages = Math.trunc(results.length/numberCardsPerPage + 1);
                            actualPage = 1;
                        }else{
                            isResultsEmpty = true;
                        }
                    }
                }
                xmlHttp.open( "GET", 'https://api.api-ninjas.com/v1/animals?name=' + search, true ); 
                xmlHttp.setRequestHeader("X-Api-Key","XeRLqZeWmuiW7/PMyztdHQ==HoJJOzopIX90X1xe");
                xmlHttp.send( null );
            }
        }, 500)
    }

    const searchAnimalsKeyPressed = (event) => {
        if (event.key == "Enter") {
            searchAnimals();
        }
    }

    const changePage = (page) => {
        actualPage = page;
        cardsDisplayed = [];
        setTimeout(function(){
            for (var i = (actualPage - 1) * numberCardsPerPage; i < numberCardsPerPage*actualPage && i < results.length; i++){
                cardsDisplayed= [...cardsDisplayed,results[i]];
            }
            cardsDisplayed = cardsDisplayed;

        }, 500*(numberCardsPerPage) + 200);
    }

    const previousPage = () => {
        if (actualPage != 1){
            changePage(--actualPage);
        }
    }

    const nextPage = () => {
        if (actualPage != numberPages){
            changePage(++actualPage);
        }
    }
</script>

<div class="container">
    <div class="titlepage" class:titlepagemob={isScreenMobile}> <span class="capital">A</span>NIMAL <span class="capital">I</span>NFO</div>
</div>
<div class="container">
    <div class="flex searchContainer content">
        <div class="flex" style="justify-content:center; width:100%">
            <input type="text" id="animalInfoSearch" value="" placeholder="Search for an Animal" on:keydown={searchAnimalsKeyPressed}>
            <button id="searchAnimalbtn" on:click={() => searchAnimals(null)}><i class="bi-search"></i></button>
        </div>
        <div class="flex suggestions">
            {#each storedPets as pet}
                <button on:click={() => searchAnimals(pet.species)}>{pet.species}</button>
            {/each}
        </div>
    </div>
    {#if isSearchStarted}
        {#if isResultsEmpty}
            <div class="animalCardsContainer flex content">
                <div style="width:100%; text-align:center; font-weight:bold; font-size:200%">Ooops, sorry... Animal Not Found </div>
                <img src="images/404.gif" alt="" class="notfound" class:nfmob={isScreenMobile}>
            </div>
        {:else}
            <div class="animalCardsContainer flex content">
                <div class="flex" style="width:100%" class:wrap={isScreenMobile}>
                    {#each cardsDisplayed as info, index (index)}
                        <AnimalCard {info} fadeDelay={index * 500}/>
                    {/each}
                </div>
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li class="page-item" aria-label="Previous" on:click={previousPage} ><div class="page-link" ><span aria-hidden="true">&laquo;</span></div></li>
                        {#if isScreenMobile}
                            <select class="form-select" aria-label="Page number selection">
                                {#each  Array(numberPages) as _, index (index)}
                                    <option class="page-link" value={index+1} selected={actualPage==index+1} on:click={()=>changePage(index+1)}>
                                        {index + 1}
                                    </option>
                                {/each}
                            </select>
                        {:else}
                            {#each Array(numberPages) as _, index (index)}  
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <li class="page-item" class:active={actualPage==index+1} on:click={()=>changePage(index+1)}>
                                    <div class="page-link">{index + 1}</div>
                                </li>
                            {/each}
                        {/if}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li class="page-item" aria-label="Next" on:click={nextPage}><div class="page-link" ><span aria-hidden="true">&raquo;</span></div></li>
                    </ul>
                </nav>
            </div>
        {/if}
    {/if}
</div>




<style>
    .searchContainer{
        justify-content: center;
        flex-wrap: wrap;
        gap:5px;
    }

    #animalInfoSearch{
        width: 80%;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }

    #searchAnimalbtn{
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }

    .animalCardsContainer{
        justify-content:space-evenly;
        flex-wrap: wrap;
        padding-bottom: 0;
        margin-top: 2vh;
    }

    .notfound{
        width: 40%;
    }

    .pagination{
        justify-content: center;
    }

    .form-select{
        width: 70px;
        text-align: center;
    }

    nav{
        color: black;
        margin-top: 2vh;
    }

    .page-item{
        color: black;
    }

    .page-link{
        color: black;
    }

    .nfmob{
        width: 100%;
    }

    .wrap{
        flex-wrap: wrap;
    }

    .suggestions{
        justify-content: space-evenly;
        gap: 10px;
    }

    .suggestions > button{
        border-radius: 10px;
    }
</style>