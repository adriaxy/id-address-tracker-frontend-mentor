const ipAddress = document.querySelector('.ip');
const location = document.querySelector('.location');
const timezone = document.querySelector('.timezone');
const isp = document.querySelector('.isp');

const form = document.querySelector('form');
let coordinate = [40.60092, -3.70806];
let ip = {value : ""};

let map = L.map('map').setView(coordinate, 13);
let tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
             }).addTo(map);

const marker = L.marker(coordinate).addTo(map);

form.addEventListener('submit', async (event)=> {
    event.preventDefault();

    const input = document.getElementById('IP');
    if(isValidIp(input.value)){
        ip.value = input.value;
        try{
            const data = await getApiData();
            const newCoords = [data.location.lat, data.location.lng];
            // Update map and marker of the view without regenerate a new map
            map.setView(newCoords, 13);
            marker.setLatLng(newCoords);
            ipAddress.textContent = input.value;
            location.textContent = `${data.location.region}, ${data.location.country}`;
            timezone.textContent = data.location.timezone;
            isp.textContent = data.isp;
            console.log(data)
        } catch (err) {
            console.log('error:', err);
        }
    }     
})


// función asíncrona (devuelve una promise)
const getApiData = async () => {
    const response = await fetch(getApiUrl()); 
    if(!response.ok) throw new Error('API error');
    return response.json();
};

const getApiUrl = () => `https://geo.ipify.org/api/v2/country,city?apiKey=at_WIxf7H9FWb1SLNwvgvEfZLP0GsCeK&ipAddress=${ip.value}`

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