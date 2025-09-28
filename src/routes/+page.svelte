<script lang="ts" >
	//export and  import
	import Card from '$lib/component/card.svelte';
	import { onMount, onDestroy } from 'svelte';
	import "$lib/component/styling.css";
	import { createSearchStore, type Item } from '$lib/store/search.ts';

	export let data;
	export let pokemon_list = data.initial;

	//filterd list of pokemons contains; name, id ,types.
	let filtered = pokemon_list.map(p => ({
	name: p.name,
	url: p.url,
	id: p.url.split("/").filter(Boolean).pop(),
	types: []
	}));

	let typesList;
	let filterButton=false;
	let explore = true;
	let searchButton=false;
	let total_count = data.count;
	let nextUrl = data.next;
	let sidebarOpen = false; //takes true when user click on a certain pokemone to shown
	let selected = null; // takes a value when user select certain pokemon


	// create store to be searched
	const pokemones_store: Item [] = pokemon_list.map(p => ({
	name: p.name,
	url: p.url,
	id: p.url.split('/').filter(Boolean).pop(),
	types: [],
	searchTerms: (p.name || '').toLowerCase()
	}));

	const searchStore = createSearchStore(pokemones_store);

	let newFiltered: Item [] = pokemones_store;
	const unsubscribe = searchStore.subscribe((s: any) => {
	filtered = s.filtered;
	});
	onDestroy(() => unsubscribe());

	//to catch user input
	function handleSearch(e: InputEvent) {
	const v = (e.target as HTMLInputElement).value;
	searchStore.search(v);
	if (v.trim() !== "") {
	setSearchMode();
	}	}

	//setting modes
	async function setFilterMode(){
	filterButton=true;
	explore = false;
	searchButton=false;
	}
	async function setExploreMode() {
	filterButton=false;
	explore = true;
	searchButton=false;
	}
	async function setSearchMode() {
	filterButton=false;
	explore = false;
	searchButton=true;
	}

	//get certain pokemon types for filtiring process
	async function getTypes(url) {
	try {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch types");
	const data = await res.json();
	return data.types;
	} catch (err) {
	console.error(err);
	return [];
	}
	}

	//update the 'whole list' pokemon types using getTypes function
	async function updateTypes(poki_l) {
	filtered=[...filtered, ...poki_l]
	await Promise.all(
	poki_l.map(async (p) => {
	const typesData = await getTypes(p.url);
	p.types = typesData.map(t => t.type.name);
	})
	);
	}

	//getting  datails of one pokemns: abilites, stats...
	async function getDetails(url) {
	try {
	const res = await fetch(url);
	if (!res.ok) throw new Error("faild to find URL");
	selected = await res.json();
	sidebarOpen = true;

	}
	catch (err) {
	console.error(err);
	}
	}

	//load more pokemons to the list
	let sentinel;
	async function loadMore() {
	if (!nextUrl) return;
	try {
	const res = await fetch(nextUrl);
	if (!res.ok) throw new Error("Failed to fetch");
	const json = await res.json();
	const newPokemons = json.results.map(p => ({
	name: p.name,
	url: p.url,
	id: p.url.split("/").filter(Boolean).pop(),
	types: []
	}));

	pokemon_list = [...pokemon_list, ...json.results];
	updateTypes(newPokemons);
	filtered = [...filtered, ...newPokemons];


	nextUrl = json.next;
	searchStore.addItems(newPokemons);


	} catch (err) {
	console.error(err);
	}
	}

	async function TypesList() {
	try {
	const res = await fetch("https://pokeapi.co/api/v2/type");
	const json = await res.json();
	typesList = json.results;
	} catch (err) {
	console.error("Failed to load types", err);
	typesList = [];
	}
	}


	let observer;

	function setupObserver() {
	if (observer) observer.disconnect(); // نوقف أي observer قديم
	observer = new IntersectionObserver(entries => {
	if (entries[0].isIntersecting) loadMore();
	}, { root: null, rootMargin: '0px', threshold: 1.0 });

	if (sentinel) observer.observe(sentinel);
	}

	onMount(() => {
	updateTypes(filtered);
	TypesList();
	setupObserver();
	return () => observer.disconnect();
	});

	$: if (sentinel) {
	setupObserver();
	}


</script>

<!--first section contains page title and explore button -->
<div class="container ">
	<div >
		<div class="grid grid-cols-[1fr_6fr]">
				<img src="images/logo.png" alt="logo" width="50" height="50" class="ml-5 mb-4 mt-7 " />

			<h class="h">Pokemon Explorer</h>
		</div>
		<div class="grid grid-cols-[1fr_6fr]">
			<img src="images/explore.png" alt="explore" width="30" height="30" class="ml-7 mb-4 mt-8 " />
			<button type="button" on:click={() =>setExploreMode()} class="explore-button "> Explore </button>
		</div>
	</div>

	<!--second section contains: search and filter options and resultes, list of pokemons -->
	<div class="FirstDiv">
		<!--search for pokemons by name,filter by type--> 
		<input class="search-input" type="search" placeholder="Search..." on:input={handleSearch} />
		<button type="button" on:click={() =>setFilterMode()} class=" ml-40 mt-4 h-9 w-15 bg-gray-400 rounded hover:bg-gray-700 text-black "> filter </button>

		{#if explore}
		<!--the main list of pokemons-->
		<ul class="pokemons-list">
			{#each pokemon_list as p}
			<li>
				<button on:click={() =>
					getDetails(p.url)} class="pokemon-button">
					{p.name}
					<br />
					<span class="text-sm text-gray-200"> # {p.url.split("/").filter(Boolean).pop()}</span>
				</button>
			</li>
			{/each}
			<li bind:this={sentinel}></li>
		</ul>

		{:else}
		<!--check dropdown list to filter by type-->
		{#if filterButton}
		<div class="mt-2">
			{#each typesList as type}
			<label class="block">
				<input
				  type="checkbox"
				  value={type.name}
				  on:change={(e) =>
					searchStore.toggleType((e.target as HTMLInputElement).value)
					}
					/>
					{type.name}
				</label>
			{/each}
		</div>
		{/if}
		<!--print the filtered list-->
		<ul class="filtered-list mt-4">
			{#each filtered as p}
			<li>
				<button on:click={() =>
					getDetails(p.url)} class="pokemon-button">
					{p.name}
					<br />
					<span class="text-sm text-gray-200">
						#&nbsp;{p.id} &nbsp;&nbsp;&nbsp; {p.types?.join(", ")}
					</span>
				</button>
			</li>
			{/each}
		</ul>
		{/if}


	</div>

	<!--side bar contain selceted pokemons' inofrmation-->
	{#if sidebarOpen}
	<div class="bg-gray-100 border-l p-4 ">
		{#if selected}
		<Card  pokemon={selected} open={sidebarOpen} onClose={()=> sidebarOpen=false} />
			{/if}
		</div>
	{/if}
</div>