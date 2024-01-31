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

let firstDiv = document.getElementById('firstDiv');


const GetPokemonData = async (pokemon = searchBarInput.value.toLowerCase()) => {
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

    let id = pokeId;
    let encounterResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
    encounterData = await encounterResponse.json();

    if (encounterData.length === 0) {
        encounterData = [{location_area: {name: 'Unkown'}}];
    }
}

const SetFavoriteIcon = () => {
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

const GetFlavorText = () => {
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

const PopulateData = async () => {
    ShinyPokemon = false;

    pokemonName.textContent = capitalizeFirstLetter(pokeData.name) + " - #" + pad(pokeId, 3);
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeData.id}.png`;

    pokemonFlavorText.textContent = '"' + GetFlavorText() + '"';

    let location = encounterData[0].location_area.name;
    pokemonPlace.textContent = capitalSplitCase(location).replace(' Area', '');

    let abilities = pokeData.abilities.map(data => capitalSplitCase(data.ability.name));
    pokemonAbility.textContent = abilities.join(', ');

    let moves = pokeData.moves.map(data => capitalSplitCase(data.move.name));
    pokemonMoves.textContent = moves.join(', ');
    
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

const PageLoad = async () => {
    await GetPokemonData(1);
    await PopulateData();
}

PageLoad();

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalSplitCase = (string, splitOn = '-', joinWith = ' ') => {
    return string.split(splitOn).map(string => string[0].toUpperCase() + string.slice(1)).join(joinWith);
}

const pad = (num, size) => {
    let s = "000000000" + num;
    return s.substring(s.length - size);
}