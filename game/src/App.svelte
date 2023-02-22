<script>
	import page from "page"
	import Navbar from "./component/Navbar.svelte"
	import Home from "./component/Home.svelte"
	import Footer from "./component/Footer.svelte";
	import Quiz from "./component/quiz/Quiz.svelte";
	import Wordle from "./component/wordle/Wordle.svelte";
	import Memory from "./component/memory/Memory.svelte";
	import AnimalInfo from "./component/animalInfo/AnimalInfo.svelte";
	import FunnyVideos from "./component/videos/FunnyVideos.svelte";
	import MedInfo from "./component/medinfo/MedInfo.svelte";
    import YourPets from "./component/yourpets/YourPets.svelte";
    import { login } from "./store";

	let thispage;
	let params;

	page('/game', () => thispage = Home);
	page('/game/quiz/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = Quiz)
	page('/game/wordle/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = Wordle)
	page('/game/memory/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = Memory)
	page('/game/animalinfo/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = AnimalInfo)
	page('/game/funnyvideos/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = FunnyVideos)
	page('/game/medinfo/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = MedInfo)
	page('/game/yourpets/', (ctx, next)=>{
		params = ctx.params;
		next();
	}, () => thispage = YourPets)

	page.start();

	let myLogin = JSON.parse($login);
</script>

<Navbar/>
<svelte:component this={thispage} {params}/>
<footer>
	<Footer/>
</footer>


<style>
	footer{
		margin-top: auto;
	}
</style>