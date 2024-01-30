import { saveToLocalStorage, getlocalStorage, removeFromLocalStorage } from "./localstorage.js";

let actualname = "";

const PokemonAPIFetch = async (pokiname) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokiname}`);
    const data = await promise.json();
    console.log(data);
    return data;
}

actualname = await PokemonAPIFetch(25);