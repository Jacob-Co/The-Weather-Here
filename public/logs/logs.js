async function getData() {
  let response = await fetch('/api');
  let json = await response.json();
  return json;
}

// async function displayData() {
//   let data = await getData();
//   console.log(data);
//   data.forEach(datum => {
//     let containerDiv = document.createElement('div');
//     let latitudePara = document.createElement('p');
//     let longitudePara = document.createElement('p');
//     let timeStampPara = document.createElement('p');
//     let lineBreak = document.createElement('br');
//     containerDiv.append(timeStampPara, latitudePara, longitudePara, lineBreak);
//     document.querySelector('body').append(containerDiv);
//     latitudePara.textContent = `Latitude: ${datum.latitude}°`
//     longitudePara.textContent = `Longitude: ${datum.longitude}°`;
//     timeStampPara.textContent = `Time Stamp: ${datum.timeStamp}`;
//   })
// }

async function displayMapData() {
  let dataSet = await getData();
  let mymap = L.map('mapid').setView([0, 0], 1);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidWJldHJvbiIsImEiOiJja2N3dHJyeHMwaGVqMnhsbGJ6M2sydXJpIn0.0hqjnYYlNDf9PV_BaRHgkA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
  }).addTo(mymap);

  dataSet.forEach(data => {
    let lat = data.latitude;
    let lon = data.longitude;
    let name = `${data.weatherJSON.location.name}, ${data.weatherJSON.location.country}`;
    let weather = `${data.weatherJSON.current['weather_descriptions'][0]}, ${data.weatherJSON.current.temperature}`


    let marker = L.marker([lat, lon]).addTo(mymap);

    let markerContent = `<b>${name}</b></br>Weather: ${weather}°C<br/>Air Quality: `

    if (data.airQJSON.results[0] === undefined) {
      markerContent += 'Not Available';
    } else {
      let airQMeasurements = data.airQJSON.results[0].measurements[0];
      let airQValue = airQMeasurements.value + airQMeasurements.unit;
      markerContent += airQValue;
    }

    marker.bindPopup(markerContent);
  })
}

displayMapData();