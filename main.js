let isUpdating = false;

const form = document.querySelector('form');
let coordinate = [19.4326, -99.1332];
let ip = {value : ""};

const getApiUrl = () => {return `https://geo.ipify.org/api/v2/country,city?apiKey=at_WIxf7H9FWb1SLNwvgvEfZLP0GsCeK&ipAddress=${ip.value}`}
let map = L.map('map').setView(coordinate, 13);
let tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
             }).addTo(map);



form.addEventListener('submit', async (event)=> {
    event.preventDefault();
    if (isUpdating) return;

    const input = document.getElementById('IP');
    if(isValidIp(input.value)){
        ip.value = input.value;
        isUpdating = true;
        await addMap();
        isUpdating = false;
    }     
})


// función asíncrona (devuelve una promise)
const getApiData = async () => {
    let apiUrl = getApiUrl();
    const response = await fetch(apiUrl); //con el await pausamos la función hasta que fetch no devuelva una respuesta, solo continúa cuando la promesa está resuelta
    const data = await response.json(); //cuando obtenemos la respuesta del response fetch, la función espera a que se obtenda la segunda promesa de fetch devoliendo los datos en formato json
    return data;
};

const newCoordinate = async () => {
    try {
        const data = await getApiData();
        let updatedCoords = [];
        updatedCoords[0] = data.location.lat;
        updatedCoords[1] = data.location.lng;
        console.log(updatedCoords);
        return updatedCoords;
    } catch(err) {
        console.log(err);
        return null;
    };
}

const createNewMap = async () => {
    if(map){
    map.remove();
    }
    let setNewCoordinate = await newCoordinate();  
    return map = L.map('map').setView(setNewCoordinate, 13);
}

const addMap = async () => {
    let newMap = await createNewMap();
    if(tileLayer){
        newMap.removeLayer(tileLayer)
    }
    return tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(newMap); 
}

function isValidIp(num){
    let parts = num.split('.');
    if(parts.length !== 4) return false;

    for(let part of parts) {
        let numPart = Number(part) // is better and secure to convert string into number 
        if(!/^\d+$/.test(part) || numPart > 255) return false;
        if(part.length > 1 && part[0] === '0') return false;
    }
    return true
}