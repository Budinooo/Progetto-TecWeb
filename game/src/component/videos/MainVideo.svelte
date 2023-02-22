<script>
    export var currentVideo;

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })
</script>

<div class="flex container content" class:mobile={screenWidth<500}>
    <iframe src={"https://www.youtube.com/embed/"+currentVideo.snippet.resourceId.videoId} class:mobvideo={screenWidth<500} title={currentVideo.snippet.title}></iframe>
    <div class="container description" class:mobdes={screenWidth<500}>
        <div>{currentVideo.snippet.channelTitle}</div>
        <p style="font-weight:800; font-size:130%">{currentVideo.snippet.title}</p>
        <p style="font-size:80%">{currentVideo.snippet.description}</p>
    </div>
</div>

<style>
    .content{
        max-height: 90vh;
    }

    iframe{
        width: 70%;
        aspect-ratio: 16 / 9;
        border : 2px solid black;
    }

    .description{
        width: 30%;
        overflow:auto;
    }

    .mobile{
        flex-direction: column;
    }

    .mobvideo{
        width: 100%;
    }

    .mobdes{
        width: 100%;
        height:180px;
        overflow: auto;
    }
</style>