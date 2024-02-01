const saveToLocalStorage = (pokename) => {
    let favorites = getLocalStorage();

    favorites.push(pokename);

    favorites.sort((a, b) => a - b);

    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

const getLocalStorage = () => {
    let localStorageData = localStorage.getItem('Favorites');

    if (localStorageData === null) {
        return [];
    }

    return JSON.parse(localStorageData);
}

const getLocalFavoriteData = () => {
    let localFavoriteData = localStorage.getItem('FavoriteData');

    if (localFavoriteData === null) {
        localStorage.setItem('Favorites', '[]');
        localStorage.setItem('FavoriteData', '{}');
        return {};
    }

    return JSON.parse(localFavoriteData);
}

const saveLocalFavoriteData = (number, pokename, color) => {
    let favoriteData = getLocalFavoriteData();

    favoriteData[number] = {name: pokename, color: color};

    localStorage.setItem('FavoriteData', JSON.stringify(favoriteData));
}

const removeFromLocalStorage = (pokename) => {
    let favorites = getLocalStorage();

    let nameIndex = favorites.indexOf(pokename);

    favorites.splice(nameIndex, 1);

    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

export { saveToLocalStorage, getLocalStorage, removeFromLocalStorage, getLocalFavoriteData, saveLocalFavoriteData };