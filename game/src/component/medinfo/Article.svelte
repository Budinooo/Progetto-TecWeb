<script>
    import ArticleModal from "./ArticleModal.svelte";

    export var info;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var isModalOpen = false;
</script>

<ArticleModal bind:isModalOpen={isModalOpen} {info}/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="articlecard " on:click={()=>isModalOpen=true} class:mobile={screenWidth<500}>
    <img src={info.img} class="img" alt="article">
    <img class="filter" src={"images/"+info.category+"filter.png"} alt={info.category + " category"}>
    <div>{info.title}</div>
</div>

<style>
    .articlecard{
        border: 3px solid black;
        border-radius: 10px;
        width: 22%;
        text-align: center;
        font-weight: bold;
        padding-bottom: 5px;
        padding-top: 5px;
        font-size: 130%;
        margin-top: 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }

    .articlecard:hover{
        cursor: pointer;
    }

    img{
        width: 95%;
        border-radius: 5px;
        margin: auto;
        margin-bottom: 5px;
    }

    .img{
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    }

    .filter{
        width:20px;
    }

    .mobile{
        width:95%;
    }
</style>