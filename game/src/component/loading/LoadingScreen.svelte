<script>
    export var isLoading = true;
    var screenWidth = window.innerWidth;

    var animal = randomAnimal().trim().split(/\s+/);
    var animalCuriosity;
    var animalInfo;
    var curiosity = "Did you know that...";
    animal = animal[animal.length-1].toLowerCase();

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const getCuriosity = () => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                var results = JSON.parse(xmlHttp.responseText);
                if (results.length <= 0){
                    chooseCatCuriosity();
                }else{
                    animal = results[Math.floor(Math.random() * results.length)];
                    chooseCuriosity(0);
                    curiosity = " Did you know that the " + animalInfo + " of the " + animal.name + " is "
                        + animalCuriosity;
                } 
            }
        }
        xmlHttp.open( "GET", 'https://api.api-ninjas.com/v1/animals?name=' + animal, true ); 
        xmlHttp.setRequestHeader("X-Api-Key","XeRLqZeWmuiW7/PMyztdHQ==HoJJOzopIX90X1xe");
        xmlHttp.send( null );
    }

    const chooseCuriosity = (count) => {
        const categoryCount = 8;
        let i = Math.floor(Math.random() * categoryCount)
        if (count == categoryCount) //Per evitare troppa ricorsione
            i = 0;
        switch(i){
            case 0:
                if (animal.taxonomy.scientific_name){
                    animalInfo = "scientific name";
                    animalCuriosity = animal.taxonomy.scientific_name.toLowerCase();
                }
                else
                    chooseCuriosity(++count);
                break;
            case 1:
                if (animal.characteristics.most_distinctive_feature){
                    animalInfo = "most distinctive feature";
                    animalCuriosity = animal.characteristics.most_distinctive_feature.toLowerCase();
                }
                else 
                    chooseCuriosity(++count);
                break;
            case 2:
                if (animal.characteristics.favorite_food){
                    animalInfo = "favorite food";
                    animalCuriosity = animal.characteristics.favorite_food.toLowerCase();
                }
                else 
                    chooseCuriosity(++count);
                break;
            case 3:
                if (animal.characteristics.habitat){
                    animalInfo = "habitat";
                    animalCuriosity = animal.characteristics.habitat.toLowerCase();
                }
                else 
                    chooseCuriosity(++count);
                break;
            case 4:
                if (animal.characteristics.favorite_food){
                    animalInfo = "favorite food";
                    animalCuriosity = animal.characteristics.favorite_food.toLowerCase();
                }
                else 
                    chooseCuriosity(++count);
                break;
            case 5:
                if (animal.characteristics.estimated_population_size){
                    animalInfo = "estimated population size";
                    animalCuriosity = animal.characteristics.estimated_population_size.toLowerCase();
                }
                else 
                    chooseCuriosity(++count);  
                break;    
            case 6:
                if (animal.characteristics.lifespan){
                    animalInfo = "lifespan";
                    animalCuriosity = animal.characteristics.lifespan.toLowerCase();
                }
                else 
                    chooseCuriosity(++count);  
                break;
            case 7:
                if (animal.characteristics.weight){
                    animalInfo = "weight";
                    animalCuriosity = animal.characteristics.weight.toLowerCase();
                }
                else 
                    chooseCuriosity(++count); 
                break;     
        }
    }

    const chooseCatCuriosity = () => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                var results = JSON.parse(xmlHttp.responseText);
                curiosity = " Did you know that " + results[Math.floor(Math.random() * results.length)].text
            }
        }
        xmlHttp.open( "GET", 'https://cat-fact.herokuapp.com/facts', true ); 
        xmlHttp.send( null );
    }

    getCuriosity();

    setTimeout(function(){
        isLoading = false;
    }, 7000);
</script>

{#if isLoading}
    <div class="backdrop flex">
        <div id="loading" class="flex">
            <img src="images/dog-running.gif" class:mobileimg={screenWidth<500} alt="dog running">
            <div class="loadingtext" class:mobiletxt={screenWidth<500}>LOADING</div>
            <div class="curiosity" class:mobilecur={screenWidth<500}>
                {curiosity}
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop{
        width: 100%;
        height: 100%;
        background-color: #1a2238;
        position: fixed;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        z-index: 4;
    }

    #loading{
        justify-content: center;
        flex-direction: column;
    }

    img{
        width: 20vw;
        margin:auto;
    }

    .loadingtext{
        font-family: 'Montserrat', sans-serif;
        color:white;
        font-weight: bold;
        margin:auto;
        font-size: 220%;
    }

    .curiosity{
        background-color: white;
        border-radius: 10px;
        width: 65vw;
        padding: 20px;
        margin:auto;
        text-align: center;
    }

    .mobileimg{
        width: 60vw;
    }

    .mobiletxt{
        font-size: 150%;
    }

    .mobilecur{
        width: 90vw;
        padding: 5px;
    }
</style>