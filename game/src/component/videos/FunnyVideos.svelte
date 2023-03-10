<script>
    import MainVideo from "./MainVideo.svelte";
    import Playlist from "./Playlist.svelte";

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var playlist = [[],[],[]];
    var currentVideo;
    var playlistId = ["PLtDp75hOzOlbD7m-Gb2t4dZqyYx7dq0iB","PLF7uln2NT38i-ZDHTwUf_2MnNp70BKD7s","PLf6Ove6NWsVcM75fCjLk3i-9IkpCmPyXw"];
    var mainReady = false;
    var playlistReady = false;

    for (let i=0; i<playlistId.length; i++){
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                let data = JSON.parse(xmlHttp.responseText);
                let first = true;
                var p =[];
                for (let video of data.items){
                    if (first && i==0){
                        first = false;
                        currentVideo = video;
                    }else 
                        p = [...p, video];
                }
                playlist[i] = p;
                if(playlist[0].length > 0 && playlist[1].length > 0 && playlist[2].length > 0){
                    mainReady = true;
                    playlistReady = true;
                }
            }
        }
        xmlHttp.open( "GET", "http://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+playlistId[i]+"&key=AIzaSyBwKTLoQHoNYRzU2f6laHTOrXILwMpbtnQ&maxResults=9", true ); 
        xmlHttp.send( null );
    }

    const switchVideo = (event) =>{
        let pid;
        console.log(currentVideo.snippet.channelTitle)
        switch(currentVideo.snippet.channelTitle){
            case "Funny Pet Videos":
                pid = 2;
                break;
            case "Funny Cats Life":
                pid = 1;
                break;
            case "Tiger Productions":
                pid = 0
                break;
        }
        console.log(pid)
        playlist[pid] = [...playlist[pid],currentVideo];

        let temp = playlist[event.detail.pid];
        let i = 0;
        playlist[event.detail.pid] = [];

        for(let video of temp){
            if(i != event.detail.index)
                playlist[event.detail.pid] = [...playlist[event.detail.pid], video]
            i++;
        }
        currentVideo = temp[event.detail.index];
    }

</script>

<div class="container">
    <div class="titlepage" class:titlepagemob={screenWidth<500}> <span class="capital">F</span>UNNY <span class="capital">V</span>IDEOS</div>
</div>
<div class="container">
    {#if mainReady}
        <MainVideo {currentVideo}/> 
    {/if}
    {#if playlistReady}
        <div class="filter"><img src="images/otherfilter.png" alt=""></div>
        <Playlist playlist={playlist[0]} on:videoChosen={switchVideo} pid={0}/>
        <div class="filter"><img src="images/catfilter.png" alt=""></div>
        <Playlist playlist={playlist[1]} on:videoChosen={switchVideo} pid={1}/>
        <div class="filter"><img src="images/dogfilter.png" alt=""></div>
        <Playlist playlist={playlist[2]} on:videoChosen={switchVideo} pid={2}/>
    {/if}
</div>

<style>
    .filter{
        border: 6px solid #1a2238;
        border-radius: 10px;
        background-color: white;
        width: fit-content;
        padding: 4px;
        margin: auto;
    }

    img{
        width: 30px;
        margin-bottom: 3px;
    }
</style>