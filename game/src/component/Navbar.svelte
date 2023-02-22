<script>
    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var log;
    if (JSON.parse(localStorage.getItem("login")).islogged)
      log = "LOGOUT"
    else
      log = "LOGIN"

    const logout = () =>{
      const logInfo = {
        islogged: false,
        id: ""
      }
      log = "LOGIN"
      localStorage.setItem("login",JSON.stringify(logInfo))
    }

    const searchProduct = () =>{
      let value = document.getElementById("search").value;
      if (value && value != "" && value!=" ")
        window.location.href = "/results?query=cat";
    }
</script>

<header>
  <div class="container-fluid flex" class:width100={screenWidth<500}>
    <a class="navbar-brand" href="/game/">
      <div class="logo"><span>A</span>NIMAL<span>H</span><img src="images/dog-house.png" alt="logo" />USE</div>
      <div class="slogan" style="color:#ff6a3d">FOR YOUR PETS AND FOR YOUR MIND</div>
    </a>
    {#if screenWidth>500}
      <div style="display:flex; width:57%; height:fit-content;">
        <input type="text" class="shopSearch" placeholder="Search for a product" style="width:100%" id="search">
        <button class="shopSearchBtn" on:click={searchProduct}><i class="bi-search"></i></button>
      </div>
      <div class="flex nav" style="justify-content: space-between;">
        <a href="/">SHOP</a>
        <a href="/backoffice/">BACKOFFICE</a>
        {#if JSON.parse(localStorage.getItem("login")).islogged}
          <a on:click={logout} href={window.location.href}>{log}</a>
        {:else}
          <a on:click={()=>log = "LOGOUT"} href="/login/">{log}</a>
        {/if}
      </div>
    {/if}
  </div>
  {#if screenWidth<500}
    <div style="display:flex; width:90%; height:fit-content; margin:auto; margin-top:10px; margin-bottom:10px;">
      <input type="text" class="shopSearch" placeholder="Search for a product" style="width:100%" id="search">
      <button class="shopSearchBtn" on:click={searchProduct}><i class="bi-search"></i></button>
    </div>
    <div class="flex nav" style="justify-content: space-around">
      <a href="/">SHOP</a>
      <a href="/backoffice/">BACKOFFICE</a>
      {#if JSON.parse(localStorage.getItem("login")).islogged}
        <a on:click={logout} href={window.location.href}>LOG OUT</a>
      {:else}
        <a on:click={()=>log = "LOGOUT"} href="/login/">LOG IN</a>
      {/if}
    </div>
  {/if}
  <div class='mininav container' class:mobile={screenWidth<500}>
    <a href="/game/">HOME</a>
    <a href="/game/quiz">QUIZ</a>
    <a href="/game/wordle">WORDLE</a>
    <a href="/game/memory">MEMORY</a>
    <a href="/game/funnyvideos">FUNNY VIDEOS</a>
    <a href="/game/animalinfo">ANIMAL INFO</a>
    <a href="/game/medinfo">MEDICAL INFO</a>
    <a href="/game/yourpets">YOUR PETS</a>
  </div>
</header>


<style>
  .mininav{
    width: 100%;
    height: 5vh;
    background-color: #1a2238;
    overflow-x: scroll;
    overflow-y: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    gap: 3vw;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .mininav::-webkit-scrollbar { display: none; }
	.mininav {
  	-ms-overflow-style: none;  /* IE and Edge */
  	scrollbar-width: none;     /* Firefox */
	}

  .mininav > a {
    text-decoration: none;
    color: white;
    font-weight:800;
    font-size: 85%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    white-space: nowrap;
  }

  .nav > a {
    text-decoration: none;
    color: #9daaf2;
    font-weight:800;
    font-size: 110%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    white-space: nowrap;
  }

  .mobile{
    justify-content: flex-start;
  }

  span{
    font-size: 180%;
  }

  img{
    height: 45px;
    margin-bottom: 20px;
  }

  .logo{
    font-weight: bold;
    font-size: 150%;
    color: white;
  }

  .slogan{
    margin-top: -20px;
    margin-left: 39px;
    font-weight: bold;
    font-size: 50%;
  }

  header{
    width: 100%;
    background-color: #1a2238;
  }

  .navbar-brand{
    text-decoration: none;
    margin-top: -10px;
  }

  .container-fluid{
    justify-content: space-between;
    align-items:center
  }

  .width100{
    width: 100%;
    justify-content: center;
  }

  .shopSearch{
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  .shopSearchBtn{
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
</style>