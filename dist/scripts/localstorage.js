/*
const saveToLocalStorage = (pokemon) => {
    let favorites = getlocalStorage();

    if (!favorites.includes(pokemon)) {
        favorites.push(pokemon);
    }

    favorites.sort((a, b) => a - b);

    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

const getlocalStorage = () => {
    let localStorageData = localStorage.getItem("Favorites");

    if (localStorageData == null) {
        return [];
    }

    return JSON.parse(localStorageData);
}

const getFavoriteData = () => {
    let localData = localStorage.getItem('localData');

    if (localData === null) {
        localStorage.setItem('Favorites', '[]');
        localStorage.setItem('localData', '{}');
        return {};
    }

    return JSON.parse(localData);
}

const saveFavoriteData = (number, pokemon) => {
    let localData = getFavoriteData();

    localData[number] = {name: pokemon, color: 'rgb(255, 255, 255)'};

    localStorage.setItem('localData', JSON.stringify(localData));
}

const removeFromLocalStorage = (pokemon) => 
{
    let favorites = getlocalStorage();

    let namedIndex = favorites.indexOf(pokemon);

    favorites.splice(namedIndex, 1);

    localStorage.setItem("Favorites", JSON.stringify(favorites));
}

export { saveToLocalStorage, getlocalStorage, removeFromLocalStorage, getFavoriteData, saveFavoriteData };
*/