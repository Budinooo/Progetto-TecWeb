<script>
    import {tick} from "svelte";
    import Article from "./Article.svelte";
    import articles from "./articles.json"

    var visible = articles;
    var filteractive = "all";

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    //impostare il filtro iniziale
    tick().then(()=>{
        document.getElementById("allf").style.backgroundColor="rgb(178, 178, 178)"
    })

    const applyFilter = (filter) => {
        if(filter!=filteractive){
            visible =[];
            document.getElementById("allf").style.backgroundColor="white";
            document.getElementById("catf").style.backgroundColor="white";
            document.getElementById("dogf").style.backgroundColor="white";
            document.getElementById("otherf").style.backgroundColor="white";
            switch(filter){
                case "all":
                    filteractive = "all";
                    visible = articles;
                    document.getElementById("allf").style.backgroundColor="rgb(178, 178, 178)";
                    break;
                case "cat":
                    filteractive = "cat";
                    visible = articles.filter(article => article.category=="cat");
                    document.getElementById("catf").style.backgroundColor="rgb(178, 178, 178)";
                    break;
                case "dog":
                    filteractive = "dog";
                    visible = articles.filter(article => article.category=="dog");
                    document.getElementById("dogf").style.backgroundColor="rgb(178, 178, 178)";
                    break;
                case "other":
                    filteractive = "other";
                    visible = articles.filter(article => article.category=="other");
                    document.getElementById("otherf").style.backgroundColor="rgb(178, 178, 178)";
                    break;
            }
        }
    }
</script>

<div class="container">
    <div class="titlepage" class:titlepagemob={screenWidth<500}> <span class="capital">M</span>EDICAL <span class="capital">I</span>NFO</div>
</div>
<div class="container">
    <div class="filters flex">
        <button id="allf" class="filter" on:click={()=>applyFilter("all")}>All</button>
        <button id="catf" class="filter" on:click={()=>applyFilter("cat")}><img src="images/catfilter.png" alt=""> Cat</button>
        <button id="dogf" class="filter" on:click={()=>applyFilter("dog")}><img src="images/dogfilter.png" alt=""> Dog</button>
        <button id="otherf" class="filter" on:click={()=>applyFilter("other")}><img src="images/otherfilter.png" alt=""> Other</button>
    </div>
    <div class="content container flex">
        {#each visible as info}
            <Article {info}/>        
        {/each}
    </div>
</div>

<style>
    .filters{
        justify-content: center;
        margin-top: 2vh;
    }

    .filter{
        border: 6px solid #1a2238;
        border-radius: 10px;
        background-color: white;
        font-weight: bold;
        width: fit-content;
        padding: 4px;
        margin-left: 5px;
    }

    .content{
        justify-content: space-evenly;
        flex-wrap: wrap;
        margin-top: 2vh;
    }

    img{
        width: 20px;
        margin-bottom: 3px;
    }
</style>