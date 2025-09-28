import { error } from "@sveltejs/kit";

export async function load() {
    try {
    //loading the first 20 pokemone on the list
     const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");
    if (!res.ok) throw new error("faild to load list");
    const data = await res.json();
    return { initial: data.results, next: data.next || null }; }
    
catch (err) {
    console.error(err);
    return { initial: [], next: null, loadError: true };
}
}
