import { saveToLocalStorage, getlocalStorage, removeFromLocalStorage } from "./localstorage.js";

let searchBarInput = document.getElementById('default-search');

let pokemonName = document.getElementById('pokemonName');
let pokemonImg = document.getElementById('pokemonImg');

const PokemonAPIFetch = async (pokiname) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokiname}`);
    const data = await promise.json();
    console.log(data);
    return data;
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const pad = (num, size) => {
    var s = "000000000" + num;
    return s.substring(s.length - size);
}

searchBarInput.addEventListener('keydown', async (event) => {
    if (event.key === "Enter"){
        let lowercase = event.target.value.toLowerCase();
        
        pokemonImg.src = `../assets/hold-on.gif`;
        
        let pokedata = await PokemonAPIFetch(lowercase);

        if (pokedata.id < 649) {
            console.log("Within Bounds");
        } else {
            console.log("Out of Bounds")
        }

        pokemonName.textContent = capitalizeFirstLetter(pokedata.name) + " - #" + pad(pokedata.id, 3);
        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedata.id}.png`;
        //digimonImg.src = digimon[0].img;
        //digimonName.textContent = digimon[0].name;
        //digimonStatus.textContent = digimon[0].level;

        event.target.value = "";
    }
})


//actualname = await PokemonAPIFetch(25);