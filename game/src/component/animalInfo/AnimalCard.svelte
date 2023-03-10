<script>
    import { fade } from "svelte/transition";
    import AnimalModal from "./AnimalModal.svelte";
    const YOUR_ACCESS_KEY = "L7Fe59lSoILjBgpWKjno9hOoHdGvby60wCspY7MS0iA";

    export var info;
    export var fadeDelay;

    var screenWidth = window.innerWidth;
    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var imgSrc;
    var isModalOpen = false;
    
    fetch("http://api.unsplash.com/search/photos?client_id="+YOUR_ACCESS_KEY+"&query="+(info.name).replace(" ","")+"&per_page=3")
    .then((result) => {
        return result.json();
    }).then((data) => {
        if (data.results[0]){
            imgSrc =  data.results[Math.floor(Math.random() * data.results.length)].urls.regular;
        }else{
            fetch("http://api.unsplash.com/search/photos?client_id="+YOUR_ACCESS_KEY+"&query="+(info.name)+"&per_page=3")
            .then((resul) => {
                return resul.json();
            }).then((dat) => {
                imgSrc =  dat.results[Math.floor(Math.random() * dat.results.length)].urls.regular;
            })
        }
        
    })

</script>

<AnimalModal bind:isModalOpen={isModalOpen} {info} {imgSrc}/>
<div class="infoContainer container-fluid" class:mobile={screenWidth < 500} transition:fade="{{delay: fadeDelay}}">
    <div style="text-align:center;">
        <img id="animalInfoImg" src={imgSrc} alt={info.name}>
    </div>
    <div class="animalName">
        {info.name}<button class="openModalBtn" on:click={()=>isModalOpen=true}>
            {#if screenWidth > 500}
                <i class="bi-zoom-in"></i>
            {/if}    
        </button>
    </div>
    <div class="row align-items-start">
        <div class="col">
            <div class="animalInfo">Taxonomy:</div>
            <ul class="infoList">
                <li>Kingdom: {info.taxonomy.kingdom}</li>
                <li>Phylum: {info.taxonomy.phylum}</li>
                <li>Class: {info.taxonomy.class}</li>
                <li>Order: {info.taxonomy.order}</li>
                <li>Family: {info.taxonomy.family}</li>
                {#if info.taxonomy.genus}
                    <li>Genus: {info.taxonomy.genus}</li>
                {/if}
                <li>Scientific Name: {info.taxonomy.scientific_name}</li>
            </ul>
            {#if info.locations}
                <div class="animalInfo">Locations: </div>
                <ul class="infoList">
                    {#each info.locations as location}
                        <li>{location}</li>
                    {/each}
                </ul>
            {/if}
        </div>
        {#if info.characteristics}
            <div class="col">
                <div class="animalInfo">Characteristics: </div>
                <ul class="infoList">
                    {#if info.characteristics.common_name}
                        <li>Common name: {info.characteristics.common_name}</li>
                    {/if}
                    {#if info.characteristics.name_of_young}
                        <li>Name of young: {info.characteristics.name_of_young}</li>
                    {/if}
                    {#if info.characteristics.slogan}
                        <li>Slogan: {info.characteristics.slogan}</li>
                    {/if}
                    {#if info.characteristics.most_distinctive_feature}
                        <li>Most distinctive feature: {info.characteristics.most_distinctive_feature}</li>
                    {/if}
                    {#if info.characteristics.temperament}
                        <li>Temperament: {info.characteristics.temperament}</li>
                    {/if}
                    {#if info.characteristics.diet}
                        <li>Diet: {info.characteristics.diet}</li>
                    {/if}
                    {#if info.characteristics.favorite_food}
                        <li>Favorite food: {info.characteristics.favorite_food}</li>
                    {/if}
                    {#if info.characteristics.prey}
                        <li>Prey: {info.characteristics.prey}</li>
                    {:else if info.characteristics.main_prey}
                        <li>Prey: {info.characteristics.main_prey}</li>
                    {/if}
                    {#if info.characteristics.predators}
                        <li>Predator: {info.characteristics.predators}</li>
                    {/if}
                    {#if info.characteristics.habitat}
                        <li>Habitat: {info.characteristics.habitat}</li>
                    {/if}
                    {#if info.characteristics.origin}
                        <li>Origin: {info.characteristics.origin}</li>
                    {/if}
                    {#if info.characteristics.location}
                        <li>Location: {info.characteristics.location}</li>
                    {/if}
                    {#if info.characteristics.water_type}
                        <li>Water type: {info.characteristics.water_type}</li>
                    {/if}
                    {#if info.characteristics.group}
                        <li>Type: {info.characteristics.group}</li>
                    {:else if info.characteristics.type}
                        <li>Type: {info.characteristics.type}</li>
                    {/if}
                    {#if info.characteristics.group_behavior}
                        <li>Group behavior: {info.characteristics.group_behavior}</li>
                    {/if}
                    {#if info.characteristics.estimated_population_size}
                        <li>Estimated population size: {info.characteristics.estimated_population_size}</li>
                    {/if}
                    {#if info.characteristics.number_of_species}
                        <li>Number of species: {info.characteristics.number_of_species}</li>
                    {/if}
                    {#if info.characteristics.skin_type}
                        <li>Skin type: {info.characteristics.skin_type}</li>
                    {/if}
                    {#if info.characteristics.top_speed}
                        <li>Top speed: {info.characteristics.top_speed}</li>
                    {/if}
                    {#if info.characteristics.lifespan}
                        <li>Lifespan: {info.characteristics.lifespan}</li>
                    {/if}
                    {#if info.characteristics.weight}
                        <li>Weight: {info.characteristics.weight}</li>
                    {/if}
                    {#if info.characteristics.height}
                        <li>Height: {info.characteristics.height}</li>
                    {/if}
                    {#if info.characteristics.length}
                        <li>Length: {info.characteristics.length}</li>
                    {/if}
                    {#if info.characteristics.age_of_sexual_maturity}
                        <li>Age of sexual maturity: {info.characteristics.age_of_sexual_maturity}</li>
                    {/if}
                    {#if info.characteristics.age_of_weaning}
                        <li>Age of weaning: {info.characteristics.age_of_weaning}</li>
                    {/if}
                    {#if info.characteristics.average_litter_size}
                        <li>Average litter size: {info.characteristics.average_litter_size}</li>
                    {/if}
                    {#if info.characteristics.gestation_period}
                        <li>Gestation period: {info.characteristics.gestation_period}</li>
                    {/if}
                </ul>
            </div>
        {/if}
    </div>
    
</div>


<style>
    .infoContainer{
        border: 4px solid black;
        border-radius: 10px;
        width: 30%;
        height: 450px;
        overflow-y: scroll;
        margin-top: 2vh;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }

    .infoContainer::-webkit-scrollbar { display: none; }
	.infoContainer {
  	-ms-overflow-style: none;  /* IE and Edge */
  	scrollbar-width: none;     /* Firefox */
	}

    .mobile{
        width: 95%;
    }

    .animalName{
        font-weight: bold;
        font-size: 150%;
        text-align: center;
    }

    .openModalBtn{
        background-color: transparent;
        border: 1px solid transparent;
    }

    .animalInfo{
        font-weight: bold;
    }

    #animalInfoImg{
        max-width: 100%;
        max-height: 300px;
        border-radius: 10px;
        margin: auto;
        margin-top: 2vh;
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    }

    .infoList{
        padding:0;
    }

    .infoList>li{
        font-size: 80%;
    }
</style>