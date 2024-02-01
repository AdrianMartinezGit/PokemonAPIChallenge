import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage, getLocalFavoriteData, saveLocalFavoriteData } from './localstorage.js';

let pokeData, speciesData, pokeId, encounterData, evolveData, allEvolvePaths;
let ShinyPokemon = false;

let searchBarInput = document.getElementById('default-search');
let randomPokeButton = document.getElementById('randomPokeButton');
let favoritePokeButton = document.getElementById('favoritePokeButton');

let pokemonName = document.getElementById('pokemonName');
let pokemonImg = document.getElementById('pokemonImg');
let pokemonFlavorText = document.getElementById('pokemonFlavorText');

let typeContainer = document.getElementById('typeContainer');
let pokemonPlace = document.getElementById('pokemonPlace');
let pokemonAbility = document.getElementById('pokemonAbility');
let pokemonMoves = document.getElementById('pokemonMoves');

let favoriteDrawer = document.getElementById('favoriteDrawer');
let favoriteBox = document.getElementById('favoriteBox');
let favoriteDrawerButton = document.getElementById('favoriteDrawerButton');
let drawerCloseButton = document.getElementById('drawerCloseButton');
const favoriteClassdrawer = new Drawer(favoriteDrawer);

let evolveContainer = document.getElementById('evolveContainer');

let typeColors = { Bug: '#90c12c', Dark: '#5a5366', Dragon: '#0a6dc4', Electric: '#f3d23b', Fairy: '#ec8fe6', Fighting: '#ce4069', Fire: '#ff9c54', Flying: '#8fa8dd', Ghost: '#5269ac', Grass: '#63bd5b', Ground: '#d97746', Ice: '#74cec0', Normal: '#9099a1', Poison: '#ab6ac8', Psychic: '#f97176', Rock: '#c7b78b', Steel: '#5a8ea1', Water: '#4d90d5' };
console.log(typeColors.length);

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
    
    let types = pokeData.types.map(data => capitalSplitCase(data.type.name));
    PopulateElementTypeIcons(types);

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
        div.classList.add('favePokeBox', 'flex');
        div.style.background = favoriteData[pokeNumber].color;
        div.style.cssText = `outline: 1px solid black;`;

        div.addEventListener('click', async function() {
            await GetPokemonData(pokeNumber);
            await PopulateData();
            favoriteClassdrawer.hide();
        });

        let input = document.createElement('input');
        input.type = 'image';
        input.src = `./assets/IMG_SubButton.png`;
        input.style.cssText = `width: 32px; height: 32px; padding-top: 5px;`;

        input.addEventListener('click', ()=> {
            removeFromLocalStorage(pokeId);
            SetFavoriteIcon();
            div.remove();
            input.remove();
        });

        let img = document.createElement('img');
        img.classList.add('favePokeImg');
        img.style.cssText = 'padding-top: 12px;';
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeNumber}.png`;

        let p = document.createElement('p');
        p.className = "favePokeText font-semibold text-right pr-5 pt-2";
        p.innerHTML = `${favoriteData[pokeNumber].name}<br>#${pad(pokeNumber, 3)}`;
        p.style.cssText = 'width: 100%; line-height: 30px; height: 50%;';

        div.append(img, p);
        favoriteBox.appendChild(div);
        favoriteBox.append(input);
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
    evolveContainer.innerHTML = '';

    for (let i = 0; i < allEvolvePaths.length; i++) {
        let thisPath = allEvolvePaths[i];
        let outterDiv = document.createElement('div');
        outterDiv.classList.add('flex', 'items-center', 'justify-center', 'evolveBranch');
        outterDiv.style.cssText = `outline: 2px solid black; background-color: white; border-radius: 5px;`;

        for (let j = 0; j < thisPath.length; j++) {
            let thisMon = thisPath[j];

            let innerDiv = document.createElement('div');
            innerDiv.classList.add('evolveCol');
            
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

            img.classList.add('evolveImg', 'mx-auto');

            img.addEventListener('click', async function() {
                await GetPokemonData(thisMon.id);
                await PopulateData();
                
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  });
            });

            let p = document.createElement('p');
            p.textContent = thisMon.name;
            p.classList.add('text-center');

            innerDiv.append(img, p);
            outterDiv.append(innerDiv);
        }
        evolveContainer.append(outterDiv);
    }
}

function PopulateElementTypeIcons(types) {
    typeContainer.innerHTML = '';

    types.forEach(element => {
        let div = document.createElement('div');
        div.classList.add('typeIconContainer', 'flex', 'items-center');
        div.style.backgroundColor = typeColors[element];

        let img = document.createElement('img');
        img.src = `./assets/IMG_${element}.png`;
        img.classList.add('typeImg');

        let p = document.createElement('p');
        p.classList.add('text-white', 'mx-auto', 'text-2xl', 'pr-4');
        p.textContent = element;

        div.append(img, p);
        typeContainer.append(div);
    });
}

favoriteDrawerButton.addEventListener('click', function() {
    CreateElements();
    favoriteClassdrawer.show();
});
drawerCloseButton.addEventListener('click', function() {
    favoriteClassdrawer.hide();
})