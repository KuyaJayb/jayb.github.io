const apiKey="6e42eb5446cfe81a4f0f5f9c94a05c8a";
const city="San Jose,Camarines Sur,PH";

document.getElementById("date").innerText=new Date().toDateString();

/* WEATHER */

async function getWeather(){

const res=await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
);

const data=await res.json();

document.getElementById("temperature").innerText=
Math.round(data.main.temp)+"°C";

document.getElementById("description").innerText=
data.weather[0].description;

document.getElementById("humidity").innerText=
data.main.humidity+"%";

let wind=data.wind.speed*3.6;

document.getElementById("wind").innerText=
wind.toFixed(1)+" km/h";

document.getElementById("icon").src=
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

detectSignal(wind);

}

/* SIGNAL WARNING */

function detectSignal(wind){

let signal=0;

if(wind>=39 && wind<=61) signal=1;
else if(wind>=62 && wind<=88) signal=2;
else if(wind>=89 && wind<=117) signal=3;
else if(wind>=118 && wind<=184) signal=4;
else if(wind>=185) signal=5;

if(signal>0){

document.getElementById("signalWarning").style.display="block";

document.getElementById("signalLevel").innerText=signal;

}

}

/* FORECAST */

async function getForecast(){

const res=await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
);

const data=await res.json();

const container=document.getElementById("forecast");

container.innerHTML="";

for(let i=0;i<7;i++){

let item=data.list[i*8];

let day=document.createElement("div");

day.className="day";

day.innerHTML=`
<p>${new Date(item.dt*1000)
.toLocaleDateString('en-US',{weekday:'short'})}</p>
<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
<p>${Math.round(item.main.temp)}°C</p>
`;

container.appendChild(day);

}

}

/* FORECAST SCROLL */

function moveLeft(){
document.getElementById("forecast").scrollLeft-=120;
}

function moveRight(){
document.getElementById("forecast").scrollLeft+=120;
}

/* LIVE WEATHER MAP */

function initMap(){

const lat=13.699;
const lon=123.520;

const map=L.map('map').setView([lat,lon],7);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

/* WEATHER LAYERS */

const rainLayer=L.tileLayer(
`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
{opacity:0.6}
);

const cloudLayer=L.tileLayer(
`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
{opacity:0.5}
);

const windLayer=L.tileLayer(
`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
{opacity:0.6}
);

const tempLayer=L.tileLayer(
`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
{opacity:0.5}
);

rainLayer.addTo(map);

const overlayMaps={
"🌧 Rain Radar":rainLayer,
"☁ Clouds":cloudLayer,
"🌡 Temperature":tempLayer,
"💨 Wind":windLayer
};

L.control.layers(null,overlayMaps).addTo(map);

L.marker([lat,lon])
.addTo(map)
.bindPopup("San Jose, Camarines Sur")
.openPopup();

}

/* START */

getWeather();
getForecast();
initMap();