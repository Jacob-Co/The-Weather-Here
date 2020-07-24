if ('geolocation' in navigator) {
  console.log('Geolocation available');
  navigator.geolocation.getCurrentPosition(async function(position) {
    let {longitude, latitude} = position.coords;
    longitude = Number(longitude).toFixed(2);
    latitude = Number(latitude).toFixed(2);
    const spanLatitude = document.querySelector('#latitude');
    spanLatitude.textContent = latitude;
    const spanLongitude = document.querySelector('#longitude');
    spanLongitude.textContent = longitude;

    setMap(latitude, longitude);

    let weatherJSON;
    let airQJSON;

  try {
    let weatherURL = `/weather/${latitude},${longitude}`;
    let weatherResponse = await fetch(weatherURL);
    let responseJSON = await weatherResponse.json();
    console.log(responseJSON);

    weatherJSON = responseJSON.weather;
    
    const countrySpan = document.querySelector('#country');
    countrySpan.textContent = weatherJSON.location.country;
    const citySpan = document.querySelector('#city');
    citySpan.textContent = weatherJSON.location.name;
    const summarySpan = document.querySelector('#summary');
    summarySpan.textContent = weatherJSON.current['weather_descriptions'][0];
    const temperatureSpan = document.querySelector('#temperature');
    temperatureSpan.textContent = weatherJSON.current.temperature;


    airQJSON = responseJSON.airQ;
    let airQMeasurementsJSON = airQJSON.results[0].measurements[0];

    const aqValueSpan = document.querySelector('#aq-value');
    aqValueSpan.textContent = airQMeasurementsJSON.value + airQMeasurementsJSON.unit;
    const aqDate = document.querySelector('#aq-date');
    aqDate.textContent = airQMeasurementsJSON.lastUpdated;



    } catch(e) {
      console.error(e);
    }

    document.querySelector('#check-in-btn').addEventListener('click', async function() {
      const data = {latitude, longitude, weatherJSON, airQJSON};
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        };

      let dbResponse = await fetch('/api', options);
      let dbJSON = await dbResponse.json();
      console.log(dbJSON); 
    })
  })
} else {
  console.log('Browser or system does not support geolocation')
}


function setMap(latitude, longitude) {
  let mymap = L.map('mapid').setView([latitude, longitude], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidWJldHJvbiIsImEiOiJja2N3dHJyeHMwaGVqMnhsbGJ6M2sydXJpIn0.0hqjnYYlNDf9PV_BaRHgkA', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
  }).addTo(mymap);

  let marker = L.marker([latitude, longitude]).addTo(mymap);
}
 