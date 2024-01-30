const saveToLocalStorage = (digimon) => 
{
    let favorites = getlocalStorage();

    if (!favorites.includes(digimon)) {
        favorites.push(digimon);
    }

    localStorage.setItem("Favorites", JSON.stringify(favorites));
}

const getlocalStorage = () => 
{
    let localStorageData = localStorage.getItem("Favorites");

    if (localStorageData == null) {
        return [];
    }

    return JSON.parse(localStorageData);
}

const removeFromLocalStorage = (digimon) => 
{
    let favorites = getlocalStorage();
    let namedIndex = favorites.indexOf(digimon);

    favorites.splice(namedIndex, 1);

    localStorage.setItem("Favorites", JSON.stringify(favorites))
}

export { saveToLocalStorage, getlocalStorage, removeFromLocalStorage };