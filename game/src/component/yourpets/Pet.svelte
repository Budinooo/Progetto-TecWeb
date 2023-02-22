<script>
    import { createEventDispatcher } from 'svelte'
    import {tick} from "svelte";

    export var screenWidth;
    export var info = false;
    export var index;
    var isPetConfirmed = false; 
    var icon;
    var name;
    var gender;
    var species;
    var race;
    var toModify = false;

    tick().then(()=>{
        
    })

    const dispatch = createEventDispatcher()
    
    const confirmed = () =>{
        name = document.getElementById("name").value;
        gender = document.querySelector('input[name="gender"]:checked').value;
        species = document.getElementById("species").value;
        race = document.getElementById("race").value;
        if (!name){
            let tmp = window.getComputedStyle(document.getElementById("namec")).getPropertyValue('border');
            document.getElementById("namec").style.border = "4px solid red";
            setTimeout(function(){
                console.log(tmp)
                document.getElementById("namec").style.border = tmp;
            }, 3000);
        }
        if (!race){
            let tmp = window.getComputedStyle(document.getElementById("racec")).getPropertyValue('border');
            document.getElementById("racec").style.border = "4px solid red";
            setTimeout(function(){
                document.getElementById("racec").style.border = tmp;
            }, 3000);
        }
        if(name && race){
            isPetConfirmed = true;
            switch(species){
                case 'dog':
                    icon = '🐕';
                    break;
                case 'cat':
                    icon = '🐈';
                    break;
                case 'hamster':
                    icon = '🐹';
                    break;
                case 'mouse':
                    icon = '🐀';
                    break;
                case 'horse':
                    icon = '🐎';
                    break;
                case 'cow':
                    icon = '🐄';
                    break;
                case 'pig':
                    icon = '🐖';
                    break;
                case 'sheep':
                    icon = '🐑';
                    break;
                case 'goat':
                    icon = '🐐';
                    break;
                case 'birdie':
                    icon = '🐦';
                    break;
                case 'parrot':
                    icon = '🦜';
                    break;
                case 'owl':
                    icon = '🦉';
                    break;
                case 'bat':
                    icon = '🦇';
                    break;
                case 'fish':
                    icon = '🐟';
                    break;
                case 'frog':
                    icon = '🐸';
                    break;
                case 'turtle':
                    icon = '🐢';
                    break;
                case 'lizard':
                    icon = '🦎';
                    break;
                case 'snake':
                    icon = '🐍';
                    break;
                case 'ant':
                    icon = '🐜';
                    break;
                case 'bee':
                    icon = '🐝';
                    break;
                case 'spider':
                    icon = '🕷️';
                    break;
            }
            if(toModify){
                info.name = name;
                info.icon = icon;
                info.gender = gender;
                info.species = species;
                info.race = race;
                let yep = true;
                dispatch("petModified",{yep,info,index})
            }else{
                dispatch('petConfirmed', {
                    name,icon,gender,species,race    
                })
            }
        }
    }

    const modified = () =>{
        let yep = false;
        dispatch("petModified",{yep})
        toModify = true;
        isPetConfirmed = false;
        tick().then(()=>{
            document.getElementById("name").value = info.name;
            document.querySelector('input[value='+ info.gender +']').checked = true;
            document.getElementById("species").value = info.species;
            document.getElementById("race").value = info.race;
        })  
    }

    const deleted = () =>{
        dispatch("petDeleted",{index})
    }

    const canceled = () =>{
        if (toModify)
            dispatch("petDeleted",{index})
        else
            dispatch("petCancelled",{index})
    }

    if (info){
        name = info.name;
        icon = info.icon;
        gender = info.gender;
        species = info.species;
        race = info.race;
        isPetConfirmed = true;
    }
</script>

