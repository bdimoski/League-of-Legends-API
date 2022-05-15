let url = "http://ddragon.leagueoflegends.com/cdn/12.5.1/data/en_US/champion.json"
let container = document.getElementById("champions-container");
let favorites = document.getElementById('favorites');
let rolesDiv = document.getElementById('roles');
let difficultyDiv = document.getElementById('difficulties');
let searchButton = document.getElementById('searchButton');
let searchInput = document.getElementById('search');

let championsList = [];
let favoriteList = [];

// fetch data
async function makeCall(url) {
    let result = await fetch(url);
    resJson = await result.json();
    let finalData = resJson.data;
    createChamps(finalData);
    generateFilters(finalData);
}
makeCall(url);

// create champions
function createChamps(data) {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const champions = data[key];
            item = document.createElement('div');
            item.innerHTML = `
            <div class="card">
                <img src="http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champions.id}_0.jpg" alt="">               
                <span>${champions.id} 
                    <button class='${champions.key}' onclick="addToFavorites(this,${champions.key})">⭐</button>
                 </span>
            </div>
            `;
            championsList.push(champions);
            item.classList.add('item');
            item.dataset.id = champions.key;
            container.appendChild(item);
            let itemImage = item.children[0].children[0];
            itemImage.addEventListener("click", () => {
                window.open(`https://app.mobalytics.gg/lol/champions/${champions.name.toLowerCase()}/build`, '_blank').focus();
            })
        }
    }
}

// Filters
function generateFilters(data) {
    let roles = [];
    let difficulty = ['Difficulty'];

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const champions = data[key];
            roles.push(champions.tags[0]);
            difficulty.push(champions.info.difficulty);
        }
    }

    roles = [...new Set(roles)].sort(function (a, b) { return (a < b) ? -1 : (a > b) ? 1 : 0 });
    //make roles first
    roles.unshift('Roles');
    difficulty = [...new Set(difficulty)].sort(function (a, b) { return a - b });

    //generate roles
    roles.forEach(character => {
        let roles = document.createElement('option');
        roles.innerHTML = `${character}`;
        rolesDiv.appendChild(roles);
    });


    //generate difficulties
    difficulty.forEach(character => {
        let difficulty = document.createElement('option');
        difficulty.innerHTML = `${character}`;
        difficultyDiv.appendChild(difficulty);
    });
}

// search by roles
rolesDiv.addEventListener('change', () => {
    if (rolesDiv.value === "Roles") {
        container.innerHTML = "";
        createChamps(championsList);
    } else {
        let filteredCharacters = championsList.filter(character => character.tags.includes(rolesDiv.value));
        container.innerHTML = "";
        createChamps(filteredCharacters);
    }
}
);

//search by difficulty
function changeDifficulty() {
    if (difficultyDiv.value === "Difficulty") {
        container.innerHTML = "";
        createChamps(championsList);
    } else {
        let filteredCharacters = championsList.filter(character => character.info.difficulty.toString().includes(difficultyDiv.value.toString()));
        let setFilteredCharacters = [...new Set(filteredCharacters)];
        container.innerHTML = "";
        createChamps(setFilteredCharacters);
    }
}

//search by name
searchButton.addEventListener('click', () => {
    let foundCharacter = championsList.find(({ id }) => id.toLowerCase() === searchInput.value.toLowerCase());
    if (foundCharacter) {
        container.innerHTML = '';
        let card = createCard(foundCharacter);
        container.appendChild(card);
    } else {
        container.innerHTML = '';
        createChamps(championsList);
        alert('Character does not exist');
    }
    searchInput.value = '';
});

//create search card
function createCard(character) {
    let card = document.createElement('div');
    card.classList.add('card-container');
    card.innerHTML = `
    <div class="card">
        <img src="http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${character.id}_0.jpg" alt="">               
        <span >${character.id}</span>
    </div>
    `
    card.addEventListener("click", () => {
        window.open(`https://app.mobalytics.gg/lol/champions/${character.name.toLowerCase()}/build`, '_blank').focus();
    })
    return card;
}

//favorite champions
function addToFavorites(item, key) {
    let favChamp = item.closest('.item');
    let keyBtn = document.getElementsByClassName(`${key}`)[0];
    if (!favoriteList.find(champion => {
        return champion.dataset.id === favChamp.dataset.id;
    })) {
        favoriteList.push(favChamp);
        keyBtn.textContent = '';
        reCreateFavList();
    } else {
        removeElement(item)
        keyBtn.textContent = '⭐';
    }
}

function reCreateFavList() {
    favorites.innerHTML = '';
    for (const item of favoriteList) {
        let clone = item.cloneNode(true);
        clone.classList.add('faved');
        favorites.appendChild(clone);
        let championName = clone.children[0].children[1].textContent.trim();
        let cloneImage = clone.children[0].children[0];
        cloneImage.addEventListener("click", () => {
            window.open(`https://app.mobalytics.gg/lol/champions/${championName.toLowerCase()}/build`, '_blank').focus();
        })
        let cloneButton = clone.children[0].children[1].children[0];
        cloneButton.textContent = '❌';
    }
}

function removeElement(item) {
    let remChampion = item.closest('.faved');
    let index = favoriteList.findIndex(champion => {
        return champion.dataset.id === remChampion.dataset.id;
    })
    favoriteList.splice(index, 1);
    remChampion.remove();
}

function goToFavorites() {
    favorites.scrollIntoView()
}