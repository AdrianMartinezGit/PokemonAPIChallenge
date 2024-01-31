import { saveToLocalStorage, getlocalStorage, removeFromLocalStorage } from "./localstorage.js";

let pokeData, speciesData, pokeId, encounterData, evolveData, allEvolvePaths;
let ShinyPokemon = false;

let searchBarInput = document.getElementById('default-search');

let pokemonName = document.getElementById('pokemonName');
let pokemonImg = document.getElementById('pokemonImg');
let pokemonFlavorText = document.getElementById('pokemonFlavorText');

let pokemonType = document.getElementById('pokemonType');
let pokemonPlace = document.getElementById('pokemonPlace');
let pokemonAbility = document.getElementById('pokemonAbility');
let pokemonMoves = document.getElementById('pokemonMoves');


async function GetPokemonData(pokemon = searchBarInput.value.toLowerCase()) {
    searchBarInput.value = '';

    let pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    pokeData = await pokeResponse.json();
    pokeId = pokeData.id;

    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
    speciesData = await speciesResponse.json();

    if (speciesData.evolution_chain !== null) {
        let evolveUrl = speciesData.evolution_chain.url;
        let evolveResponse = await fetch(evolveUrl);
        evolveData = await evolveResponse.json();
    } else {
        evolveData = null;
    }

    let id = pokeData.id;
    let encounterResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
    encounterData = await encounterResponse.json();

    if (encounterData.length === 0) {
        encounterData = [{location_area: {name: 'Unkown'}}];
    }
}

function setFavIcon() {
    let favorites = getLocalStorage();

    /*
    if (favorites.includes(pokeData)) {
        heartImg.classList.add('ph-heart-fill');
        heartImg.classList.add('text-red-600');
        heartImg.classList.remove('ph-heart');
    } else {
        heartImg.classList.remove('ph-heart-fill');
        heartImg.classList.remove('text-red-600');
        heartImg.classList.add('ph-heart');
    }
    */
}

function GetEnglishFlavorText() {
    let flavorArray = speciesData.flavor_text_entries;
    let flavor = 'Not much is known about this mysterious Pokemon. Play the latest game to find out more!';
    
    for (let i = 0; i < flavorArray.length; i++) {
        if (flavorArray[i].language.name == 'en') {
            flavor = flavorArray[i].flavor_text.replaceAll('', ' ');
            break;
        }
    }
    return flavor;
}

async function PopulateData() 
{
    ShinyPokemon = false;

    pokemonName.textContent = capitalizeFirstLetter(pokeData.name) + " - #" + pad(pokeData.id, 3);
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeData.id}.png`;

    pokemonFlavorText.textContent = '"' + GetEnglishFlavorText() + '"';

    let location = encounterData[0].location_area.name;
    pokemonPlace.textContent = "Location: " + capitalSplitCase(location).replace(' Area', '');

    let abilities = pokeData.abilities.map(data => capitalSplitCase(data.ability.name));
    pokemonAbility.textContent = "Abilities: " + abilities.join(', ');

    let moves = pokeData.moves.map(data => capitalSplitCase(data.move.name));
    pokemonMoves.textContent = "Moves: " + moves.join(', ');
    
    /*

    let types = pokData.types.map(data => CapCase(data.type.name));
    PopulateTypeIcons(types);

    let pName = document.createElement('p');
    pName.textContent = CapCase(pokData.name);

    setFavIcon();
    ParseEvoData();
    PopulateEvoData();
    */
}

searchBarInput.addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        if (searchBarInput.value === '') {
            console.log('Empty search')
            return;
        };

        pokemonImg.src = `./assets/ANIM_Loading.gif`;

        await GetPokemonData();
        await PopulateData();
    }
})

async function PageLoad() {
    await GetPokemonData(1);
}

PageLoad();


/*
let searchBarInput = document.getElementById('default-search');

let pokemonName = document.getElementById('pokemonName');
let pokemonImg = document.getElementById('pokemonImg');
let pokemonFlavorText = document.getElementById('pokemonFlavorText');

const PokemonAPIFetch = async (pokiname) => {
    const main_promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokiname}`);
    const main_data = await main_promise.json();

    const species_promise = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokedata.id}/`);

    return data;
}
*/

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalSplitCase = (word, splitOn = '-', joinWith = ' ') => {
    return word.split(splitOn)
                .map(word => word[0].toUpperCase() + word.slice(1))
                .join(joinWith);
}

const pad = (num, size) => {
    var s = "000000000" + num;
    return s.substring(s.length - size);
}

/*
searchBarInput.addEventListener('keydown', async (event) => {
    if (event.key === "e"){
        let lowercase = event.target.value.toLowerCase();
        
        pokemonImg.src = `./assets/ANIM_Loading.gif`;
        
        let pokedata = await PokemonAPIFetch(lowercase);

        if (pokedata.id > 0 && pokedata.id <= 649) {
            console.log("Within Bounds");
        } else {
            console.log("Out of Bounds")
        }

        
        pokemonName.textContent = capitalizeFirstLetter(pokedata.name) + " - #" + pad(pokedata.id, 3);
        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedata.id}.png`;
        
        let promise = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokedata.id}/`);
        let data = await promise.json();
        console.log(data);
        pokemonFlavorText.textContent = await `"${data.flavor_text_entries[6].flavor_text}"`;

        //pokemonFlavorText.textContent = '"FLAVOR TEXT"';
        //digimonImg.src = digimon[0].img;
        //digimonName.textContent = digimon[0].name;
        //digimonStatus.textContent = digimon[0].level;

        event.target.value = "";
    }
})
*/

//actualname = await PokemonAPIFetch(25);