<div class="pet flex" class:petmob={screenWidth<500}>
    {#if isPetConfirmed}
        <div class="icon" class:iconmob={screenWidth<500}>
            {icon}
        </div>
        <div class="info" class:infomob={screenWidth<500}>
            <div class="width40" class:width100={screenWidth<500}>
                Name: <span style="font-weight:normal"> {name} </span>
            </div>
            <div class="width40" class:width100={screenWidth<500}>
                Gender: <span style="font-weight:normal"> {gender} </span>
            </div>
            <div class="width40" class:width100={screenWidth<500}>
                Species: <span style="font-weight:normal"> {species} </span>
            </div>
            <div class="width40" class:width100={screenWidth<500}>
                Race: <span style="font-weight:normal"> {race} </span>
            </div>
            
        </div>
        <div class="buttons" class:width100={screenWidth<500}>
            <button type="button" class="btn btn-primary" class:butmob={screenWidth<500} on:click={modified}>Edit</button>
            <button type="button" class="btn btn-danger" class:butmob={screenWidth<500} on:click={deleted}>Delete</button>
        </div>
    {:else}
        <div style="width: 80%; display:flex; justify-content:space-around; flex-wrap:wrap; font-size: 35%; align-items:center" class:width100={screenWidth<500} >
            <div class:width100={screenWidth<500} class:padtop={screenWidth<500} class="form-floating" id="namec">
                <input type="text" class="form-control form-control-sm" id="name" placeholder="Name">
                <label for="name">Name</label>
            </div>
            <div class:width100={screenWidth<500} style="width: 45%">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="inlineRadio1" value="male" checked>
                    <label class="form-check-label" for="inlineRadio1">Male</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="inlineRadio2" value="female">
                    <label class="form-check-label" for="inlineRadio2">Female</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="inlineRadio3" value="others">
                    <label class="form-check-label" for="inlineRadio3">Others</label>
                </div>
            </div>
            <div class="form-floating" class:width100={screenWidth<500}>
                <select class="form-select form-select-sm" id="species" aria-label="Floating label select example">
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="hamster">Hamster</option>
                    <option value="mouse">Mouse</option>
                    <option value="horse">Horse</option>
                    <option value="cow">Cow</option>
                    <option value="pig">Pig</option>
                    <option value="sheep">Sheep</option>
                    <option value="goat">Goat</option>
                    <option value="birdie">Birdie</option>
                    <option value="parrot">Parrot</option>
                    <option value="owl">Owl</option>
                    <option value="bat">Bat</option>
                    <option value="fish">Fish</option>
                    <option value="frog">Frog</option>
                    <option value="turtle">Turtle</option>
                    <option value="lizard">Lizard</option>
                    <option value="snake">Snake</option>
                    <option value="ant">Ant</option>
                    <option value="bee">Bee</option>
                    <option value="spider">Spider</option>
                </select>
                <label for="species">Choose the species</label>
            </div>
            <div class="form-floating" id="racec" class:width100={screenWidth<500}>
                <input type="text" class="form-control form-control-sm" id="race" placeholder="race">
                <label for="race">Race</label>
            </div>
        </div>

        <div class="buttons" class:width100={screenWidth<500} >
            <button type="button" class="btn btn-success" class:butmob={screenWidth<500} on:click={confirmed}>Confirm</button>
            <button type="button" class="btn btn-danger" class:butmob={screenWidth<500} on:click={canceled}>Cancel</button>
        </div>
    {/if}
</div>

<style>
    .pet{
        width: 85%;
        height: 28vh;
        border: 4px solid grey;
        font-size: 250%;
        font-weight: bold;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
        position: relative;
    }

    .form-floating{
        width: 45%;
    }

    .buttons{
        width: 20%;
        display:flex;
        justify-content:flex-end;
        flex-direction:column;
        align-items:center;
    }

    button{
        width: 60%;
        height: 25%;
        margin-bottom:10%;
        box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
        font-weight: 800;
    }

    .icon{
        width: 20%; 
        display:flex; 
        justify-content:center; 
        align-items:center; 
        border-right: 4px solid grey; 
        font-size:160%; 
        box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    }

    .info{
        width: 60%; 
        font-size: 50%;
        display:flex; 
        justify-content:space-around; 
        flex-wrap:wrap; 
        align-items:center;
    }

    .petmob{
        width: 95%;
        height: fit-content;
        flex-wrap: wrap;
        justify-content: center;
        padding-bottom: 10px;
    }

    .butmob{
        width: 45%;
        height: 40%;
        margin-bottom:0;
        margin-top:10px;  
    }

    .infomob{
        width: 100%;
        justify-content: center;
        padding-left: 10px;
    }

    .iconmob{
        width: 100%;
        border-right: 0; 
        border-bottom: 4px solid grey;
    }

    .width40{
        width: 40%;
    }

    .width100{
        width: 100%;
    }

    .padtop{
        padding-top: 10px;
    }
</style>