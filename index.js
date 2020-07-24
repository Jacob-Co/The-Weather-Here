const express = require('express'); // connecting our server to the client server
const app = express();
const Database = require('nedb'); // local database following mongoDB
const database = new Database('database.db'); // creates and connects us to the local database
database.loadDatabase();
const fetch = require('node-fetch'); // library that gives us the web server function fetch
require('dotenv').config(); // env files can now be used to store environment variables

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' })); //important json body parse!!!

app.post('/api', (req, res) => {
  let data = req.body;
  console.log(req.body);
  const timeStamp = new Date().toLocaleString();
  data.timeStamp = timeStamp;
  database.insert(data);

  res.json({data});
})

app.get('/api', (req, res) => {
  database.find({}, (error, data) => {
    res.json(data);
  })
})

app.get('/weather/:coordinates', async (req, res) => {
  // index.js serves as a proxy server for open weather
  let [latitude, longitude] = req.params.coordinates.split(',');
  let weatherAPIKey = process.env.WEATHER_API_KEY;
  let weatherURL = `http://api.weatherstack.com/current?access_key=${weatherAPIKey}&query=${latitude},${longitude}`;
  let weatherResponse = await fetch(weatherURL);
  let weatherJSON = await weatherResponse.json();

  let airQURL = `https://api.openaq.org/v1/latest?coordinates=${latitude},${longitude}`;
  let airQResponse = await fetch(airQURL);
  let airQJSON = await airQResponse.json();

  console.log(airQURL)

  const data = {
    weather: weatherJSON,
    airQ: airQJSON
  }

  res.json(data);
})
// http://api.weatherstack.com/current?access_key=3692a6edd330f7d6f59da463626679da&query=40.7,-74

//http://api.weatherstack.com/current?access_key=3692a6edd330f7d6f59da463626679da&query=New%20York
// open weather api key bf4180134b436745d45b072f1a8b6dc6
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&
// exclude={part}&appid={YOUR API KEY}
// https://api.openweathermap.org/data/2.5/onecall?lat={14.563501299999999}&lon={121.0378867}&exclude={part}&appid={bf4180134b436745d45b072f1a8b6dc6}