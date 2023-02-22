<script>
    import { tick } from "svelte";
    export var score;
    import { createEventDispatcher } from 'svelte'

    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var myRank;
    var isReady = false;
    
    fetch('/db/collection?collection=users',{
        method:'GET'
    }).then(response => response.json())
    .then(data => {
        myRank = data.result;
        myRank = myRank.sort( (r1, r2) => (r1.score < r2.score) ? 1 : (r1.score > r2.score) ? -1 : 0);
    })

    var user;
    let local = JSON.parse(localStorage.getItem("login"))
    if (local.islogged){
        fetch('/db/element?id='+local.id+'&collection=users',{
            method:'GET'
        }).then(response => response.json())
        .then(data => {
            user = data.result;
        })
    }

    const setRankingsColor = () =>{
        tick().then(()=>{
            if(document.getElementById('pos1'))
                document.getElementById('pos1').style.backgroundColor = "gold";
            if(document.getElementById('pos2'))
                document.getElementById('pos2').style.backgroundColor = "silver";
            if(document.getElementById('pos3'))
                document.getElementById('pos3').style.backgroundColor = "#CD7F32";
        })
    }

    const sendScore = () =>{
        if (local.islogged && user.score < score){ 
            let obj = {
                collection:'users',
                elem:{
                    "_id": user._id,
                    "name": user.name,
                    "username": user.username,
                    "email": user.email,
                    "password": user.password,
                    "favorites": user.favorites,
                    "pets": user.pets,
                    "score": score,
                    "admin": user.admin
                }
            }
            fetch('/db/element',{
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(obj)
            }).then(()=>{
                fetch('/db/collection?collection=users',{
                    method:'GET'
                }).then(response => response.json())
                .then(data => {
                    myRank = data.result;
                    myRank = myRank.sort( (r1, r2) => (r1.score < r2.score) ? 1 : (r1.score > r2.score) ? -1 : 0);
                })
            })
        }
    }

    setTimeout(function(){
        sendScore()
        isReady = true;
        setRankingsColor(); 
    },2000)

    const dispatch = createEventDispatcher()
</script>

{#if isReady}
    <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center">
        <div class="leaderboard" class:mobile={screenWidth<500}>
            <div style="width:100%; background-color: #1a2238; text-align:center; height:13%; display:flex; justify-content:center; align-items:center">
                <div style="font-weight:800; color:white; font-size:180%;">LEADERBOARD</div> 
            </div>
            <div class="flex" style="height:87%" class:insmob={screenWidth<500}>
                <div class="ranking flex" class:width100={screenWidth<500} class:rankmob={screenWidth<500}>
                    {#each myRank as rank, index (index)}
                        <div class="flex rank container">
                            <div id={"pos"+ (index+1)} class="position">{index + 1}</div>
                            <div>
                                <div style="font-weight: 800; text-align:center; font-size:140%">{rank.score}</div>
                                <div style="text-align:center;">{rank.username}</div>
                            </div> 
                        </div>
                    {/each}
                </div>
                <div class="score" class:width100={screenWidth<500} class:scoremob={screenWidth<500}>
                    <div style="width:100%; text-align:center; font-size:180%; font-weight:600">CONGRATS!!</div>
                    <div style="width:100%; text-align:center; font-size:140%; font-weight:600">YOU MADE</div>
                    <div style="width:100%; text-align:center; font-size:280%; font-weight:800">{score}</div>
                    <div style="width:100%; text-align:center; font-size:150%; font-weight:600">POINTS</div>
                    {#if local.islogged}
                        <div style="width:100%; text-align:center; font-size:140%; font-weight:600">YOUR HIGHEST SCORE WAS</div>
                        <div style="width:100%; text-align:center; font-size:140%; font-weight:600">{user.score} POINTS</div>
                    {/if}
                    <div style="width:100%; text-align:center;">
                        <button on:click={()=>dispatch("replay",{})} style="border-radius: 10px; margin-top: 20px; border: 3px solid black;">RESTART<i class="bi-arrow-clockwise"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .leaderboard{
        border: 4px solid #1a2238;
	    border-radius: 10px;
        width: 60%;
        height: 60vh;
    }

    .ranking{
        width:50%;
        height:100%;
        border-right: 4px solid #1a2238;
        flex-direction: column;
        overflow: auto;
    }

    .ranking > div {
        width: 100%;
        border-bottom: 2px solid #1a2238;
    }

    .score{
        width:50%;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;
        padding-top: 20px;
    }

    .rank{
        padding-top: 5px;
        padding-bottom: 5px;
        justify-content: flex-start;
        align-items: center;
        gap: 40px;
    }

    .position{
        border:2px solid #1a2238;
        border-radius:50%; 
        width:35px; 
        height:35px; 
        justify-content: center;
        font-weight:600;
        font-size: 110%;
        display:flex;
        align-items: center;
        background-color: rgb(230, 230, 230);
    }

    #username{
        width: 80%;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }

    #usernameBtn{
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }

    .mobile{
        width: 90%;
        height: 70vh;
    }

    .insmob{
        flex-direction: column;
    }

    .width100{
        width: 100%;
    }

    .rankmob{
        border-right: 0px solid #1a2238; 
        border-bottom: 4px solid #1a2238;
    }

    .scoremob{
        padding-top: 0;
        padding-bottom: 20px;
    }
</style>