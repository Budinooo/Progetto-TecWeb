<script>
    import { createEventDispatcher } from 'svelte'
    export var playlist;
    export var pid;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    const dispatch = createEventDispatcher()
</script>

<div class="flex container content">
    {#each playlist as video, index (index)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="flex video" on:click={()=>dispatch("videoChosen",{index,pid})}>
            <img src={video.snippet.thumbnails.default.url} alt="" class:mobile={screenWidth<500}>
            <div style="font-size:80%; font-weight:bold;margin-top:5px">{video.snippet.title}</div>
        </div>
    {/each}
</div>

<style>
    .content{
        justify-content: flex-start;
        gap: 3vw;
        overflow: auto;
    }

    img{
        width: 13vw;
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    }

    .video{
        border: 1px solid rgb(182, 173, 173);
        border-radius: 10px;
        flex-direction: column;
        padding: 10px;
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    }

    .mobile{
        width: 30vw;
    }

    .content{
        margin-top: 7px;
    }
</style>
