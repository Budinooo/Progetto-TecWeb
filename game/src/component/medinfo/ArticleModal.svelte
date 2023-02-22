<script>
    import { fade } from "svelte/transition";

    export var info;
    export var isModalOpen;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })
</script>

{#if isModalOpen}
    <div class="backdrop flex" transition:fade>
        <div class="content container" class:mobile={screenWidth < 500}>
            <button on:click={()=>isModalOpen=false}>CLOSE</button>
            <img src={info.img} alt="article img" align="right" class:mobileimg={screenWidth < 500}>
            <div class="info">
                <h1>{info.title}</h1>
                {#each info.paragraph as paragraph, index (index)}
                    {#if index!=0}
                        <h2>{info.ptitle[index-1]}</h2>
                    {/if}
                    <p>{paragraph}</p>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        position: fixed;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        z-index: 4;
    }

    .content{
        height: 90%;
        width: 70%;
        background-color: white;
        overflow-y: scroll;
        position:relative;
    }

    .content::-webkit-scrollbar { display: none; }
	.content {
  	-ms-overflow-style: none;  /* IE and Edge */
  	scrollbar-width: none;     /* Firefox */
	}

    .mobile{
        width: 95%;
        height: 95%;
    }

    .mobileimg{
        width: 100%;
        margin: auto;
    }

    button{
        position: absolute;
        width: 80px;
        height: 60px;
        top: -30px;
        left: 0; 
        right: 0; 
        margin-left: auto; 
        margin-right: auto; 
        background-color: red;
        border: 4px solid black;
        border-radius: 50%;
        padding-top: 25px;
        font-weight: bolder;
    }

    img{
        width: 50%;
        border-radius: 10px;
    }

    h1{
        font-weight: bold;
    }
</style>