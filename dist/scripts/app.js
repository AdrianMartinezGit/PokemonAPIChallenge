import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage, getLocalFavoriteData, saveLocalFavoriteData } from './localstorage.js';

let pokeData, speciesData, pokeId, encounterData, evolveData, allEvolvePaths;
let ShinyPokemon = false;

let searchBarInput = document.getElementById('default-search');
let randomPokeButton = document.getElementById('randomPokeButton');
let favoritePokeButton = document.getElementById('favoritePokeButton');

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

    const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    pokeData = await pokeResponse.json();
    pokeId = pokeData.id;

    console.log(pokeData);

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
    speciesData = await speciesResponse.json();

    console.log(speciesData);

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

    if (favorites.includes(pokeId)) {
        favoritePokeButton.src = `./assets/IMG_SubButton.png`;
    } else {
        favoritePokeButton.src = `./assets/IMG_AddButton.png`;
    }
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

    pokemonName.textContent = capitalSplitCase(pokeData.name) + " - #" + pad(pokeId, 3);
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

    ParseEvoData();
    PopulateEvoData();
    */

    SetFavoriteIcon();
}

searchBarInput.addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        if (searchBarInput.value === '') {
            console.log('Empty search');
            return;
        };

        pokemonImg.src = `./assets/ANIM_Loading.gif`;

        await GetPokemonData();
        await PopulateData();
    }
})

const onPageLoad = async () => {
    await GetPokemonData(1);
    await PopulateData();
    SetFavoriteIcon();
}

onPageLoad();

const capitalSplitCase = (string, splitOn = '-', joinWith = ' ') => {
    return string.split(splitOn).map(string => string[0].toUpperCase() + string.slice(1)).join(joinWith);
}

const pad = (num, size) => {
    let s = "000000000" + num;
    return s.substring(s.length - size);
}

const createElements = () => {

}

pokemonImg.addEventListener('click', () => {
    ShinyPokemon = !ShinyPokemon;

    if (ShinyPokemon == true) {
        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokeData.id}.png`;
        
    } else {
        pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeData.id}.png`;
    }
});

randomPokeButton.addEventListener('click', async () => {
    if (pokemonImg.src !== `./assets/ANIM_Loading.gif`) {
        let random = Math.floor(Math.floor(Math.random() * 1008) + 1);
    
        pokemonImg.src = `./assets/ANIM_Loading.gif`;
    
        await GetPokemonData(random);
        await PopulateData();
    }
});

favoritePokeButton.addEventListener('click', () => {
    let favorites = getLocalStorage();
    let favoriteData = getLocalFavoriteData();

    if (favorites.includes(pokeId)) {
        removeFromLocalStorage(pokeId);
    } else {
        saveToLocalStorage(pokeId);
        saveLocalFavoriteData(pokeId, capitalSplitCase(pokeData.name), 'rgb(255, 255, 255)');
    }

    SetFavoriteIcon();
});