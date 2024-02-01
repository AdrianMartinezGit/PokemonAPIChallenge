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

let favoriteDrawer = document.getElementById('favoriteDrawer');
let favoriteBox = document.getElementById('favoriteBox');
let favoriteDrawerButton = document.getElementById('favoriteDrawerButton');
let drawerCloseButton = document.getElementById('drawerCloseButton');
const favoriteClassdrawer = new Drawer(favoriteDrawer);

let evolveContainer = document.getElementById('evolveContainer');

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
    */

    SetFavoriteIcon();
    ParseEvolveData();
    PopulateEvolveData();
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
    ParseEvolveData();
    PopulateEvolveData();
}

onPageLoad();

const capitalSplitCase = (string, splitOn = '-', joinWith = ' ') => {
    return string.split(splitOn).map(string => string[0].toUpperCase() + string.slice(1)).join(joinWith);
}

const pad = (num, size) => {
    let s = "000000000" + num;
    return s.substring(s.length - size);
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
    //let favoriteData = getLocalFavoriteData();

    if (favorites.includes(pokeId)) {
        removeFromLocalStorage(pokeId);
    } else {
        saveToLocalStorage(pokeId);
        saveLocalFavoriteData(pokeId, capitalSplitCase(pokeData.name), 'rgb(255, 255, 255)');
    }

    SetFavoriteIcon();
});

const CreateElements = () => {
    favoriteBox.innerHTML = '';

    let favoriteData = getLocalFavoriteData();
    let favorites = getLocalStorage();
    
    
    favorites.map(pokeNumber => {
        let div = document.createElement('div');
        div.classList.add('favePokeBox', 'mx-auto', 'flex', 'items-start');
        div.style.background = favoriteData[pokeNumber].color;
        div.style.cssText = `outline: 1px solid black;`;

        let p = document.createElement('p');
        p.className = "favePokeText font-semibold";
        p.innerText = favoriteData[pokeNumber].name + ' #' + pad(pokeNumber, 3)
        //p.innerHTML = `<p class="favePokeText">${favoriteData[pokeNumber].name}<br>${'#' + pad(pokeNumber, 3)}</p>`

        let img = document.createElement('img');
        img.classList.add('favePokeImg');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeNumber}.png`;

        let button = document.createElement('input');
        button.type = 'image';
        button.src  = `./assets/IMG_SubButton.png`;
        button.className = 'favoriteButtonSubRemove';
        
        button.style.cssText = `width: 32px; height: 32px; `;

        div.addEventListener('click', async function() {
            await GetPokemonData(pokeNumber);
            await PopulateData();
            favoriteClassdrawer.hide();
        });

        button.addEventListener('click', ()=> {
            removeFromLocalStorage(pokeId);
            div.remove();
        });

        div.append(img, p, button);
        favoriteBox.appendChild(div);
    })
}

const ParseEvolveData = () => {
    allEvolvePaths = [];

    if (evolveData === null) {
        console.warn('No evolve path!');
        let evolveBase = {};
        evolveBase.name = capitalSplitCase(pokeData.name);
        evolveBase.id = pokeData.id;
        allEvolvePaths.push([evolveBase]);
    } else {
        let evolveBase = {};
        evolveBase.name = capitalSplitCase(evolveData.chain.species.name);
        evolveBase.id = evolveData.chain.species.url.split('/').slice(-2)[0];
        let evolveTo = evolveData.chain.evolves_to;

        for (let i = 0; i < evolveTo.length; i++) {
            let evolveMid = {};
            evolveMid.name = capitalSplitCase(evolveTo[i].species.name);
            evolveMid.id = evolveTo[i].species.url.split('/').slice(-2)[0];

            let evolveArray = [evolveBase, evolveMid];
            let innerEvolveTo = evolveTo[i].evolves_to;

            if (innerEvolveTo.length >= 1) {
                for (let j = 0; j < innerEvolveTo.length; j++) {
                    let evolveMax = {};
                    evolveMax.name = capitalSplitCase(innerEvolveTo[j].species.name);
                    evolveMax.id = innerEvolveTo[j].species.url.split('/').slice(-2)[0];
                    evolveArray = [evolveBase, evolveMid, evolveMax];
                    allEvolvePaths.push(evolveArray);
                }
            } else {
                allEvolvePaths.push(evolveArray);
            }
        }
    }
    if (allEvolvePaths.length === 0) {
        let evolveBase = {};
        evolveBase.name = capitalSplitCase(pokeData.name);
        evolveBase.id = pokeData.id;
        allEvolvePaths.push([evolveBase]);
    }
}

const PopulateEvolveData = () => {
    evoCont.innerHTML = '';
    for (let i = 0; i < allEvoPaths.length; i++) {
        // let pEvo = document.createElement('p');
        // pEvo.textContent = allEvoPaths[i].map(data => data.name).join(' --> ');
        // pEvo.classList.add('text-2xl', 'mt-2');
        // evoCont.append(pEvo);
        let thisPath = allEvoPaths[i];
        let outterDiv = document.createElement('div');
        outterDiv.classList.add('flex', 'items-center', 'justify-center', 'evoBranch');
        for (let j = 0; j < thisPath.length; j++) {
            let thisMon = thisPath[j];

            let innerDiv = document.createElement('div');
            innerDiv.classList.add('evoCol');
            
            if (j > 0) {
                let iCon = document.createElement('i');
                iCon.classList.add('ph-arrow-right-bold');
                outterDiv.append(iCon);
            }

            let img = new Image();
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${thisMon.id}.gif`;
            img.onerror = function() {
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${thisMon.id}.png`;
                img.onerror = null;
            }
            img.classList.add('evoImg', 'mx-auto');
            img.addEventListener('click', async function() {
                await GetPokemonData(thisMon.id);
                await PopulateData();
                AdaptiveBackgrounds();
                window.scrollTo({top: 0, behavior: 'instant'});
            });

            let p = document.createElement('p');
            p.textContent = thisMon.name;
            p.classList.add('text-center');

            innerDiv.append(img, p);
            outterDiv.append(innerDiv);
        }
        evoCont.append(outterDiv);
    }
}

favoriteDrawerButton.addEventListener('click', function() {
    CreateElements();
    favoriteClassdrawer.show();
});
drawerCloseButton.addEventListener('click', function() {
    favoriteClassdrawer.hide();
})