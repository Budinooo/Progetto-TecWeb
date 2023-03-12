<script>
    import Pet from "./Pet.svelte";
    import { myPets } from "./store";
    
    var screenWidth = window.innerWidth;

    window.addEventListener("resize", function(event) {
        screenWidth = window.innerWidth;
    })

    var petsList;
    var petCounter = 0;
    var petAdded;

    var user;
    let local = JSON.parse(localStorage.getItem("login"))
    if (local.islogged){
        fetch('/db/element?id='+local.id+'&collection=users',{
            method:'GET'
        }).then(response => response.json())
        .then(data => {
            user = data.result;
            petsList = data.result.pets;
            petCounter = petsList.length
            console.log(data)
            petAdded = true;
        })
    }else{
        petsList = JSON.parse($myPets);
        petCounter = petsList.length
        petAdded = true
    }

    const addForm = () =>{
        if (petAdded){
            petCounter++;
            petAdded = false;
        }
    }

    const addPet = (event) =>{
        let pet = {
            name: event.detail.name,
            icon: event.detail.icon,
            gender: event.detail.gender,
            species: event.detail.species,
            race: event.detail.race
        }
        
        petsList.push(pet);
        if(local.islogged)
            editUserDB();
        else
            myPets.set(JSON.stringify(petsList)); 
        petAdded = true;
    }

    const modifyPet = (event) =>{
        if (event.detail.yep){
            petAdded = true;
            petsList[event.detail.index] = event.detail.info;
            if(local.islogged)
                editUserDB();
            else
                myPets.set(JSON.stringify(petsList)); 
        }else
            petAdded = false;
    }

    const cancelPet = (event) =>{
        petCounter--;
        petAdded = true;
    }

    const deletePet = (event) =>{
        petsList.splice(event.detail.index,1);
        petCounter--;
        if(local.islogged)
            editUserDB();
        else
            myPets.set(JSON.stringify(petsList)); 
        petAdded = true;
    }

    const editUserDB = () =>{
        let obj = {
            collection:'users',
            elem:{
                "_id": user._id,
                "name": user.name,
                "username": user.username,
                "email": user.email,
                "password": user.password,
                "favorites": user.favorites,
                "pets": petsList,
                "score": user.score,
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
        })
    }
</script>

<div class="container">
    <div class="titlepage" class:titlepagemob={screenWidth<500}> <span class="capital">Y</span>OUR <span class="capital">P</span>ETS</div>
</div>
<div class="content container flex">
    {#each Array(petCounter) as _, index (index)}
        <Pet {screenWidth} on:petConfirmed={addPet} on:petModified={modifyPet} on:petDeleted={deletePet} on:petCancelled={cancelPet} info={petsList[index]} index={index}/>
    {/each}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="add flex" on:click={addForm}>+</div>
</div>

<style>
    .content{
        min-height: fit-content;
        flex-wrap: wrap;
        justify-content: center;
        gap: 3vh;
    }

    .add{
        width: 85%;
        height: 26vh;
        border: 4px dashed grey;
        justify-content: center;
        align-items: center;
        font-size: 250%;
        font-weight: bold;
        color: grey;
        cursor: pointer;
    }

    .add:hover{
        background-color: rgb(194, 194, 194);
        border: 4px dashed grey;
    }
</style>